import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const eventType = searchParams.get("type")

    // Get recent events from various tables
    const events: Array<{
      id: string
      type: string
      title: string
      description: string
      timestamp: number
      value?: number
      metadata?: Record<string, any>
    }> = []

    // Get recent sales/orders
    const { data: recentSales } = await supabase
      .from("promotion_tracking")
      .select(`
        *,
        products (name, category)
      `)
      .order("date_tracked", { ascending: false })
      .limit(10)

    if (recentSales) {
      recentSales.forEach((sale) => {
        events.push({
          id: `sale_${sale.id}`,
          type: "sale",
          title: "Product Sale",
          description: `${sale.products?.name || "Product"} sold - Revenue: $${sale.revenue_impact}`,
          value: sale.revenue_impact,
          timestamp: new Date(sale.date_tracked).getTime(),
          metadata: {
            productId: sale.product_id,
            promotionId: sale.promotion_id,
            category: sale.products?.category,
          },
        })
      })
    }

    // Get recent promotion usage
    const { data: promotionUsage } = await supabase
      .from("bogo_promotions")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5)

    if (promotionUsage) {
      promotionUsage.forEach((promo) => {
        events.push({
          id: `promo_${promo.id}`,
          type: "promotion_used",
          title: "Promotion Activated",
          description: `${promo.name} - ${promo.type} promotion is now active`,
          timestamp: new Date(promo.created_at).getTime(),
          metadata: {
            promotionId: promo.id,
            promotionType: promo.type,
            value: promo.reward_value,
          },
        })
      })
    }

    // Get recent price changes (simulated)
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(5)

    if (products) {
      products.forEach((product) => {
        events.push({
          id: `price_${product.id}`,
          type: "price_change",
          title: "Price Update",
          description: `${product.name} price updated to $${product.price}`,
          value: product.price,
          timestamp: new Date(product.updated_at).getTime(),
          metadata: {
            productId: product.id,
            category: product.category,
            newPrice: product.price,
          },
        })
      })
    }

    // Get recent alerts
    const { data: alerts } = await supabase
      .from("performance_alerts")
      .select("*")
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(5)

    if (alerts) {
      alerts.forEach((alert) => {
        events.push({
          id: `alert_${alert.id}`,
          type: "alert",
          title: "System Alert",
          description: `${alert.metric} alert - Value: ${alert.value}`,
          timestamp: new Date(alert.created_at).getTime(),
          severity: alert.severity,
          metadata: {
            alertId: alert.id,
            metric: alert.metric,
            value: alert.value,
            threshold: alert.threshold,
          },
        })
      })
    }

    // Sort events by timestamp (most recent first)
    events.sort((a, b) => b.timestamp - a.timestamp)

    // Filter by event type if specified
    const filteredEvents = eventType ? events.filter((e) => e.type === eventType) : events

    // Limit results
    const limitedEvents = filteredEvents.slice(0, limit)

    return NextResponse.json({
      success: true,
      events: limitedEvents,
      total: filteredEvents.length,
    })
  } catch (error) {
    console.error("Realtime events error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { type, title, description, value, metadata } = body

    // Store custom event (you might want to create a dedicated events table)
    const eventData = {
      event_type: type,
      title,
      description,
      value: value || null,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    }

    // For now, we'll simulate storing the event
    // In a real implementation, you'd store this in a dedicated events table

    return NextResponse.json({
      success: true,
      event: {
        id: `custom_${Date.now()}`,
        type,
        title,
        description,
        value,
        timestamp: Date.now(),
        metadata,
      },
    })
  } catch (error) {
    console.error("Create realtime event error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
