"use server"

import { createClient } from "@/lib/supabase/server"

export async function getProducts() {
  try {
    console.log("[v0] getProducts: Starting query")

    const supabase = await createClient()

    const { data: products, error } = await supabase.from("products").select("*").order("name", { ascending: true })

    if (error) {
      console.error("[v0] getProducts: Supabase error:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] getProducts: Query successful, count:", products?.length || 0)
    return { success: true, data: products || [] }
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" }
  }
}

export async function getProduct(id: string) {
  try {
    const supabase = await createClient()

    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] getProduct: Supabase error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: product }
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return { success: false, error: "Failed to fetch product" }
  }
}

export async function getBrands() {
  try {
    const supabase = await createClient()

    const { data: brands, error } = await supabase
      .from("products")
      .select("brand")
      .not("brand", "is", null)
      .order("brand", { ascending: true })

    if (error) {
      console.error("[v0] getBrands: Supabase error:", error)
      return { success: false, error: error.message }
    }

    // Get distinct brands
    const distinctBrands = [...new Set(brands?.map((b) => b.brand) || [])].map((name) => ({ name }))

    return { success: true, data: distinctBrands }
  } catch (error) {
    console.error("[v0] Error fetching brands:", error)
    return { success: false, error: "Failed to fetch brands" }
  }
}

export async function getCategories() {
  try {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null)
      .order("category", { ascending: true })

    if (error) {
      console.error("[v0] getCategories: Supabase error:", error)
      return { success: false, error: error.message }
    }

    // Get distinct categories
    const distinctCategories = [...new Set(categories?.map((c) => c.category) || [])].map((name) => ({ name }))

    return { success: true, data: distinctCategories }
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}
