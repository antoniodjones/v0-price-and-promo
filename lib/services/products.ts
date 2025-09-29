import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import type { Product, PriceData } from "@/lib/types"

export async function getProducts(filters?: {
  category?: string
  brand?: string
  search?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
}) {
  const supabase = await createClient()

  let query = supabase.from("products").select("*").order("created_at", { ascending: false })

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.brand && filters.brand !== "all") {
    query = query.eq("brand", filters.brand)
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,category.ilike.%${filters.search}%`,
    )
  }

  if (filters?.priceMin !== undefined) {
    query = query.gte("price", filters.priceMin)
  }

  if (filters?.priceMax !== undefined) {
    query = query.lte("price", filters.priceMax)
  }

  if (filters?.inStock) {
    query = query.gt("inventory_count", 0)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as Product[]
}

export async function getProductsClient(filters?: {
  category?: string
  brand?: string
  search?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
}) {
  const supabase = createBrowserClient()

  let query = supabase.from("products").select("*").order("created_at", { ascending: false })

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.brand && filters.brand !== "all") {
    query = query.eq("brand", filters.brand)
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,category.ilike.%${filters.search}%`,
    )
  }

  if (filters?.priceMin !== undefined) {
    query = query.gte("price", filters.priceMin)
  }

  if (filters?.priceMax !== undefined) {
    query = query.lte("price", filters.priceMax)
  }

  if (filters?.inStock) {
    query = query.gt("inventory_count", 0)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as Product[]
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data as Product
}

export async function getProductByIdClient(id: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data as Product
}

export async function getProductPriceData(productId: string, useServerClient = true): Promise<PriceData | null> {
  const supabase = useServerClient ? await createClient() : createBrowserClient()

  try {
    // First, try to get the latest price from price_history
    const { data: priceHistoryData, error: priceHistoryError } = await supabase
      .from("price_history")
      .select("price, original_price, last_updated")
      .eq("product_id", productId)
      .order("last_updated", { ascending: false })
      .limit(2) // Get latest 2 records to calculate price change

    // Get product base price as fallback
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("price, updated_at")
      .eq("id", productId)
      .single()

    if (productError) {
      console.error("Error fetching product data:", productError)
      return null
    }

    // If we have price history data, use it
    if (priceHistoryData && priceHistoryData.length > 0 && !priceHistoryError) {
      const latestPrice = priceHistoryData[0]
      const previousPrice = priceHistoryData.length > 1 ? priceHistoryData[1] : null

      const currentPrice = latestPrice.price || productData.price || 0
      const prevPrice = previousPrice?.price || latestPrice.original_price || productData.price || 0
      const priceChange = currentPrice - prevPrice
      const priceChangePercentage = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0

      return {
        current_price: currentPrice,
        previous_price: prevPrice,
        price_change: priceChange,
        price_change_percentage: priceChangePercentage,
        last_updated: latestPrice.last_updated || new Date().toISOString(),
      } as PriceData
    }

    // Fallback to product base price if no price history
    return {
      current_price: productData.price || 0,
      previous_price: null,
      price_change: 0,
      price_change_percentage: 0,
      last_updated: productData.updated_at || new Date().toISOString(),
    } as PriceData
  } catch (error) {
    console.error("Error fetching price data:", error)

    // Final fallback - try to get just the product price
    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("price, updated_at")
        .eq("id", productId)
        .single()

      if (productError) {
        console.error("Error fetching product fallback data:", productError)
        return null
      }

      return {
        current_price: productData.price || 0,
        previous_price: null,
        price_change: 0,
        price_change_percentage: 0,
        last_updated: productData.updated_at || new Date().toISOString(),
      } as PriceData
    } catch (fallbackError) {
      console.error("Error in fallback price fetch:", fallbackError)
      return null
    }
  }
}

export async function getProductPriceDataClient(productId: string): Promise<PriceData | null> {
  return getProductPriceData(productId, false)
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").select("category").not("category", "is", null)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  const uniqueCategories = [...new Set(data.map((item) => item.category))]
  return uniqueCategories.filter(Boolean)
}

export async function getCategoriesClient() {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("products").select("category").not("category", "is", null)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  const uniqueCategories = [...new Set(data.map((item) => item.category))]
  return uniqueCategories.filter(Boolean)
}

export async function getBrands() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").select("brand").not("brand", "is", null)

  if (error) {
    console.error("Error fetching brands:", error)
    return []
  }

  const uniqueBrands = [...new Set(data.map((item) => item.brand))]
  return uniqueBrands.filter(Boolean)
}

export async function getBrandsClient() {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("products").select("brand").not("brand", "is", null)

  if (error) {
    console.error("Error fetching brands:", error)
    return []
  }

  const uniqueBrands = [...new Set(data.map((item) => item.brand))]
  return uniqueBrands.filter(Boolean)
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").insert([product]).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data as Product
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating product:", error)
    throw error
  }

  return data as Product
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}
