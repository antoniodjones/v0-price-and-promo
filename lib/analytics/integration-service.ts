// Advanced analytics integration service for Phase 5 completion
// Connects discount and promotion systems with real-time analytics

import { createClient } from "@/lib/supabase/client"

export interface AnalyticsEvent {
  type: "discount_applied" | "promotion_triggered" | "bundle_created" | "price_calculated"
  entityId: string
  entityType: "customer_discount" | "inventory_discount" | "bogo_promotion" | "bundle_deal"
  customerId?: string
  productId?: string
  market: string
  value: number
  metadata: Record<string, any>
  timestamp: string
}

export interface PerformanceMetrics {
  discountId: string
  totalUsage: number
  totalSavings: number
  averageOrderValue: number
  conversionRate: number
  customerCount: number
  roi: number
  lastUpdated: string
}

export interface RealtimeAnalytics {
  activeDiscounts: number
  totalSavingsToday: number
  averageDiscountRate: number
  topPerformingDiscount: string
  recentActivity: AnalyticsEvent[]
}

class AnalyticsIntegrationService {
  private supabase = createClient()

  async trackDiscountEvent(event: Omit<AnalyticsEvent, "timestamp">): Promise<void> {
    try {
      const analyticsEvent: AnalyticsEvent = {
        ...event,
        timestamp: new Date().toISOString(),
      }

      // Store event in analytics_events table
      const { error } = await this.supabase.from("analytics_events").insert([analyticsEvent])

      if (error) {
        console.error("Failed to track analytics event:", error)
        return
      }

      // Update real-time metrics
      await this.updateRealtimeMetrics(analyticsEvent)

      // Trigger performance recalculation if needed
      if (event.type === "discount_applied") {
        await this.updateDiscountPerformance(event.entityId)
      }
    } catch (error) {
      console.error("Analytics tracking error:", error)
    }
  }

  async updateDiscountPerformance(discountId: string): Promise<void> {
    try {
      // Get all events for this discount in the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: events, error } = await this.supabase
        .from("analytics_events")
        .select("*")
        .eq("entityId", discountId)
        .gte("timestamp", thirtyDaysAgo.toISOString())

      if (error || !events) {
        console.error("Failed to fetch discount events:", error)
        return
      }

      // Calculate performance metrics
      const totalUsage = events.length
      const totalSavings = events.reduce((sum, event) => sum + event.value, 0)
      const uniqueCustomers = new Set(events.map((e) => e.customerId).filter(Boolean)).size

      // Get order data to calculate AOV and conversion rate
      const customerIds = [...new Set(events.map((e) => e.customerId).filter(Boolean))]
      const { data: orders } = await this.supabase
        .from("orders")
        .select("total, customerId")
        .in("customerId", customerIds)
        .gte("createdAt", thirtyDaysAgo.toISOString())

      const averageOrderValue =
        orders && orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0

      const conversionRate = customerIds.length > 0 ? (totalUsage / customerIds.length) * 100 : 0

      // Calculate ROI (simplified - revenue increase vs discount cost)
      const roi = totalSavings > 0 ? (averageOrderValue * totalUsage - totalSavings) / totalSavings : 0

      const metrics: PerformanceMetrics = {
        discountId,
        totalUsage,
        totalSavings,
        averageOrderValue,
        conversionRate,
        customerCount: uniqueCustomers,
        roi,
        lastUpdated: new Date().toISOString(),
      }

      // Update or insert performance metrics
      const { error: metricsError } = await this.supabase
        .from("discount_performance_metrics")
        .upsert([metrics], { onConflict: "discountId" })

      if (metricsError) {
        console.error("Failed to update performance metrics:", metricsError)
      }
    } catch (error) {
      console.error("Performance calculation error:", error)
    }
  }

  async getRealtimeAnalytics(): Promise<RealtimeAnalytics> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Get today's events
      const { data: todayEvents, error: eventsError } = await this.supabase
        .from("analytics_events")
        .select("*")
        .gte("timestamp", today.toISOString())
        .order("timestamp", { ascending: false })
        .limit(10)

