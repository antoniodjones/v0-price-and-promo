import { createClient } from "@/lib/supabase/server"

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  price: number
  cost: number
  inventory_count: number
  thc_percentage: number
  expiration_date: string
  batch_id: string
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  sku: string
  category: string
  brand: string
  price: number
  cost: number
  inventory_count: number
  thc_percentage: number
  expiration_date: string
  batch_id: string
}

export interface Customer {
  id: string
  name: string
  email: string
  // ... other customer fields
}

export interface CustomerDiscount {
  id: string
  customer_id: string
  discount_percentage: number
  status: string
  // ... other discount fields
}

export interface InventoryDiscount {
  id: string
  product_id: string
  discount_percentage: number
  status: string
  // ... other discount fields
}

export interface BogoPromotion {
  id: string
  buy_product_id: string
  get_product_id: string
  buy_quantity: number
  get_quantity: number
  status: string
  // ... other BOGO fields
}

export interface BundleDeal {
  id: string
  name: string
  products: string[] // Array of product IDs
  bundle_price: number
  status: string
  // ... other bundle fields
}

const logError = (message: string, error: any) => {
  console.error(`${message}:`, error)
}

export const db = {
  async getProducts(page = 1, limit = 20) {
    const supabase = await createClient()

    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return {
      data: data || [],
      total: count || 0,
    }
  },

  async getProduct(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return data
  },

  async createProduct(productData: CreateProductData) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("products").insert([productData]).select().single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return data
  },

  async updateProduct(id: string, productData: Partial<CreateProductData>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return data
  },

  async deleteProduct(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    return { success: true }
  },

  // Customer methods
  async getCustomer(customerId: string): Promise<Customer | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("customers").select("*").eq("id", customerId).single()

      if (error) {
        if (error.code === "PGRST116") return null // Not found
        throw error
      }

      return data
    } catch (error) {
      logError("Error fetching customer", error)
      throw error
    }
  },

  // Product methods for pricing
  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("products").select("*").in("id", productIds)

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching products by IDs", error)
      throw error
    }
  },

  // Discount methods
  async getCustomerDiscounts(): Promise<CustomerDiscount[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("customer_discounts").select("*").eq("status", "active")

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching customer discounts", error)
      throw error
    }
  },

  async getInventoryDiscounts(): Promise<InventoryDiscount[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("inventory_discounts").select("*").eq("status", "active")

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching inventory discounts", error)
      throw error
    }
  },

  async getBogoPromotions(): Promise<BogoPromotion[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("bogo_promotions").select("*").eq("status", "active")

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching BOGO promotions", error)
      throw error
    }
  },

  async getBundleDeals(): Promise<BundleDeal[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("bundle_deals").select("*").eq("status", "active")

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching bundle deals", error)
      throw error
    }
  },
}
