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

export class PromotionsClientService {
  private static instance: PromotionsClientService

  public static getInstance(): PromotionsClientService {
    if (!PromotionsClientService.instance) {
      PromotionsClientService.instance = new PromotionsClientService()
    }
    return PromotionsClientService.instance
  }

  // Client-safe version of BOGO Promotions
  async getBogoPromotions(): Promise<BogoPromotion[]> {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.from("bogo_promotions").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Client-safe version of Deal Notifications
  async getActiveDealNotifications(): Promise<DealNotification[]> {
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

  async getPromotionStats(): Promise<{
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
}

export const promotionsClientService = PromotionsClientService.getInstance()
