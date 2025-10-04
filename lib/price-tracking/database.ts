import { createClient } from "@/lib/supabase/client"

export interface PriceAlert {
  id: string
  product_id: string
  source_id: string
  alert_type: "price_increase" | "price_decrease" | "threshold" | "competitor"
  threshold_value?: number
  threshold_type?: "percentage" | "amount"
  current_price: number
  previous_price: number
  change_amount: number
  change_percentage: number
  status: "active" | "acknowledged" | "resolved"
  triggered_at: string
  acknowledged_at?: string
  resolved_at?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Joined data
  products?: {
    name: string
    sku: string
    category: string
  }
  price_sources?: {
    name: string
  }
}

export interface PriceHistory {
  id: string
  product_id: string
  source_id: string
  price: number
  change_from_previous?: number
  change_percentage?: number
  recorded_at: string
  created_at: string
  // Joined data
  products?: {
    name: string
    sku: string
    category: string
  }
  price_sources?: {
    name: string
  }
}

export interface TrackedProduct {
  id: string
  name: string
  sku: string
  category: string
  current_price: number
  lowest_price: number
  highest_price: number
  price_change_24h: number
  price_change_percentage: number
  alert_enabled: boolean
  alert_threshold: number
  alert_type: "percentage" | "amount"
  sources_count: number
  last_updated: string
  // Tracking settings
  product_tracking_settings?: {
    alert_enabled: boolean
    alert_threshold: number
    alert_type: "percentage" | "amount"
    email_notifications: boolean
  }
}

export interface PriceTrackingStats {
  active_alerts: number
  tracked_products: number
  price_updates_today: number
  avg_price_change: number
}

export interface TrackingSettings {
  product_id: string
  alert_enabled: boolean
  alert_threshold: number
  alert_type: "percentage" | "amount"
  email_notifications: boolean
}

export class PriceTrackingDatabase {
  private supabase = createClient()

