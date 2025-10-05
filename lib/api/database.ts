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

export interface CreateCustomerData {
  business_legal_name: string // Renamed from 'name'
  tier: string
  market: string
  status?: string
  lifetime_value?: number
}

export interface CreateCustomerDiscountData {
  customer_id: string
  discount_percentage: number
  discount_type: string
  start_date: string
  end_date?: string
  status?: string
  min_purchase_amount?: number
  max_discount_amount?: number
}

export interface CreateInventoryDiscountData {
  product_id: string
  discount_percentage: number
  discount_type: string
  reason: string
  start_date: string
  end_date?: string
  status?: string
  min_quantity?: number
  max_quantity?: number
}

export interface CreateBogoPromotionData {
  name: string
  buy_product_id: string
  get_product_id: string
  buy_quantity: number
  get_quantity: number
  discount_percentage: number
  start_date: string
  end_date?: string
  status?: string
  customer_tiers?: string[]
  markets?: string[]
}

export interface CreateBundleDealData {
  name: string
  type?: "percentage" | "fixed" | "bogo" | "tiered"
  description?: string
  products: string[]
  discountType?: string
  discountValue?: number
  minQuantity?: number
  startDate: string
  endDate?: string
  status?: string
}

export interface Customer {
  id: string
  business_legal_name: string // Renamed from 'name'
  tier: string
  market: string
  status: string
  lifetime_value: number
  created_at: string
  updated_at: string
}

export interface CustomerDiscount {
  id: string
  customer_id: string
  discount_percentage: number
  discount_type: string
  start_date: string
  end_date?: string
  status: string
  min_purchase_amount?: number
  max_discount_amount?: number
  created_at: string
  updated_at: string
}

export interface InventoryDiscount {
  id: string
  product_id: string
  discount_percentage: number
  discount_type: string
  reason: string
  start_date: string
  end_date?: string
  status: string
  min_quantity?: number
  max_quantity?: number
  created_at: string
  updated_at: string
}

export interface BogoPromotion {
  id: string
  name: string
  buy_product_id: string
  get_product_id: string
  buy_quantity: number
  get_quantity: number
  discount_percentage: number
  start_date: string
  end_date?: string
  status: string
  customer_tiers?: string[]
  markets?: string[]
  created_at: string
  updated_at: string
}

export interface BundleDeal {
  id: string
  name: string
  description?: string
  type?: "fixed" | "category" | "mix_match" | "tiered"
  products: string[] // Array of product IDs
  bundle_price: number
  discount_percentage: number
  start_date: string
  end_date?: string
  status: string
  min_quantity?: number
  max_quantity?: number
  created_at: string
  updated_at: string
}

export interface PromotionHistory {
  id: string
  promotion_id: string
  product_id: string | null
  promotion_type: string
  date_tracked: string
  usage_count: number
  revenue_impact: number
  cost_impact: number
  metadata: {
    promotion_name?: string
    product_name?: string
    discount_percentage?: number
    [key: string]: any
  }
}

export interface PromotionHistoryStats {
  totalPromotions: number
  totalUsage: number
  totalRevenue: number
  totalCost: number
  avgRevenuePerPromotion: number
  avgUsagePerPromotion: number
}

export interface DiscountRule {
  id: string
  name: string
  description?: string
  rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
  level: "brand" | "category" | "subcategory" | "product"
  target_id?: string
  target_name?: string
  start_date: string
  end_date?: string
  status: "active" | "inactive" | "scheduled" | "expired"
  created_by?: string
  created_at: string
  updated_at: string
}

export interface DiscountRuleTier {
  id: string
  rule_id: string
  tier: "A" | "B" | "C"
  discount_type: "percentage" | "fixed_amount" | "price_override"
  discount_value: number
  min_quantity?: number
  max_quantity?: number
  created_at: string
}

