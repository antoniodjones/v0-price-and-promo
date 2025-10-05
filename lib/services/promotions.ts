import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export interface BogoPromotion {
  id: string
  name: string
  type: string
  trigger_level: string
  trigger_value: number
  reward_type: string
  reward_value: number
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
}

export interface DealNotification {
  id: string
  product_id: string
  title: string
  description: string
  original_price: number
  sale_price: number
  discount_percentage: number
  valid_from: string
  valid_until: string
  source_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PromotionTracking {
  id: string
  promotion_id: string
  promotion_type: string
  product_id: string
  usage_count: number
  revenue_impact: number
  cost_impact: number
  date_tracked: string
  metadata: any
}

export interface CustomerDiscount {
  id: string
  name: string
  type: string
  level: string
  target: string
  value: number
  customer_tiers: string[]
  markets: string[]
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
}

export interface InventoryDiscount {
  id: string
  name: string
  type: string
  trigger_value: number
  discount_type: string
  discount_value: number
  scope: string
  scope_value: string
  status: string
  created_at: string
  updated_at: string
}

export interface BundleDeal {
  id: string
  name: string
  type: string
  discount_type: string
  discount_value: number
  min_quantity: number
  start_date: string
  end_date: string
  status: string
  created_at: string
  updated_at: string
}

export class PromotionsService {
  private static instance: PromotionsService

  public static getInstance(): PromotionsService {
    if (!PromotionsService.instance) {
      PromotionsService.instance = new PromotionsService()
    }
    return PromotionsService.instance
  }

  // BOGO Promotions
  async getBogoPromotions(): Promise<BogoPromotion[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("bogo_promotions").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createBogoPromotion(
    promotion: Omit<BogoPromotion, "id" | "created_at" | "updated_at">,
  ): Promise<BogoPromotion> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("bogo_promotions").insert(promotion).select().single()

    if (error) throw error
    return data
  }

