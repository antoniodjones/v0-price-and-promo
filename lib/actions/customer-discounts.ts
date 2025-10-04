"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCustomerDiscounts() {
  try {
    console.log("[v0] Fetching customer discounts...")
    const supabase = await createClient()

    // It uses customer_tiers array and is linked via customer_discount_assignments table
    const { data: discounts, error } = await supabase
      .from("customer_discounts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching customer discounts:", error)
      throw error
    }

    console.log("[v0] Successfully fetched customer discounts:", discounts?.length || 0)
    return { success: true, data: discounts }
  } catch (error) {
    console.error("[v0] Error fetching customer discounts:", error)
    return { success: false, error: "Failed to fetch customer discounts" }
  }
}

export async function getCustomerDiscount(id: string) {
  try {
    const supabase = await createClient()

    const { data: discount, error: discountError } = await supabase
      .from("customer_discounts")
      .select("*")
      .eq("id", id)
      .single()

    if (discountError) throw discountError

    // Get assigned customers
    const { data: assignments, error: assignmentsError } = await supabase
      .from("customer_discount_assignments")
      .select(`
        customer_id,
        customer:customers(
          id,
          business_legal_name,
          cannabis_license_number,
          tier
        )
      `)
      .eq("discount_id", id)

    if (assignmentsError) {
      console.error("[v0] Error fetching assignments:", assignmentsError)
    }

    return {
      success: true,
      data: {
        ...discount,
        assignments: assignments || [],
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching customer discount:", error)
    return { success: false, error: "Failed to fetch customer discount" }
  }
}

export async function createCustomerDiscount(data: {
  name: string
  type: "percentage" | "fixed"
  value: number
  level: "brand" | "category" | "sub_category" | "product"
  target: string
  customer_tiers: string[]
  markets?: string[]
  start_date?: string
  end_date?: string
  status?: "active" | "inactive" | "scheduled"
  customer_ids?: string[]
}) {
  try {
    console.log("[v0] Received discount creation request:", data)
    const supabase = await createClient()

    // Create the discount
    const { data: discount, error: discountError } = await supabase
      .from("customer_discounts")
      .insert({
        name: data.name,
        type: data.type,
        value: data.value,
        level: data.level,
        target: data.target,
        customer_tiers: data.customer_tiers,
        markets: data.markets || [],
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        status: data.status || "active",
      })
      .select()
      .single()

    if (discountError) {
      console.error("[v0] Error creating discount:", discountError)
      throw discountError
    }

    console.log("[v0] Created discount:", discount)

    if (data.customer_ids && data.customer_ids.length > 0) {
      const uniqueCustomerIds = Array.from(new Set(data.customer_ids))
      console.log("[v0] Creating customer assignments for:", uniqueCustomerIds)

      const assignments = uniqueCustomerIds.map((customer_id) => ({
        discount_id: discount.id,
        customer_id,
      }))

      const { error: assignmentError } = await supabase.from("customer_discount_assignments").insert(assignments)

      if (assignmentError) {
        console.error("[v0] Error creating assignments:", assignmentError.message)
        // Don't fail the whole operation if assignments fail
      }
    }

    console.log("[v0] Successfully created customer discount:", discount.id)
    return { success: true, data: discount, message: "Customer discount created successfully" }
  } catch (error) {
    console.error("[v0] Error creating customer discount:", error)
    return { success: false, error: "Failed to create customer discount" }
  }
}

export async function updateCustomerDiscount(
  id: string,
  data: {
    name?: string
    value?: number
    start_date?: string
    end_date?: string
    status?: "active" | "inactive" | "scheduled"
    customer_ids?: string[]
  },
) {
  try {
    const supabase = await createClient()
    const updateData: any = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.value !== undefined) updateData.value = data.value
    if (data.start_date !== undefined) updateData.start_date = data.start_date
    if (data.end_date !== undefined) updateData.end_date = data.end_date
    if (data.status !== undefined) updateData.status = data.status

    const { data: discount, error: discountError } = await supabase
      .from("customer_discounts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (discountError) throw discountError

    // Update customer assignments if provided
    if (data.customer_ids !== undefined) {
      // Delete existing assignments
      await supabase.from("customer_discount_assignments").delete().eq("discount_id", id)

      // Create new assignments
      if (data.customer_ids.length > 0) {
        const assignments = data.customer_ids.map((customer_id) => ({
          discount_id: id,
          customer_id,
        }))

        await supabase.from("customer_discount_assignments").insert(assignments)
      }
    }

    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error updating customer discount:", error)
    return { success: false, error: "Failed to update customer discount" }
  }
}

export async function deleteCustomerDiscount(id: string) {
  try {
    const supabase = await createClient()

    // Delete assignments first (foreign key constraint)
    await supabase.from("customer_discount_assignments").delete().eq("discount_id", id)

    // Then delete the discount
    const { error } = await supabase.from("customer_discounts").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting customer discount:", error)
    return { success: false, error: "Failed to delete customer discount" }
  }
}