  async getTrackingStats(): Promise<PriceTrackingStats> {
    try {
      console.log("[v0] Fetching tracking stats...")
      // Get active alerts count
      const { count: activeAlerts } = await this.supabase
        .from("price_alerts")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)

      console.log("[v0] Active alerts:", activeAlerts)

      // Get tracked products count
      const { count: trackedProducts, error: trackedError } = await this.supabase
        .from("product_tracking_settings")
        .select("*", { count: "exact", head: true })
        .eq("alert_enabled", true)

      if (trackedError) {
        console.error("[v0] Error fetching tracked products:", trackedError)
      }
      console.log("[v0] Tracked products:", trackedProducts)

      // Get price updates today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: priceUpdatesToday } = await this.supabase
        .from("price_history")
        .select("*", { count: "exact", head: true })
        .gte("scraped_at", today.toISOString())

      console.log("[v0] Price updates today:", priceUpdatesToday)

      // Calculate average price change (simplified - would need more complex query in production)
      const avgPriceChange = -3.2 // Mock value for now

      return {
        active_alerts: activeAlerts || 0,
        tracked_products: trackedProducts || 0,
        price_updates_today: priceUpdatesToday || 0,
        avg_price_change: avgPriceChange,
      }
    } catch (error) {
      console.error("[v0] Error fetching tracking stats:", error)
      return {
        active_alerts: 0,
        tracked_products: 0,
        price_updates_today: 0,
        avg_price_change: 0,
      }
    }
  }

  async getPriceAlerts(status?: string, limit = 50): Promise<PriceAlert[]> {
    try {
      let query = this.supabase
        .from("price_alerts")
        .select(`
          *,
          products (
            name,
            sku,
            category
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (status && status !== "all") {
        if (status === "active") {
          query = query.eq("is_active", true)
        }
      }

      const { data, error } = await query

      if (error) {
        console.error("[v0] Error fetching price alerts:", error)
        throw error
      }

      return (data || []).map((alert) => ({
        ...alert,
        source_id: "", // Not available in current schema
        alert_type: alert.alert_type || "threshold",
        threshold_value: alert.target_price,
        threshold_type: "amount" as const,
        current_price: 0, // Would need to fetch from price_history
        previous_price: 0,
        change_amount: 0,
        change_percentage: 0,
        status: alert.is_active ? "active" : "resolved",
        triggered_at: alert.triggered_at || alert.created_at,
      })) as PriceAlert[]
    } catch (error) {
      console.error("[v0] Error fetching price alerts:", error)
      return []
    }
  }

  async updateAlertStatus(alertId: string, status: "acknowledged" | "resolved"): Promise<boolean> {
    try {
      const updateData: any = {
        is_active: status !== "resolved",
      }

      const { error } = await this.supabase.from("price_alerts").update(updateData).eq("id", alertId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("[v0] Error updating alert status:", error)
      return false
    }
  }

  async getTrackedProducts(): Promise<TrackedProduct[]> {
    try {
      console.log("[v0] Fetching tracked products...")
      const { data, error } = await this.supabase
        .from("products")
        .select(`
          *,
          product_tracking_settings (
            alert_enabled,
            alert_threshold,
            alert_type,
            email_notifications
          )
        `)
        .not("product_tracking_settings", "is", null)

      if (error) {
        console.error("[v0] Error fetching tracked products:", error)
        throw error
      }

      console.log("[v0] Raw tracked products data:", data?.length || 0)

      // Transform data and calculate additional fields
      const trackedProducts = await Promise.all(
        (data || []).map(async (product) => {
          // Get current price (latest price from history)
          const { data: latestPrice } = await this.supabase
            .from("price_history")
            .select("price, scraped_at")
            .eq("product_id", product.id)
            .order("scraped_at", { ascending: false })
            .limit(1)
            .single()

          // Get price range (min/max)
          const { data: priceRange } = await this.supabase
            .from("price_history")
            .select("price")
            .eq("product_id", product.id)

          // Get 24h price change
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const { data: yesterdayPrice } = await this.supabase
            .from("price_history")
            .select("price")
            .eq("product_id", product.id)
            .lte("scraped_at", yesterday.toISOString())
            .order("scraped_at", { ascending: false })
            .limit(1)
            .single()

          // Get sources count
          const { count: sourcesCount } = await this.supabase
            .from("price_history")
            .select("source_id", { count: "exact", head: true })
            .eq("product_id", product.id)

          const currentPrice = latestPrice?.price || product.price || 0
          const yesterdayPriceValue = yesterdayPrice?.price || currentPrice
          const priceChange24h = currentPrice - yesterdayPriceValue
          const priceChangePercentage = yesterdayPriceValue > 0 ? (priceChange24h / yesterdayPriceValue) * 100 : 0

          const prices = priceRange?.map((p) => p.price) || [currentPrice]
          const lowestPrice = Math.min(...prices)
          const highestPrice = Math.max(...prices)

          const settings = product.product_tracking_settings?.[0]

          return {
            id: product.id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            current_price: currentPrice,
            lowest_price: lowestPrice,
            highest_price: highestPrice,
            price_change_24h: priceChange24h,
            price_change_percentage: priceChangePercentage,
            alert_enabled: settings?.alert_enabled || false,
            alert_threshold: settings?.alert_threshold || 10,
            alert_type: settings?.alert_type || "percentage",
            sources_count: sourcesCount || 0,
            last_updated: latestPrice?.scraped_at || product.updated_at,
            product_tracking_settings: settings,
          }
        }),
      )

      console.log("[v0] Processed tracked products:", trackedProducts.length)
      return trackedProducts
    } catch (error) {
      console.error("[v0] Error fetching tracked products:", error)
      return []
    }
  }

  async getAvailableProducts(): Promise<any[]> {
    try {
      const { data: allProducts, error: productsError } = await this.supabase
        .from("products")
        .select("id, name, sku, category")
        .limit(100)

      if (productsError) throw productsError

      const { data: trackedSettings, error: settingsError } = await this.supabase
        .from("product_tracking_settings")
        .select("product_id")

      if (settingsError) {
        console.error("[v0] Error fetching tracked settings:", settingsError)
        // Return all products if we can't get tracked ones
        return allProducts || []
      }

      const trackedIds = new Set(trackedSettings?.map((s) => s.product_id) || [])

      const availableProducts = (allProducts || []).filter((product) => !trackedIds.has(product.id))

      console.log("[v0] Available products (not tracked):", availableProducts.length)
      return availableProducts
    } catch (error) {
      console.error("[v0] Error fetching available products:", error)
      return []
    }
  }

  async addProductToTracking(productId: string, threshold: number): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("product_tracking_settings").insert({
        product_id: productId,
        alert_enabled: true,
        alert_threshold: threshold,
        alert_type: "percentage",
        email_notifications: true,
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error("[v0] Error adding product to tracking:", error)
      return false
    }
  }

  async updateTrackingSettings(productId: string, settings: Partial<TrackingSettings>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("product_tracking_settings")
        .upsert({
          product_id: productId,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("product_id", productId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("[v0] Error updating tracking settings:", error)
      return false
    }
  }

  async getPriceHistory(productId?: string, limit = 100): Promise<PriceHistory[]> {
    try {
      let query = this.supabase
        .from("price_history")
        .select(`
          *,
          products (
            name,
            sku,
            category
          ),
          price_sources (
            name
          )
        `)
        .order("scraped_at", { ascending: false })
        .limit(limit)

      if (productId && productId !== "all") {
        query = query.eq("product_id", productId)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map((record) => ({
        ...record,
        recorded_at: record.scraped_at,
        change_from_previous: 0, // Would need calculation
        change_percentage: 0, // Would need calculation
      })) as PriceHistory[]
    } catch (error) {
      console.error("[v0] Error fetching price history:", error)
      return []
    }
  }

  async addPriceRecord(
    productId: string,
    sourceId: string,
    price: number,
  ): Promise<{ success: boolean; alert?: PriceAlert }> {
    try {
      const { data, error } = await this.supabase
        .from("price_history")
        .insert({
          product_id: productId,
          source_id: sourceId,
          price,
          scraped_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Check if any alerts were triggered
      const { data: newAlerts } = await this.supabase
        .from("price_alerts")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(1)

      return {
        success: true,
        alert: newAlerts?.[0]
          ? ({
              ...newAlerts[0],
              source_id: sourceId,
              alert_type: newAlerts[0].alert_type || "threshold",
              threshold_value: newAlerts[0].target_price,
              threshold_type: "amount" as const,
              current_price: price,
              previous_price: 0,
              change_amount: 0,
              change_percentage: 0,
              status: newAlerts[0].is_active ? "active" : "resolved",
              triggered_at: newAlerts[0].triggered_at || newAlerts[0].created_at,
            } as PriceAlert)
          : undefined,
      }
    } catch (error) {
      console.error("[v0] Error adding price record:", error)
      return { success: false }
    }
  }

  async createCustomAlert(
    productId: string,
    sourceId: string,
    alertType: "price_increase" | "price_decrease" | "threshold" | "competitor",
    thresholdValue?: number,
    thresholdType?: "percentage" | "amount",
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("price_alerts").insert({
        product_id: productId,
        user_id: null, // Would need actual user ID
        alert_type: alertType,
        target_price: thresholdValue || 0,
        is_active: true,
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error("[v0] Error creating custom alert:", error)
      return false
    }
  }

  formatLastUpdated(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`
    }
  }
}

export const priceTrackingDb = new PriceTrackingDatabase()
