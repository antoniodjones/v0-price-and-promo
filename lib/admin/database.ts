import { createClient } from "@/lib/supabase/client"

export interface PriceSource {
  id: string
  name: string
  url: string
  api_endpoint?: string
  last_sync: string
  status: "active" | "inactive" | "error"
  products_count: number
  sync_frequency: string
  created_at: string
  updated_at: string
}

export interface AdminStats {
  total_products: number
  active_sources: number
  price_updates_today: number
  alerts_triggered: number
  system_health: "healthy" | "warning" | "error"
}

export interface CreateSourceData {
  name: string
  url: string
  api_endpoint?: string
  sync_frequency: string
}

export class AdminDatabase {
  private supabase = createClient()

  async getAdminStats(): Promise<AdminStats> {
    try {
      // Get total products count
      const { count: totalProducts } = await this.supabase.from("products").select("*", { count: "exact", head: true })

      // Get active sources count
      const { count: activeSources } = await this.supabase
        .from("price_sources")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      // Get price updates today (mock for now - would need price_history table)
      const priceUpdatesToday = Math.floor(Math.random() * 1000) + 500

      // Get alerts triggered (mock for now - would need alerts table)
      const alertsTriggered = Math.floor(Math.random() * 20)

      // Determine system health based on active sources
      let systemHealth: "healthy" | "warning" | "error" = "healthy"
      if (!activeSources || activeSources === 0) {
        systemHealth = "error"
      } else if (activeSources < 2) {
        systemHealth = "warning"
      }

      return {
        total_products: totalProducts || 0,
        active_sources: activeSources || 0,
        price_updates_today: priceUpdatesToday,
        alerts_triggered: alertsTriggered,
        system_health: systemHealth,
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error)
      return {
        total_products: 0,
        active_sources: 0,
        price_updates_today: 0,
        alerts_triggered: 0,
        system_health: "error",
      }
    }
  }

  async getPriceSources(): Promise<PriceSource[]> {
    try {
      const { data, error } = await this.supabase
        .from("price_sources")
        .select(`
          *,
          price_history(product_id)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (
        data?.map((source) => {
          // Count unique products from price_history
          const uniqueProducts = new Set(source.price_history?.map((ph: any) => ph.product_id) || [])

          return {
            id: source.id,
            name: source.name,
            url: source.website_url || source.url || "",
            api_endpoint: source.api_endpoint,
            last_sync: this.formatLastSync(source.updated_at),
            status: source.is_active ? "active" : "inactive",
            products_count: uniqueProducts.size,
            sync_frequency: "Daily", // Default since not in schema
            created_at: source.created_at,
            updated_at: source.updated_at,
          }
        }) || []
      )
    } catch (error) {
      console.error("Error fetching price sources:", error)
      return []
    }
  }

  async createPriceSource(data: CreateSourceData): Promise<PriceSource | null> {
    try {
      const { data: newSource, error } = await this.supabase
        .from("price_sources")
        .insert({
          name: data.name,
          url: data.url,
          api_endpoint: data.api_endpoint || null,
          sync_frequency: data.sync_frequency,
          status: "inactive",
          last_sync: null,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: newSource.id,
        name: newSource.name,
        url: newSource.url,
        api_endpoint: newSource.api_endpoint,
        last_sync: "Never",
        status: newSource.status,
        products_count: 0,
        sync_frequency: newSource.sync_frequency,
        created_at: newSource.created_at,
        updated_at: newSource.updated_at,
      }
    } catch (error) {
      console.error("Error creating price source:", error)
      return null
    }
  }

  async updatePriceSource(id: string, updates: Partial<CreateSourceData>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("price_sources")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating price source:", error)
      return false
    }
  }

  async deletePriceSource(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("price_sources").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting price source:", error)
      return false
    }
  }

  async syncPriceSource(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("price_sources")
        .update({
          last_sync: new Date().toISOString(),
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error syncing price source:", error)
      return false
    }
  }

  private formatLastSync(lastSync: string | null): string {
    if (!lastSync) return "Never"

    const syncDate = new Date(lastSync)
    const now = new Date()
    const diffMs = now.getTime() - syncDate.getTime()
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

export const adminDb = new AdminDatabase()
