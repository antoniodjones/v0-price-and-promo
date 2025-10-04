"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getBundleDeals() {
  try {
    const supabase = await createServerClient()
    const { data: bundles, error } = await supabase
      .from("bundle_deals")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data: bundles }
  } catch (error) {
    console.error("[v0] Error fetching bundle deals:", error)
    return { success: false, error: "Failed to fetch bundle deals" }
  }
}

export async function getBundleDeal(id: string) {
  try {
    const supabase = await createServerClient()
    const { data: bundle, error } = await supabase.from("bundle_deals").select("*").eq("id", id).single()

    if (error) throw error

    // Get bundle items
    const { data: items, error: itemsError } = await supabase.from("bundle_items").select("*").eq("bundle_id", id)

    if (itemsError) throw itemsError

    return {
      success: true,
      data: {
        ...bundle,
        items,
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching bundle deal:", error)
    return { success: false, error: "Failed to fetch bundle deal" }
  }
}

export async function createBundleDeal(data: {
  name: string
  description?: string
  bundle_type: "fixed" | "mix_and_match" | "tiered"
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_quantity?: number
  max_quantity?: number
  start_date?: string
  end_date?: string
  is_active?: boolean
  items: Array<{
    product_id: string
    quantity: number
    is_required: boolean
  }>
}) {
  try {
    const supabase = await createServerClient()

    // Create bundle
    const { data: bundle, error: bundleError } = await supabase
      .from("bundle_deals")
      .insert({
        name: data.name,
        description: data.description || null,
        bundle_type: data.bundle_type,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        min_quantity: data.min_quantity || null,
        max_quantity: data.max_quantity || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .select()
      .single()

    if (bundleError) throw bundleError

    // Create bundle items
    const itemsToInsert = data.items.map((item) => ({
      bundle_id: bundle.id,
      product_id: item.product_id,
      quantity: item.quantity,
      is_required: item.is_required,
    }))

    const { error: itemsError } = await supabase.from("bundle_items").insert(itemsToInsert)

    if (itemsError) throw itemsError

    return { success: true, data: bundle }
  } catch (error) {
    console.error("[v0] Error creating bundle deal:", error)
    return { success: false, error: "Failed to create bundle deal" }
  }
}

export async function updateBundleDeal(
  id: string,
  data: {
    name?: string
    description?: string
    discount_type?: "percentage" | "fixed"
    discount_value?: number
    min_quantity?: number
    max_quantity?: number
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
    if (data.discount_type !== undefined) updateData.discount_type = data.discount_type
    if (data.discount_value !== undefined) updateData.discount_value = data.discount_value
    if (data.min_quantity !== undefined) updateData.min_quantity = data.min_quantity
    if (data.max_quantity !== undefined) updateData.max_quantity = data.max_quantity
    if (data.start_date !== undefined) updateData.start_date = data.start_date
    if (data.end_date !== undefined) updateData.end_date = data.end_date
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    const { data: bundle, error } = await supabase
      .from("bundle_deals")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: bundle }
  } catch (error) {
    console.error("[v0] Error updating bundle deal:", error)
    return { success: false, error: "Failed to update bundle deal" }
  }
}

export async function deleteBundleDeal(id: string) {
  try {
    const supabase = await createServerClient()

    // Delete bundle items first
    const { error: itemsError } = await supabase.from("bundle_items").delete().eq("bundle_id", id)

    if (itemsError) throw itemsError

    // Delete bundle
    const { error } = await supabase.from("bundle_deals").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting bundle deal:", error)
    return { success: false, error: "Failed to delete bundle deal" }
  }
}
