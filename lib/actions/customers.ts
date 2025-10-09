"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCustomers(search?: string) {
  try {
    console.log("[v0] getCustomers: Starting", search ? `with search: ${search}` : "")
    const supabase = await createClient()

    let query = supabase.from("customers").select("*")

    if (search && search.trim()) {
      const searchTerm = search.trim()
      query = query.or(
        `business_legal_name.ilike.%${searchTerm}%,dba_name.ilike.%${searchTerm}%,cannabis_license_number.ilike.%${searchTerm}%,account_number.ilike.%${searchTerm}%`,
      )
    }

    const { data: customers, error } = await query.order("business_legal_name", { ascending: true })

    if (error) {
      console.error("[v0] getCustomers: Supabase error:", error)
      throw error
    }

    console.log("[v0] getCustomers: Success, found", customers?.length || 0, "customers")
    return { success: true, data: customers }
  } catch (error) {
    console.error("[v0] Error fetching customers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customers",
    }
  }
}

export async function getCustomer(id: string) {
  try {
    const supabase = await createClient()
    const { data: customer, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) throw error
    return { success: true, data: customer }
  } catch (error) {
    console.error("[v0] Error fetching customer:", error)
    return { success: false, error: "Failed to fetch customer" }
  }
}

export async function createCustomer(data: {
  name: string
  license_number: string
  email?: string
  phone?: string
  address?: string
  customer_type?: string
  is_active?: boolean
}) {
  try {
    const supabase = await createClient()
    const { data: customer, error } = await supabase
      .from("customers")
      .insert({
        name: data.name,
        license_number: data.license_number,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        customer_type: data.customer_type || "retail",
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data: customer }
  } catch (error) {
    console.error("[v0] Error creating customer:", error)
    return { success: false, error: "Failed to create customer" }
  }
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string
    email?: string
    phone?: string
    address?: string
    customer_type?: string
    is_active?: boolean
  },
) {
  try {
    const supabase = await createClient()
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.customer_type !== undefined) updateData.customer_type = data.customer_type
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    const { data: customer, error } = await supabase.from("customers").update(updateData).eq("id", id).select().single()

    if (error) throw error
    return { success: true, data: customer }
  } catch (error) {
    console.error("[v0] Error updating customer:", error)
    return { success: false, error: "Failed to update customer" }
  }
}

export async function deleteCustomer(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting customer:", error)
    return { success: false, error: "Failed to delete customer" }
  }
}
