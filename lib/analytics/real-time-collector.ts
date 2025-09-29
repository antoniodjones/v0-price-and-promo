interface AnalyticsEvent {
  type: "page_view" | "purchase" | "promotion_use" | "product_view" | "cart_add" | "search"
  timestamp: number
  userId?: string
  sessionId: string
  data: Record<string, any>
  metadata?: Record<string, any>
}

interface RealtimeAnalytics {
  activeUsers: number
  pageViews: number
  conversions: number
  revenue: number
  topPages: Array<{ path: string; views: number }>
  topProducts: Array<{ id: string; name: string; views: number; purchases: number }>
  recentEvents: AnalyticsEvent[]
}

class RealTimeAnalyticsCollector {
  private events: AnalyticsEvent[] = []
  private sessions: Map<string, { userId?: string; startTime: number; lastActivity: number }> = new Map()
  private subscribers: ((analytics: RealtimeAnalytics) => void)[] = []

  trackEvent(event: Omit<AnalyticsEvent, "timestamp">): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    }

    this.events.push(fullEvent)

    // Update session info
    const session = this.sessions.get(event.sessionId) || {
      startTime: Date.now(),
      lastActivity: Date.now(),
    }
    session.lastActivity = Date.now()
    if (event.userId) {
      session.userId = event.userId
    }
    this.sessions.set(event.sessionId, session)

    // Keep only last 10000 events to prevent memory issues
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000)
    }

    // Clean old sessions (inactive for more than 30 minutes)
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < thirtyMinutesAgo) {
        this.sessions.delete(sessionId)
      }
    }

    // Notify subscribers
    this.notifySubscribers()
  }

  getRealtimeAnalytics(): RealtimeAnalytics {
    const now = Date.now()
    const lastHour = now - 60 * 60 * 1000
    const recentEvents = this.events.filter((e) => e.timestamp >= lastHour)

    // Calculate active users (sessions active in last 5 minutes)
    const fiveMinutesAgo = now - 5 * 60 * 1000
    const activeUsers = Array.from(this.sessions.values()).filter(
      (session) => session.lastActivity >= fiveMinutesAgo,
    ).length

    // Calculate page views
    const pageViews = recentEvents.filter((e) => e.type === "page_view").length

    // Calculate conversions and revenue
    const purchases = recentEvents.filter((e) => e.type === "purchase")
    const conversions = purchases.length
    const revenue = purchases.reduce((sum, event) => sum + (event.data.amount || 0), 0)

    // Top pages
    const pageViewEvents = recentEvents.filter((e) => e.type === "page_view")
    const pageViewCounts = pageViewEvents.reduce(
      (acc, event) => {
        const path = event.data.path || "/"
        acc[path] = (acc[path] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    // Top products
    const productEvents = recentEvents.filter((e) => e.type === "product_view" || e.type === "purchase")
    const productStats = productEvents.reduce(
      (acc, event) => {
        const productId = event.data.productId
        const productName = event.data.productName || `Product ${productId}`
        if (!acc[productId]) {
          acc[productId] = { id: productId, name: productName, views: 0, purchases: 0 }
        }
        if (event.type === "product_view") {
          acc[productId].views++
        } else if (event.type === "purchase") {
          acc[productId].purchases++
        }
        return acc
      },
      {} as Record<string, { id: string; name: string; views: number; purchases: number }>,
    )
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.views + b.purchases * 10 - (a.views + a.purchases * 10))
      .slice(0, 10)

    return {
      activeUsers,
      pageViews,
      conversions,
      revenue,
      topPages,
      topProducts,
      recentEvents: recentEvents.slice(-50), // Last 50 events
    }
  }

  subscribe(callback: (analytics: RealtimeAnalytics) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  private notifySubscribers(): void {
    const analytics = this.getRealtimeAnalytics()
    this.subscribers.forEach((callback) => callback(analytics))
  }

  // Simulate real-time events for demo purposes
  simulateEvents(): void {
    const eventTypes: AnalyticsEvent["type"][] = ["page_view", "product_view", "cart_add", "purchase", "search"]
    const pages = ["/", "/products", "/promotions", "/pricing", "/analytics"]
    const products = [
      { id: "prod_1", name: "Blue Dream 1oz" },
      { id: "prod_2", name: "OG Kush Cartridge" },
      { id: "prod_3", name: "Gummy Bears 10mg" },
    ]

    setInterval(
      () => {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        const sessionId = `session_${Math.floor(Math.random() * 100)}`
        const userId = Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 50)}` : undefined

        let eventData: Record<string, any> = {}

        switch (eventType) {
          case "page_view":
            eventData = { path: pages[Math.floor(Math.random() * pages.length)] }
            break
          case "product_view":
          case "cart_add":
            const product = products[Math.floor(Math.random() * products.length)]
            eventData = { productId: product.id, productName: product.name }
            break
          case "purchase":
            const purchaseProduct = products[Math.floor(Math.random() * products.length)]
            eventData = {
              productId: purchaseProduct.id,
              productName: purchaseProduct.name,
              amount: 50 + Math.random() * 200,
              quantity: Math.floor(Math.random() * 3) + 1,
            }
            break
          case "search":
            eventData = { query: ["cannabis", "edibles", "cartridge", "flower"][Math.floor(Math.random() * 4)] }
            break
        }

        this.trackEvent({
          type: eventType,
          sessionId,
          userId,
          data: eventData,
        })
      },
      2000 + Math.random() * 3000,
    ) // Random interval between 2-5 seconds
  }
}

export const realTimeAnalytics = new RealTimeAnalyticsCollector()
export type { AnalyticsEvent, RealtimeAnalytics }
