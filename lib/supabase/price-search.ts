// Price search utilities for product search and filtering

import { createClient } from "./client"

export interface PriceSource {
  id: string
  name: string
  type: string
  lastUpdated: string
}

export interface ProductCategory {
  id: string
  name: string
  productCount: number
}

export interface SearchProductsParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}

export interface SearchProductsResult {
  products: any[]
  total: number
  hasMore: boolean
}

export async function searchProducts(params: SearchProductsParams): Promise<SearchProductsResult> {
  const supabase = createClient()
  const { query, category, minPrice, maxPrice, limit = 20, offset = 0 } = params

  let queryBuilder = supabase.from("products").select("*", { count: "exact" })

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,sku.ilike.%${query}%,brand.ilike.%${query}%`)
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  if (minPrice !== undefined) {
    queryBuilder = queryBuilder.gte("base_price", minPrice)
  }

  if (maxPrice !== undefined) {
    queryBuilder = queryBuilder.lte("base_price", maxPrice)
  }

  queryBuilder = queryBuilder.range(offset, offset + limit - 1).order("name")

  const { data, error, count } = await queryBuilder

  if (error) {
    console.error("[v0] Error searching products:", error)
    throw error
  }

  return {
    products: data || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  }
}

export async function getPriceSources(): Promise<PriceSource[]> {
  // Mock implementation - replace with actual data source
  return [
    {
      id: "internal",
      name: "Internal Pricing",
      type: "database",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "vendor",
      name: "Vendor Pricing",
      type: "api",
      lastUpdated: new Date().toISOString(),
    },
  ]
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("products").select("category").order("category")

  if (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }

  // Group by category and count
  const categoryMap = new Map<string, number>()
  data?.forEach((item) => {
    const count = categoryMap.get(item.category) || 0
    categoryMap.set(item.category, count + 1)
  })

  return Array.from(categoryMap.entries()).map(([name, productCount]) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    productCount,
  }))
}

export async function refreshPriceData(): Promise<{ success: boolean; message: string }> {
  try {
    // Mock implementation - replace with actual refresh logic
    console.log("[v0] Refreshing price data...")

    // Simulate API call or data sync
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "Price data refreshed successfully",
    }
  } catch (error) {
    console.error("[v0] Error refreshing price data:", error)
    return {
      success: false,
      message: "Failed to refresh price data",
    }
  }
}
