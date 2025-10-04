"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getTierDiscounts() {
  try {
    const supabase = await createServerClient()
    const { data: discounts, error } = await supabase
      .from("tier_discounts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data: discounts }
  } catch (error) {
    console.error("[v0] Error fetching tier discounts:", error)
    return { success: false, error: "Failed to fetch tier discounts" }
  }
}

export async function getTierDiscount(id: string) {
  try {
    const supabase = await createServerClient()
    const { data: discount, error } = await supabase.from("tier_discounts").select("*").eq("id", id).single()

    if (error) throw error
    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error fetching tier discount:", error)
    return { success: false, error: "Failed to fetch tier discount" }
  }
}

export async function createTierDiscount(data: {
  name: string
  description?: string
  discount_type: "brand" | "category" | "product"
  target_id: string
  tier_a_discount: number
  tier_b_discount: number
  tier_c_discount: number
  start_date?: string
  end_date?: string
  is_active?: boolean
}) {
  try {
    const supabase = await createServerClient()
    const { data: discount, error } = await supabase
      .from("tier_discounts")
      .insert({
        name: data.name,
        description: data.description || null,
        discount_type: data.discount_type,
        target_id: data.target_id,
        tier_a_discount: data.tier_a_discount,
        tier_b_discount: data.tier_b_discount,
        tier_c_discount: data.tier_c_discount,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error creating tier discount:", error)
    return { success: false, error: "Failed to create tier discount" }
  }
}

export async function updateTierDiscount(
  id: string,
  data: {
    name?: string
    description?: string
    tier_a_discount?: number
    tier_b_discount?: number
    tier_c_discount?: number
    start_date?: string
    end_date?: string
    is_active?: boolean
  },
) {
  try {
    const supabase = await createServerClient()
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.tier_a_discount !== undefined) updateData.tier_a_discount = data.tier_a_discount
    if (data.tier_b_discount !== undefined) updateData.tier_b_discount = data.tier_b_discount
    if (data.tier_c_discount !== undefined) updateData.tier_c_discount = data.tier_c_discount
    if (data.start_date !== undefined) updateData.start_date = data.start_date
    if (data.end_date !== undefined) updateData.end_date = data.end_date
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    const { data: discount, error } = await supabase
      .from("tier_discounts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error updating tier discount:", error)
    return { success: false, error: "Failed to update tier discount" }
  }
}

export async function deleteTierDiscount(id: string) {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from("tier_discounts").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting tier discount:", error)
    return { success: false, error: "Failed to delete tier discount" }
  }
}

export async function getCustomerTierAssignments(customerId: string) {
  try {
    const supabase = await createServerClient()
    const { data: assignments, error } = await supabase
      .from("customer_tier_assignments")
      .select("*")
      .eq("customer_id", customerId)

    if (error) throw error
    return { success: true, data: assignments }
  } catch (error) {
    console.error("[v0] Error fetching tier assignments:", error)
    return { success: false, error: "Failed to fetch tier assignments" }
  }
}

export async function assignCustomerToTier(data: {
  customer_id: string
  tier_discount_id: string
  assigned_tier: "A" | "B" | "C"
}) {
  try {
    const supabase = await createServerClient()
    const { data: assignment, error } = await supabase
      .from("customer_tier_assignments")
      .upsert(
        {
          customer_id: data.customer_id,
          tier_discount_id: data.tier_discount_id,
          assigned_tier: data.assigned_tier,
        },
        {
          onConflict: "customer_id,tier_discount_id",
        },
      )
      .select()
      .single()

    if (error) throw error
    return { success: true, data: assignment }
  } catch (error) {
    console.error("[v0] Error assigning customer to tier:", error)
    return { success: false, error: "Failed to assign customer to tier" }
  }
}