      if (eventsError) {
        console.error("Failed to fetch today events:", eventsError)
      }

      // Get active discounts count
      const { count: activeDiscounts } = await this.supabase
        .from("customer_discounts")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      // Calculate today's total savings
      const totalSavingsToday = todayEvents?.reduce((sum, event) => sum + event.value, 0) || 0

      // Get top performing discount
      const { data: topDiscount } = await this.supabase
        .from("discount_performance_metrics")
        .select("discountId, totalSavings")
        .order("totalSavings", { ascending: false })
        .limit(1)
        .single()

      // Calculate average discount rate from recent events
      const recentDiscountEvents = todayEvents?.filter((e) => e.type === "discount_applied") || []
      const averageDiscountRate =
        recentDiscountEvents.length > 0
          ? recentDiscountEvents.reduce((sum, event) => sum + (event.metadata?.discountRate || 0), 0) /
            recentDiscountEvents.length
          : 0

      return {
        activeDiscounts: activeDiscounts || 0,
        totalSavingsToday,
        averageDiscountRate,
        topPerformingDiscount: topDiscount?.discountId || "N/A",
        recentActivity: todayEvents || [],
      }
    } catch (error) {
      console.error("Failed to get realtime analytics:", error)
      return {
        activeDiscounts: 0,
        totalSavingsToday: 0,
        averageDiscountRate: 0,
        topPerformingDiscount: "N/A",
        recentActivity: [],
      }
    }
  }

  private async updateRealtimeMetrics(event: AnalyticsEvent): Promise<void> {
    try {
      // Update Redis cache for real-time dashboard
      const cacheKey = `analytics:realtime:${event.market}`

      // This would integrate with Redis/KV store for real-time updates
      // For now, we'll update the database directly
      const { error } = await this.supabase.from("realtime_analytics_cache").upsert(
        [
          {
            market: event.market,
            lastEventType: event.type,
            lastEventValue: event.value,
            lastUpdated: event.timestamp,
          },
        ],
        { onConflict: "market" },
      )

      if (error) {
        console.error("Failed to update realtime cache:", error)
      }
    } catch (error) {
      console.error("Realtime metrics update error:", error)
    }
  }

  async generateInsights(timeframe: "7d" | "30d" | "90d" = "30d"): Promise<any> {
    try {
      const daysBack = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      // Get performance trends
      const { data: events } = await this.supabase
        .from("analytics_events")
        .select("*")
        .gte("timestamp", startDate.toISOString())

      if (!events) return null

      // Group by day for trend analysis
      const dailyMetrics = events.reduce(
        (acc, event) => {
          const day = event.timestamp.split("T")[0]
          if (!acc[day]) {
            acc[day] = { usage: 0, savings: 0, events: 0 }
          }
          acc[day].usage += 1
          acc[day].savings += event.value
          acc[day].events += 1
          return acc
        },
        {} as Record<string, any>,
      )

      // Calculate insights
      const totalEvents = events.length
      const totalSavings = events.reduce((sum, e) => sum + e.value, 0)
      const averageDailySavings = totalSavings / daysBack

      // Identify trends
      const dailyValues = Object.values(dailyMetrics).map((d: any) => d.savings)
      const trend =
        dailyValues.length > 1
          ? dailyValues[dailyValues.length - 1] > dailyValues[0]
            ? "increasing"
            : "decreasing"
          : "stable"

      return {
        summary: {
          totalEvents,
          totalSavings,
          averageDailySavings,
          trend,
        },
        dailyMetrics,
        insights: [
          `Total of ${totalEvents} discount events in the last ${daysBack} days`,
          `Average daily savings: $${averageDailySavings.toFixed(2)}`,
          `Trend: ${trend} discount usage`,
        ],
      }
    } catch (error) {
      console.error("Failed to generate insights:", error)
      return null
    }
  }
}

export const analyticsIntegration = new AnalyticsIntegrationService()
