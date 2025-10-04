"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getInventoryDiscounts() {
  try {
    const supabase = await createServerClient()
    const { data: discounts, error } = await supabase
      .from("inventory_discounts")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data: discounts }
  } catch (error) {
    console.error("[v0] Error fetching inventory discounts:", error)
    return { success: false, error: "Failed to fetch inventory discounts" }
  }
}

export async function getInventoryDiscount(id: string) {
  try {
    const supabase = await createServerClient()
    const { data: discount, error } = await supabase.from("inventory_discounts").select("*").eq("id", id).single()

    if (error) throw error
    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error fetching inventory discount:", error)
    return { success: false, error: "Failed to fetch inventory discount" }
  }
}

export async function createInventoryDiscount(data: {
  name: string
  description?: string
  rule_type: "expiration" | "inventory" | "thc" | "category" | "brand"
  conditions: Record<string, any>
  discount_type: "percentage" | "fixed"
  discount_value: number
  priority?: number
  is_active?: boolean
}) {
  try {
    const supabase = await createServerClient()
    const { data: discount, error } = await supabase
      .from("inventory_discounts")
      .insert({
        name: data.name,
        description: data.description || null,
        rule_type: data.rule_type,
        conditions: data.conditions,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        priority: data.priority || 100,
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error creating inventory discount:", error)
    return { success: false, error: "Failed to create inventory discount" }
  }
}

export async function updateInventoryDiscount(
  id: string,
  data: {
    name?: string
    description?: string
    conditions?: Record<string, any>
    discount_type?: "percentage" | "fixed"
    discount_value?: number
    priority?: number
    is_active?: boolean
  },
) {
  try {
    const supabase = await createServerClient()
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.conditions !== undefined) updateData.conditions = data.conditions
    if (data.discount_type !== undefined) updateData.discount_type = data.discount_type
    if (data.discount_value !== undefined) updateData.discount_value = data.discount_value
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    const { data: discount, error } = await supabase
      .from("inventory_discounts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: discount }
  } catch (error) {
    console.error("[v0] Error updating inventory discount:", error)
    return { success: false, error: "Failed to update inventory discount" }
  }
}

export async function deleteInventoryDiscount(id: string) {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from("inventory_discounts").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting inventory discount:", error)
    return { success: false, error: "Failed to delete inventory discount" }
  }
}
