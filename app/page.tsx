"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  DollarSign,
  Package,
  AlertTriangle,
  Users,
  Activity,
  Zap,
  BarChart3,
  Clock,
  Loader2,
  Bell,
  Target,
  Sparkles,
} from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MetricCard } from "@/components/dashboard/metric-card"
import { MiniChart } from "@/components/dashboard/mini-chart"
import { DocumentationLink } from "@/components/shared/documentation-link"

interface DashboardData {
  overview: {
    totalProducts: number
    lowInventory: number
    totalInventoryValue: number
    avgMargin: number
    activePromotions: number
    totalCustomers: number
    activeCustomers: number
    priceChangeCount: number
  }
  revenue: {
    totalRevenue: number
    revenueChange: number
    revenueChangePercent: number
    ordersCount: number
    avgOrderValue: number
    conversionRate: number
  } | null
  products: {
    total: number
    lowInventory: number
    categories: Array<{
      name: string
      count: number
      value: number
      percentage: number
    }>
  }
  promotions: {
    active: number
    byType: Array<{ type: string; count: number }>
  }
  customers: {
    total: number
    active: number
    totalValue: number
    avgValue: number
    byTier: Array<{ tier: string; count: number; percentage: number }>
  }
  performance: {
    avgResponseTime: number
    avgErrorRate: number
    avgCpuUsage: number
    avgMemoryUsage: number
    metrics: Array<{
      timestamp: string
      responseTime: number
      errorRate: number
      cpuUsage: number
      memoryUsage: number
    }>
  }
  events: {
    total: number
    byType: Array<{ type: string; count: number }>
    recent: Array<{
      id: string
      type: string
      title: string
      description: string
      severity: string
      timestamp: string
      value: number
    }>
  }
  alerts: {
    total: number
    items: Array<{
      id: string
      metric: string
      description: string
      severity: string
      value: number
      threshold: number
      timestamp: string
    }>
  }
  timeRange: string
  generatedAt: string
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [timeRange])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load dashboard data")
      }

      setData(result.data)
    } catch (err) {
      console.error("[v0] Error loading dashboard:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "error":
        return "text-destructive"
      case "warning":
        return "text-chart-3"
      case "info":
        return "text-chart-1"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading dashboard...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !data) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error || "Unknown error occurred"}</p>
              <Button onClick={loadDashboardData}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Comprehensive view of your pricing engine</p>
              </div>
              <div className="flex items-center gap-3">
                <DocumentationLink pageId="dashboard" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last hour</SelectItem>
                    <SelectItem value="12h">Last 12 hours</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadDashboardData}>
                  <Activity className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={data.revenue ? formatCurrency(data.revenue.totalRevenue) : "N/A"}
                change={data.revenue?.revenueChangePercent}
                icon={DollarSign}
                trend={data.revenue && data.revenue.revenueChangePercent > 0 ? "up" : "down"}
              />
              <MetricCard
                title="Total Products"
                value={formatNumber(data.overview.totalProducts)}
                changeLabel={`${data.overview.lowInventory} low inventory`}
                icon={Package}
                trend="neutral"
              />
              <MetricCard
                title="Active Customers"
                value={formatNumber(data.customers.active)}
                changeLabel={`of ${data.customers.total} total`}
                icon={Users}
                trend="neutral"
              />
              <MetricCard
                title="Active Promotions"
                value={formatNumber(data.overview.activePromotions)}
                changeLabel={`${data.overview.priceChangeCount} price changes`}
                icon={Zap}
                trend="neutral"
              />
            </div>

            {/* Revenue & Performance */}
            {data.revenue && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.revenue.ordersCount)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg: {formatCurrency(data.revenue.avgOrderValue)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.revenue.conversionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Customer conversion</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.overview.avgMargin.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all products</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* System Performance */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-chart-1" />
                    System Performance
                  </CardTitle>
                  <CardDescription>Real-time system metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">{data.performance.avgResponseTime.toFixed(0)}ms</span>
                    </div>
                    {data.performance.metrics.length > 0 && (
                      <MiniChart
                        data={data.performance.metrics.map((m) => ({
                          value: m.responseTime,
                          timestamp: m.timestamp,
                        }))}
                        color="hsl(var(--chart-1))"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                      <div className="text-xl font-bold">{data.performance.avgErrorRate.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CPU Usage</div>
                      <div className="text-xl font-bold">{data.performance.avgCpuUsage.toFixed(1)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Categories */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-chart-2" />
                    Product Categories
                  </CardTitle>
                  <CardDescription>Inventory distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.products.categories.slice(0, 5).map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-muted-foreground">
                            {cat.count} ({cat.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-chart-2" style={{ width: `${cat.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Segments */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-chart-3" />
                    Customer Segments
                  </CardTitle>
                  <CardDescription>Distribution by tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.customers.byTier.map((tier) => (
                      <div key={tier.tier} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            Tier {tier.tier}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{tier.count} customers</span>
                        </div>
                        <span className="text-sm font-medium">{tier.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Avg Customer Value</span>
                        <span className="font-medium">{formatCurrency(data.customers.avgValue)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Alerts */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-chart-3" />
                    Active Alerts
                    {data.alerts.total > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {data.alerts.total}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>System alerts and warnings</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.alerts.total === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No active alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.alerts.items.slice(0, 5).map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{alert.metric}</div>
                            <div className="text-xs text-muted-foreground mt-1">{alert.description}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Value: {alert.value.toFixed(2)} / Threshold: {alert.threshold.toFixed(2)}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Events
                </CardTitle>
                <CardDescription>Latest system activity</CardDescription>
              </CardHeader>
              <CardContent>
                {data.events.recent.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent events</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.events.recent.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className={`h-2 w-2 rounded-full mt-2 ${getSeverityColor(event.severity)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{event.title}</div>
                          {event.description && (
                            <div className="text-xs text-muted-foreground mt-1">{event.description}</div>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            {event.value && (
                              <span className="text-xs text-muted-foreground">
                                Value: {formatCurrency(event.value)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(event.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/products">
                <Card className="border-border/50 hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Manage product catalog and pricing</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/promotions">
                <Card className="border-border/50 hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Promotions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Create and manage promotions</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/simulator">
                <Card className="border-chart-1/30 bg-chart-1/5 hover:bg-chart-1/10 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-chart-1" />
                      Promo Simulator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Test promotional scenarios and impact</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/analytics">
                <Card className="border-border/50 hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">View detailed analytics and reports</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/settings">
                <Card className="border-border/50 hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Configure system settings</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