export interface CustomerTierAssignment {
  id: string
  rule_id: string
  customer_id: string
  tier: "A" | "B" | "C"
  assigned_date: string
  assigned_by?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface TierAssignmentAudit {
  id: string
  assignment_id?: string
  rule_id: string
  customer_id: string
  action: "assigned" | "updated" | "removed"
  old_tier?: "A" | "B" | "C"
  new_tier?: "A" | "B" | "C"
  changed_by?: string
  changed_at: string
  reason?: string
}

export interface CreateDiscountRuleData {
  name: string
  description?: string
  rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
  level: "brand" | "category" | "subcategory" | "product"
  target_id?: string
  target_name?: string
  start_date: string
  end_date?: string
  status?: "active" | "inactive" | "scheduled" | "expired"
  created_by?: string
  tiers: Array<{
    tier: "A" | "B" | "C"
    discount_type: "percentage" | "fixed_amount" | "price_override"
    discount_value: number
    min_quantity?: number
    max_quantity?: number
  }>
}

export interface CreateTierAssignmentData {
  rule_id: string
  customer_id: string
  tier: "A" | "B" | "C"
  assigned_by?: string
  notes?: string
}

const logError = (message: string, error: any) => {
  console.error(`${message}:`, error)
}

export async function getVendorRebates(filters?: {
  vendor?: string | null
  period?: string | null
  status?: string | null
  page?: number
  limit?: number
}) {
  try {
    const supabase = await createClient()

    let query = supabase.from("vendor_rebates").select("*", { count: "exact" })

    // Apply filters if provided
    if (filters?.vendor) {
      query = query.eq("vendor_name", filters.vendor)
    }

    if (filters?.period) {
      query = query.eq("period", filters.period)
    }

    if (filters?.status) {
      query = query.eq("status", filters.status)
    } else {
      // Default to active if no status filter provided
      query = query.eq("status", "active")
    }

    // Apply pagination
    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit
      query = query.range(offset, offset + filters.limit - 1)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) {
      // If table doesn't exist, return empty result
      if (error.code === "42P01") {
        console.warn("vendor_rebates table does not exist yet")
        return { data: [], total: 0 }
      }
      throw error
    }

    return { data: data || [], total: count || 0 }
  } catch (error) {
    logError("Error fetching vendor rebates", error)
    return { data: [], total: 0 }
  }
}

