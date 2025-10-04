import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] Dashboard API: Starting")

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ success: false, error: "Missing Supabase configuration" }, { status: 500 })
    }

    console.log("[v0] Dashboard API: Creating Supabase client")
    const supabase = await createClient()

    console.log("[v0] Dashboard API: Fetching products")
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price, cost, inventory_count, category")

    if (productsError) {
      console.error("[v0] Products query error:", productsError)
    }

    console.log("[v0] Dashboard API: Fetching promotions")
    const { data: promotions, error: promotionsError } = await supabase
      .from("bogo_promotions")
      .select("id, name, status")
      .eq("status", "active")

    if (promotionsError) {
      console.error("[v0] Promotions query error:", promotionsError)
    }

    console.log("[v0] Dashboard API: Fetching customers")
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("id, tier, total_purchases, status")

    if (customersError) {
      console.error("[v0] Customers query error:", customersError)
    }

    console.log("[v0] Dashboard API: Fetching analytics snapshot")
    const { data: snapshot, error: snapshotError } = await supabase
      .from("analytics_snapshots")
      .select("*")
      .order("snapshot_time", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (snapshotError) {
      console.error("[v0] Snapshot query error:", snapshotError)
    }

    // Process data safely
    const productsList = products || []
    const promotionsList = promotions || []
    const customersList = customers || []

    console.log("[v0] Dashboard API: Processing data")
    console.log("[v0] Products count:", productsList.length)
    console.log("[v0] Promotions count:", promotionsList.length)
    console.log("[v0] Customers count:", customersList.length)

    // Calculate metrics
    const totalProducts = productsList.length
    const lowInventory = productsList.filter((p) => (p.inventory_count || 0) < 10).length
    const totalInventoryValue = productsList.reduce((sum, p) => sum + (p.price || 0) * (p.inventory_count || 0), 0)
    const totalCostValue = productsList.reduce((sum, p) => sum + (p.cost || 0) * (p.inventory_count || 0), 0)
    const avgMargin = totalInventoryValue > 0 ? ((totalInventoryValue - totalCostValue) / totalInventoryValue) * 100 : 0

    const activePromotions = promotionsList.length
    const totalCustomers = customersList.length
    const activeCustomers = customersList.filter((c) => c.status === "active").length

    // Category breakdown
    const categoryMap = new Map<string, { count: number; value: number }>()
    productsList.forEach((p) => {
      const cat = p.category || "Uncategorized"
      const existing = categoryMap.get(cat) || { count: 0, value: 0 }
      categoryMap.set(cat, {
        count: existing.count + 1,
        value: existing.value + (p.price || 0) * (p.inventory_count || 0),
      })
    })

    // Customer tier breakdown
    const customersByTier = customersList.reduce(
      (acc, c) => {
        const tier = c.tier || "standard"
        acc[tier] = (acc[tier] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const totalCustomerValue = customersList.reduce((sum, c) => sum + (c.total_purchases || 0), 0)

    // Revenue metrics from snapshot
    const revenueMetrics = snapshot
      ? {
          totalRevenue: snapshot.total_revenue || 0,
          revenueChange: snapshot.revenue_change || 0,
          revenueChangePercent: snapshot.revenue_change_percent || 0,
          ordersCount: snapshot.orders_count || 0,
          avgOrderValue: snapshot.avg_order_value || 0,
          conversionRate: snapshot.conversion_rate || 0,
        }
      : {
          totalRevenue: 0,
          revenueChange: 0,
          revenueChangePercent: 0,
          ordersCount: 0,
          avgOrderValue: 0,
          conversionRate: 0,
        }

    const dashboardData = {
      success: true,
      data: {
        overview: {
          totalProducts,
          lowInventory,
          totalInventoryValue,
          avgMargin,
          activePromotions,
          totalCustomers,
          activeCustomers,
        },
        revenue: revenueMetrics,
        products: {
          total: totalProducts,
          lowInventory,
          categories: Array.from(categoryMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            value: data.value,
            percentage: totalProducts > 0 ? (data.count / totalProducts) * 100 : 0,
          })),
        },
        promotions: {
          active: activePromotions,
        },
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          totalValue: totalCustomerValue,
          avgValue: totalCustomers > 0 ? totalCustomerValue / totalCustomers : 0,
          byTier: Object.entries(customersByTier).map(([tier, count]) => ({
            tier,
            count,
            percentage: totalCustomers > 0 ? (count / totalCustomers) * 100 : 0,
          })),
        },
        performance: {
          avgResponseTime: 0,
          avgErrorRate: 0,
          avgCpuUsage: 0,
          avgMemoryUsage: 0,
          metrics: [],
        },
        events: {
          total: 0,
          byType: [],
          recent: [],
        },
        alerts: {
          total: 0,
          items: [],
        },
        generatedAt: new Date().toISOString(),
      },
      message: "Dashboard data retrieved successfully",
    }

    console.log("[v0] Dashboard API: Returning response")
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("[v0] Dashboard API fatal error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard data",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