  // Client-safe version of BOGO Promotions
  async getBogoPromotionsClient(): Promise<BogoPromotion[]> {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.from("bogo_promotions").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Deal Notifications
  async getDealNotifications(): Promise<DealNotification[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("deal_notifications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getActiveDealNotifications(): Promise<DealNotification[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("deal_notifications")
      .select("*")
      .eq("is_active", true)
      .gte("valid_until", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createDealNotification(
    deal: Omit<DealNotification, "id" | "created_at" | "updated_at">,
  ): Promise<DealNotification> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("deal_notifications").insert(deal).select().single()

    if (error) throw error
    return data
  }

  // Client-safe version of Deal Notifications
  async getActiveDealNotificationsClient(): Promise<DealNotification[]> {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from("deal_notifications")
      .select("*")
      .eq("is_active", true)
      .gte("valid_until", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Promotion Tracking
  async getPromotionTracking(filters?: {
    promotion_type?: string
    date_from?: string
    date_to?: string
  }): Promise<PromotionTracking[]> {
    const supabase = await createClient()
    let query = supabase.from("promotion_tracking").select("*")

    if (filters?.promotion_type) {
      query = query.eq("promotion_type", filters.promotion_type)
    }

    if (filters?.date_from) {
      query = query.gte("date_tracked", filters.date_from)
    }

    if (filters?.date_to) {
      query = query.lte("date_tracked", filters.date_to)
    }

    query = query.order("date_tracked", { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Customer Discounts
  async getCustomerDiscounts(): Promise<CustomerDiscount[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("customer_discounts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Inventory Discounts
  async getInventoryDiscounts(): Promise<InventoryDiscount[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("inventory_discounts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Bundle Deals
  async getBundleDeals(): Promise<BundleDeal[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("bundle_deals").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Analytics and Stats
  async getPromotionStats(): Promise<{
    totalActivePromotions: number
    totalRevenue: number
    totalSavings: number
    conversionRate: number
    topPerformingType: string
  }> {
    const supabase = await createClient()

    // Get active promotions count
    const { data: bogoData } = await supabase.from("bogo_promotions").select("id").eq("status", "active")

    const { data: dealData } = await supabase.from("deal_notifications").select("id").eq("is_active", true)

    const { data: customerDiscountData } = await supabase.from("customer_discounts").select("id").eq("status", "active")

    const { data: inventoryDiscountData } = await supabase
      .from("inventory_discounts")
      .select("id")
      .eq("status", "active")

    const { data: bundleData } = await supabase.from("bundle_deals").select("id").eq("status", "active")

    const totalActivePromotions =
      (bogoData?.length || 0) +
      (dealData?.length || 0) +
      (customerDiscountData?.length || 0) +
      (inventoryDiscountData?.length || 0) +
      (bundleData?.length || 0)

    // Get revenue and cost impact from tracking
    const { data: trackingData } = await supabase
      .from("promotion_tracking")
      .select("revenue_impact, cost_impact, promotion_type")
      .gte("date_tracked", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    const totalRevenue = trackingData?.reduce((sum, item) => sum + (item.revenue_impact || 0), 0) || 0
    const totalSavings = trackingData?.reduce((sum, item) => sum + (item.cost_impact || 0), 0) || 0

    // Calculate top performing type
    const typeStats =
      trackingData?.reduce(
        (acc, item) => {
          acc[item.promotion_type] = (acc[item.promotion_type] || 0) + (item.revenue_impact || 0)
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    const topPerformingType = Object.entries(typeStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "bogo"

    return {
      totalActivePromotions,
      totalRevenue,
      totalSavings,
      conversionRate: totalRevenue > 0 ? (totalSavings / totalRevenue) * 100 : 0,
      topPerformingType,
    }
  }

  async getPromotionStatsClient(): Promise<{
    totalActivePromotions: number
    totalRevenue: number
    totalSavings: number
    conversionRate: number
    topPerformingType: string
  }> {
    const supabase = createBrowserClient()

    // Get active promotions count
    const { data: bogoData } = await supabase.from("bogo_promotions").select("id").eq("status", "active")

    const { data: dealData } = await supabase.from("deal_notifications").select("id").eq("is_active", true)

    const { data: customerDiscountData } = await supabase.from("customer_discounts").select("id").eq("status", "active")

    const { data: inventoryDiscountData } = await supabase
      .from("inventory_discounts")
      .select("id")
      .eq("status", "active")

    const { data: bundleData } = await supabase.from("bundle_deals").select("id").eq("status", "active")

    const totalActivePromotions =
      (bogoData?.length || 0) +
      (dealData?.length || 0) +
      (customerDiscountData?.length || 0) +
      (inventoryDiscountData?.length || 0) +
      (bundleData?.length || 0)

    // Get revenue and cost impact from tracking
    const { data: trackingData } = await supabase
      .from("promotion_tracking")
      .select("revenue_impact, cost_impact, promotion_type")
      .gte("date_tracked", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    const totalRevenue = trackingData?.reduce((sum, item) => sum + (item.revenue_impact || 0), 0) || 0
    const totalSavings = trackingData?.reduce((sum, item) => sum + (item.cost_impact || 0), 0) || 0

    // Calculate top performing type
    const typeStats =
      trackingData?.reduce(
        (acc, item) => {
          acc[item.promotion_type] = (acc[item.promotion_type] || 0) + (item.revenue_impact || 0)
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    const topPerformingType = Object.entries(typeStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "bogo"

    return {
      totalActivePromotions,
      totalRevenue,
      totalSavings,
      conversionRate: totalRevenue > 0 ? (totalSavings / totalRevenue) * 100 : 0,
      topPerformingType,
    }
  }

  async getPromotionPerformanceData(): Promise<{
    weeklyData: Array<{ week: string; conversions: number; revenue: number; savings: number }>
    typeBreakdown: Array<{ type: string; count: number; revenue: number }>
  }> {
    const supabase = await createClient()

    // Get weekly performance data for the last 4 weeks
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    const { data: weeklyTracking } = await supabase
      .from("promotion_tracking")
      .select("date_tracked, revenue_impact, cost_impact, usage_count")
      .gte("date_tracked", fourWeeksAgo.toISOString().split("T")[0])

    // Group by week
    const weeklyData = []
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(fourWeeksAgo.getTime() + i * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

      const weekData =
        weeklyTracking?.filter((item) => {
          const itemDate = new Date(item.date_tracked)
          return itemDate >= weekStart && itemDate < weekEnd
        }) || []

      weeklyData.push({
        week: `Week ${i + 1}`,
        conversions: weekData.reduce((sum, item) => sum + (item.usage_count || 0), 0),
        revenue: weekData.reduce((sum, item) => sum + (item.revenue_impact || 0), 0),
        savings: weekData.reduce((sum, item) => sum + (item.cost_impact || 0), 0),
      })
    }

    // Get type breakdown
    const { data: allTracking } = await supabase
      .from("promotion_tracking")
      .select("promotion_type, revenue_impact")
      .gte("date_tracked", fourWeeksAgo.toISOString().split("T")[0])

    const typeBreakdown = Object.entries(
      allTracking?.reduce(
        (acc, item) => {
          if (!acc[item.promotion_type]) {
            acc[item.promotion_type] = { count: 0, revenue: 0 }
          }
          acc[item.promotion_type].count += 1
          acc[item.promotion_type].revenue += item.revenue_impact || 0
          return acc
        },
        {} as Record<string, { count: number; revenue: number }>,
      ) || {},
    ).map(([type, data]) => ({
      type,
      count: data.count,
      revenue: data.revenue,
    }))

    return { weeklyData, typeBreakdown }
  }
}

export const promotionsService = PromotionsService.getInstance()