export async function calculateRebateData(params: {
  vendorName: string
  period: string
  rebateRate: number
}) {
  try {
    const supabase = await createClient()

    // Get all products from this vendor
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, brand, price")
      .eq("brand", params.vendorName)

    if (productsError) throw productsError

    // Calculate rebate data
    const rebateCalculation = {
      vendorName: params.vendorName,
      period: params.period,
      rebateRate: params.rebateRate,
      totalProducts: products?.length || 0,
      estimatedRebateAmount: 0,
      productBreakdown:
        products?.map((product) => ({
          productId: product.id,
          productName: product.name,
          price: product.price,
          rebateAmount: product.price * (params.rebateRate / 100),
        })) || [],
      createdAt: new Date().toISOString(),
    }

    // Calculate total estimated rebate
    rebateCalculation.estimatedRebateAmount = rebateCalculation.productBreakdown.reduce(
      (sum, item) => sum + item.rebateAmount,
      0,
    )

    // Optionally save to vendor_rebates table
    await supabase.from("vendor_rebates").insert([
      {
        vendor_name: params.vendorName,
        period: params.period,
        rebate_rate: params.rebateRate,
        total_amount: rebateCalculation.estimatedRebateAmount,
        status: "active",
      },
    ])

    return rebateCalculation
  } catch (error) {
    logError("Error calculating rebate data", error)
    throw error
  }
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
  async getCustomers(page = 1, limit = 20) {
    const supabase = await createClient()
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from("customers")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch customers: ${error.message}`)
    }

    return {
      data: data || [],
      total: count || 0,
    }
  },

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

  async getCustomerById(customerId: string): Promise<Customer | null> {
    return this.getCustomer(customerId)
  },

  async createCustomer(customerData: CreateCustomerData) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("customers")
      .insert([{ ...customerData, status: customerData.status || "active" }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create customer: ${error.message}`)
    }

    return data
  },

  async updateCustomer(id: string, customerData: Partial<CreateCustomerData>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("customers")
      .update({ ...customerData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update customer: ${error.message}`)
    }

    return data
  },

  async deleteCustomer(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete customer: ${error.message}`)
    }

    return { success: true }
  },

  // Customer Discount methods
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

  async getCustomerDiscount(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("customer_discounts").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch customer discount: ${error.message}`)
    }

    return data
  },

  async createCustomerDiscount(discountData: CreateCustomerDiscountData) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("customer_discounts")
      .insert([{ ...discountData, status: discountData.status || "active" }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create customer discount: ${error.message}`)
    }

    return data
  },

  async updateCustomerDiscount(id: string, discountData: Partial<CreateCustomerDiscountData>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("customer_discounts")
      .update({ ...discountData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update customer discount: ${error.message}`)
    }

    return data
  },

  async deleteCustomerDiscount(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("customer_discounts").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete customer discount: ${error.message}`)
    }

    return { success: true }
  },

  // Inventory Discount methods
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

  async getInventoryDiscount(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("inventory_discounts").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch inventory discount: ${error.message}`)
    }

    return data
  },

  async createInventoryDiscount(discountData: CreateInventoryDiscountData) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("inventory_discounts")
      .insert([{ ...discountData, status: discountData.status || "active" }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create inventory discount: ${error.message}`)
    }

    return data
  },

  async updateInventoryDiscount(id: string, discountData: Partial<CreateInventoryDiscountData>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("inventory_discounts")
      .update({ ...discountData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update inventory discount: ${error.message}`)
    }

    return data
  },

  async deleteInventoryDiscount(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("inventory_discounts").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete inventory discount: ${error.message}`)
    }

    return { success: true }
  },

  // BOGO Promotion methods
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

  async getBogoPromotion(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("bogo_promotions").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch BOGO promotion: ${error.message}`)
    }

    return data
  },

  async createBogoPromotion(promotionData: CreateBogoPromotionData) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bogo_promotions")
      .insert([{ ...promotionData, status: promotionData.status || "active" }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create BOGO promotion: ${error.message}`)
    }

    return data
  },

  async updateBogoPromotion(id: string, promotionData: Partial<CreateBogoPromotionData>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bogo_promotions")
      .update({ ...promotionData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update BOGO promotion: ${error.message}`)
    }

    return data
  },

  async deleteBogoPromotion(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("bogo_promotions").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete BOGO promotion: ${error.message}`)
    }

    return { success: true }
  },

  // Bundle Deal methods
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

  async getBundleDeal(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("bundle_deals").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch bundle deal: ${error.message}`)
    }

    return data
  },

  async createBundleDeal(bundleData: CreateBundleDealData) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bundle_deals")
      .insert([{ ...bundleData, status: bundleData.status || "active" }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create bundle deal: ${error.message}`)
    }

    return data
  },

  async updateBundleDeal(id: string, bundleData: Partial<CreateBundleDealData>) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bundle_deals")
      .update({ ...bundleData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update bundle deal: ${error.message}`)
    }

    return data
  },

  async deleteBundleDeal(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("bundle_deals").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete bundle deal: ${error.message}`)
    }

    return { success: true }
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

  // Promotion history functions
  async getPromotionHistory(filters?: {
    type?: string
    startDate?: Date
    endDate?: Date
  }): Promise<PromotionHistory[]> {
    try {
      const supabase = await createClient()
      let query = supabase.from("promotion_tracking").select("*").order("date_tracked", { ascending: false })

      if (filters?.type) {
        query = query.eq("promotion_type", filters.type)
      }

      if (filters?.startDate) {
        query = query.gte("date_tracked", filters.startDate.toISOString())
      }

      if (filters?.endDate) {
        query = query.lte("date_tracked", filters.endDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []) as PromotionHistory[]
    } catch (error) {
      logError("Error fetching promotion history", error)
      throw error
    }
  },

  async getPromotionHistoryStats(filters?: {
    type?: string
    startDate?: Date
    endDate?: Date
  }): Promise<PromotionHistoryStats> {
    try {
      const history = await this.getPromotionHistory(filters)

      const totalPromotions = new Set(history.map((h) => h.promotion_id)).size
      const totalUsage = history.reduce((sum, h) => sum + h.usage_count, 0)
      const totalRevenue = history.reduce((sum, h) => sum + h.revenue_impact, 0)
      const totalCost = history.reduce((sum, h) => sum + h.cost_impact, 0)

      return {
        totalPromotions,
        totalUsage,
        totalRevenue,
        totalCost,
        avgRevenuePerPromotion: totalPromotions > 0 ? totalRevenue / totalPromotions : 0,
        avgUsagePerPromotion: totalPromotions > 0 ? totalUsage / totalPromotions : 0,
      }
    } catch (error) {
      logError("Error calculating promotion history stats", error)
      throw error
    }
  },

  async getPromotionPerformance(promotionId: string) {
    const history = await this.getPromotionHistory()
    const promotionHistory = history.filter((h) => h.promotion_id === promotionId)

    const totalUsage = promotionHistory.reduce((sum, h) => sum + h.usage_count, 0)
    const totalRevenue = promotionHistory.reduce((sum, h) => sum + h.revenue_impact, 0)
    const totalCost = promotionHistory.reduce((sum, h) => sum + h.cost_impact, 0)
    const netImpact = totalRevenue - totalCost

    return {
      promotionId,
      totalUsage,
      totalRevenue,
      totalCost,
      netImpact,
      roi: totalCost > 0 ? (netImpact / totalCost) * 100 : 0,
      history: promotionHistory,
    }
  },

  // Discount rules methods for tier management
  async getDiscountRules(filters?: {
    status?: string
    rule_type?: string
    level?: string
  }): Promise<DiscountRule[]> {
    try {
      const supabase = await createClient()
      let query = supabase.from("discount_rules").select("*").order("created_at", { ascending: false })

      if (filters?.status) {
        query = query.eq("status", filters.status)
      }
      if (filters?.rule_type) {
        query = query.eq("rule_type", filters.rule_type)
      }
      if (filters?.level) {
        query = query.eq("level", filters.level)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching discount rules", error)
      throw error
    }
  },

  async getDiscountRule(id: string): Promise<DiscountRule | null> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.from("discount_rules").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") return null
        throw error
      }

      return data
    } catch (error) {
      logError("Error fetching discount rule", error)
      throw error
    }
  },

  async createDiscountRule(ruleData: CreateDiscountRuleData): Promise<DiscountRule> {
    try {
      const supabase = await createClient()

      // Create the rule
      const { data: rule, error: ruleError } = await supabase
        .from("discount_rules")
        .insert([
          {
            name: ruleData.name,
            description: ruleData.description,
            rule_type: ruleData.rule_type,
            level: ruleData.level,
            target_id: ruleData.target_id,
            target_name: ruleData.target_name,
            start_date: ruleData.start_date,
            end_date: ruleData.end_date,
            status: ruleData.status || "active",
            created_by: ruleData.created_by,
          },
        ])
        .select()
        .single()

      if (ruleError) throw ruleError

      // Create the tiers
      if (ruleData.tiers && ruleData.tiers.length > 0) {
        const tiersToInsert = ruleData.tiers.map((tier) => ({
          rule_id: rule.id,
          tier: tier.tier,
          discount_type: tier.discount_type,
          discount_value: tier.discount_value,
          min_quantity: tier.min_quantity,
          max_quantity: tier.max_quantity,
        }))

        const { error: tiersError } = await supabase.from("discount_rule_tiers").insert(tiersToInsert)

        if (tiersError) throw tiersError
      }

      return rule
    } catch (error) {
      logError("Error creating discount rule", error)
      throw error
    }
  },

  async updateDiscountRule(id: string, ruleData: Partial<CreateDiscountRuleData>): Promise<DiscountRule> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("discount_rules")
        .update({
          ...ruleData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Update tiers if provided
      if (ruleData.tiers) {
        // Delete existing tiers
        await supabase.from("discount_rule_tiers").delete().eq("rule_id", id)

        // Insert new tiers
        const tiersToInsert = ruleData.tiers.map((tier) => ({
          rule_id: id,
          tier: tier.tier,
          discount_type: tier.discount_type,
          discount_value: tier.discount_value,
          min_quantity: tier.min_quantity,
          max_quantity: tier.max_quantity,
        }))

        await supabase.from("discount_rule_tiers").insert(tiersToInsert)
      }

      return data
    } catch (error) {
      logError("Error updating discount rule", error)
      throw error
    }
  },

  async deleteDiscountRule(id: string): Promise<{ success: boolean }> {
    try {
      const supabase = await createClient()

      const { error } = await supabase.from("discount_rules").delete().eq("id", id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      logError("Error deleting discount rule", error)
      throw error
    }
  },

  // Discount rule tiers methods
  async getRuleTiers(ruleId: string): Promise<DiscountRuleTier[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("discount_rule_tiers")
        .select("*")
        .eq("rule_id", ruleId)
        .order("tier", { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching rule tiers", error)
      throw error
    }
  },

  // Customer tier assignment methods
  async getCustomerTierAssignments(filters?: {
    rule_id?: string
    customer_id?: string
    tier?: string
  }): Promise<CustomerTierAssignment[]> {
    try {
      const supabase = await createClient()
      let query = supabase.from("customer_tier_assignments").select("*")

      if (filters?.rule_id) {
        query = query.eq("rule_id", filters.rule_id)
      }
      if (filters?.customer_id) {
        query = query.eq("customer_id", filters.customer_id)
      }
      if (filters?.tier) {
        query = query.eq("tier", filters.tier)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching customer tier assignments", error)
      throw error
    }
  },

  async createTierAssignment(assignmentData: CreateTierAssignmentData): Promise<CustomerTierAssignment> {
    try {
      const supabase = await createClient()

      // Check if assignment already exists
      const { data: existing } = await supabase
        .from("customer_tier_assignments")
        .select("*")
        .eq("rule_id", assignmentData.rule_id)
        .eq("customer_id", assignmentData.customer_id)
        .single()

      if (existing) {
        // Update existing assignment
        const { data, error } = await supabase
          .from("customer_tier_assignments")
          .update({
            tier: assignmentData.tier,
            assigned_by: assignmentData.assigned_by,
            notes: assignmentData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single()

        if (error) throw error

        // Create audit log
        await supabase.from("tier_assignment_audit").insert([
          {
            assignment_id: existing.id,
            rule_id: assignmentData.rule_id,
            customer_id: assignmentData.customer_id,
            action: "updated",
            old_tier: existing.tier,
            new_tier: assignmentData.tier,
            changed_by: assignmentData.assigned_by,
            reason: assignmentData.notes,
          },
        ])

        return data
      } else {
        // Create new assignment
        const { data, error } = await supabase
          .from("customer_tier_assignments")
          .insert([assignmentData])
          .select()
          .single()

        if (error) throw error

        // Create audit log
        await supabase.from("tier_assignment_audit").insert([
          {
            assignment_id: data.id,
            rule_id: assignmentData.rule_id,
            customer_id: assignmentData.customer_id,
            action: "assigned",
            new_tier: assignmentData.tier,
            changed_by: assignmentData.assigned_by,
            reason: assignmentData.notes,
          },
        ])

        return data
      }
    } catch (error) {
      logError("Error creating tier assignment", error)
      throw error
    }
  },

  async deleteTierAssignment(ruleId: string, customerId: string, deletedBy?: string): Promise<{ success: boolean }> {
    try {
      const supabase = await createClient()

      // Get existing assignment for audit
      const { data: existing } = await supabase
        .from("customer_tier_assignments")
        .select("*")
        .eq("rule_id", ruleId)
        .eq("customer_id", customerId)
        .single()

      if (existing) {
        // Create audit log before deletion
        await supabase.from("tier_assignment_audit").insert([
          {
            assignment_id: existing.id,
            rule_id: ruleId,
            customer_id: customerId,
            action: "removed",
            old_tier: existing.tier,
            changed_by: deletedBy,
            reason: "Assignment removed",
          },
        ])
      }

      // Delete the assignment
      const { error } = await supabase
        .from("customer_tier_assignments")
        .delete()
        .eq("rule_id", ruleId)
        .eq("customer_id", customerId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      logError("Error deleting tier assignment", error)
      throw error
    }
  },

  // Method to get customer's tiers across all rules
  async getCustomerTiers(customerId: string): Promise<
    Array<{
      rule: DiscountRule
      tier: "A" | "B" | "C"
      discount: DiscountRuleTier
    }>
  > {
    try {
      const supabase = await createClient()

      // Get all tier assignments for this customer
      const { data: assignments, error: assignmentsError } = await supabase
        .from("customer_tier_assignments")
        .select("*")
        .eq("customer_id", customerId)

      if (assignmentsError) throw assignmentsError

      if (!assignments || assignments.length === 0) {
        return []
      }

      // Get rule details and tier discounts
      const result = []
      for (const assignment of assignments) {
        const rule = await this.getDiscountRule(assignment.rule_id)
        if (!rule) continue

        const tiers = await this.getRuleTiers(assignment.rule_id)
        const tierDiscount = tiers.find((t) => t.tier === assignment.tier)
        if (!tierDiscount) continue

        result.push({
          rule,
          tier: assignment.tier,
          discount: tierDiscount,
        })
      }

      return result
    } catch (error) {
      logError("Error fetching customer tiers", error)
      throw error
    }
  },

  // Method to get tier assignment audit log
  async getTierAssignmentAudit(filters?: {
    rule_id?: string
    customer_id?: string
    startDate?: Date
    endDate?: Date
  }): Promise<TierAssignmentAudit[]> {
    try {
      const supabase = await createClient()
      let query = supabase.from("tier_assignment_audit").select("*").order("changed_at", { ascending: false })

      if (filters?.rule_id) {
        query = query.eq("rule_id", filters.rule_id)
      }
      if (filters?.customer_id) {
        query = query.eq("customer_id", filters.customer_id)
      }
      if (filters?.startDate) {
        query = query.gte("changed_at", filters.startDate.toISOString())
      }
      if (filters?.endDate) {
        query = query.lte("changed_at", filters.endDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error fetching tier assignment audit", error)
      throw error
    }
  },

  // Search methods for products and customers
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,sku.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(20)

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error searching products", error)
      throw error
    }
  },

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .ilike("business_legal_name", `%${query}%`)
        .limit(20)

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Error searching customers", error)
      throw error
    }
  },
}

export async function getInventoryDiscounts() {
  return db.getInventoryDiscounts()
}

export async function createInventoryDiscount(discountData: CreateInventoryDiscountData) {
  return db.createInventoryDiscount(discountData)
}

export async function getBogoPromotions() {
  return db.getBogoPromotions()
}

export async function createBogoPromotion(promotionData: CreateBogoPromotionData) {
  return db.createBogoPromotion(promotionData)
}

export async function getBundleDeals() {
  return db.getBundleDeals()
}

export async function createBundleDeal(bundleData: CreateBundleDealData) {
  return db.createBundleDeal(bundleData)
}

export async function getPromotionHistory(filters?: {
  type?: string
  startDate?: Date
  endDate?: Date
}) {
  return db.getPromotionHistory(filters)
}

export async function getPromotionHistoryStats(filters?: {
  type?: string
  startDate?: Date
  endDate?: Date
}) {
  return db.getPromotionHistoryStats(filters)
}

export async function getPromotionPerformance(promotionId: string) {
  return db.getPromotionPerformance(promotionId)
}
