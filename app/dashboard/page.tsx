"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Users,
  Target,
  Activity,
  Bell,
  Eye,
  Zap,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface DashboardStats {
  total_products: number
  tracked_products: number
  active_promotions: number
  price_alerts: number
  revenue_impact: number
  cost_savings: number
  avg_price_change: number
  competitor_advantage: number
}

interface RecentActivity {
  id: string
  type: "price_change" | "promotion_created" | "alert_triggered" | "product_added"
  title: string
  description: string
  timestamp: string
  status: "success" | "warning" | "info"
}

interface TopProduct {
  id: string
  name: string
  sku: string
  current_price: number
  price_change_24h: number
  price_change_percentage: number
  sales_rank: number
  margin: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    tracked_products: 0,
    active_promotions: 0,
    price_alerts: 0,
    revenue_impact: 0,
    cost_savings: 0,
    avg_price_change: 0,
    competitor_advantage: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  const mockUser = { email: "dev@gti.com" }
  const mockProfile = { first_name: "Developer", role: "admin" }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Mock data - in real implementation, this would fetch from API
      const mockStats: DashboardStats = {
        total_products: 1247,
        tracked_products: 892,
        active_promotions: 23,
        price_alerts: 8,
        revenue_impact: 156780,
        cost_savings: 42350,
        avg_price_change: -3.2,
        competitor_advantage: 12.5,
      }

      const mockActivity: RecentActivity[] = [
        {
          id: "1",
          type: "alert_triggered",
          title: "Price Alert: Premium OG Kush",
          description: "Competitor dropped price by 15% - consider price match",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: "warning",
        },
        {
          id: "2",
          type: "promotion_created",
          title: "New Promotion: Blue Dream Flash Sale",
          description: "30% off promotion created for expiring inventory",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "success",
        },
        {
          id: "3",
          type: "price_change",
          title: "Price Update: Edibles Category",
          description: "Average price increased by 8% across all edibles",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: "info",
        },
        {
          id: "4",
          type: "product_added",
          title: "New Product: Hybrid Cartridge",
          description: "Added to tracking with competitive pricing analysis",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: "success",
        },
      ]

      const mockTopProducts: TopProduct[] = [
        {
          id: "1",
          name: "Premium OG Kush",
          sku: "POK-001",
          current_price: 45.99,
          price_change_24h: -2.5,
          price_change_percentage: -5.2,
          sales_rank: 1,
          margin: 32.5,
        },
        {
          id: "2",
          name: "Blue Dream Cartridge",
          sku: "BDC-002",
          current_price: 38.99,
          price_change_24h: 1.5,
          price_change_percentage: 4.0,
          sales_rank: 2,
          margin: 28.7,
        },
        {
          id: "3",
          name: "Sour Diesel",
          sku: "SD-003",
          current_price: 42.99,
          price_change_24h: 0,
          price_change_percentage: 0,
          sales_rank: 3,
          margin: 35.2,
        },
        {
          id: "4",
          name: "Gummy Bears 10mg",
          sku: "GB-004",
          current_price: 24.99,
          price_change_24h: -1.0,
          price_change_percentage: -3.8,
          sales_rank: 4,
          margin: 45.1,
        },
      ]

      setStats(mockStats)
      setRecentActivity(mockActivity)
      setTopProducts(mockTopProducts)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "price_change":
        return <TrendingUp className="h-4 w-4" />
      case "promotion_created":
        return <Zap className="h-4 w-4" />
      case "alert_triggered":
        return <Bell className="h-4 w-4" />
      case "product_added":
        return <Package className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-gti-bright-green"
      case "warning":
        return "text-yellow-500"
      case "info":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-emerald-400 mb-2">GTI Pricing Engine</h1>
                <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>
                <p className="text-xl text-muted-foreground mt-2">
                  Welcome back, {mockProfile?.first_name || mockUser.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 days
                </Button>
                <Button className="bg-gti-dark-green hover:bg-gti-medium-green text-white">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_products.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{stats.tracked_products} actively tracked</p>
                  <Progress value={(stats.tracked_products / stats.total_products) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
                  <DollarSign className="h-4 w-4 text-gti-bright-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gti-bright-green">{formatCurrency(stats.revenue_impact)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +23% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats.price_alerts}</div>
                  <p className="text-xs text-muted-foreground">{stats.active_promotions} active promotions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Competitive Edge</CardTitle>
                  <Target className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{formatPercentage(stats.competitor_advantage)}</div>
                  <p className="text-xs text-muted-foreground">Average price advantage</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Top Products</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gti-bright-green" />
                        Price Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Price Change</span>
                          <span
                            className={`text-sm font-medium ${stats.avg_price_change < 0 ? "text-gti-bright-green" : "text-red-500"}`}
                          >
                            {formatPercentage(stats.avg_price_change)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Cost Savings</span>
                          <span className="text-sm font-medium text-gti-bright-green">
                            {formatCurrency(stats.cost_savings)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Market Position</span>
                          <Badge className="bg-gti-dark-green text-white">Leading</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-yellow-500" />
                        Alert Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Price Alerts</span>
                          <Badge variant="destructive">{stats.price_alerts}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Inventory Alerts</span>
                          <Badge variant="secondary">3</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Competitor Alerts</span>
                          <Badge variant="secondary">5</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Data Sources</span>
                          <Badge className="bg-gti-bright-green text-white">Online</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Last Sync</span>
                          <span className="text-sm text-muted-foreground">2 min ago</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">API Status</span>
                          <Badge className="bg-gti-bright-green text-white">Healthy</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Top Products Tab */}
              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Products</CardTitle>
                    <CardDescription>Products with highest sales and margin performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gti-dark-green text-white rounded-full text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.sku}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(product.current_price)}</div>
                              <div
                                className={`text-sm flex items-center ${product.price_change_24h >= 0 ? "text-red-500" : "text-gti-bright-green"}`}
                              >
                                {product.price_change_24h >= 0 ? (
                                  <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                {formatPercentage(product.price_change_percentage)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Margin</div>
                              <div className="font-medium text-gti-bright-green">{product.margin.toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recent Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`${getActivityColor(activity.status)} mt-1`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted-foreground">{activity.description}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{formatTimeAgo(activity.timestamp)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Actions Tab */}
              <TabsContent value="quick-actions" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        Product Management
                      </CardTitle>
                      <CardDescription>Manage your product catalog and pricing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/products">
                        <Button className="w-full bg-transparent" variant="outline">
                          View All Products
                        </Button>
                      </Link>
                      <Link href="/products/add">
                        <Button className="w-full bg-gti-dark-green hover:bg-gti-medium-green text-white">
                          Add New Product
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gti-bright-green" />
                        Price Tracking
                      </CardTitle>
                      <CardDescription>Monitor and analyze price changes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/price-tracking">
                        <Button className="w-full bg-transparent" variant="outline">
                          View Price Tracking
                        </Button>
                      </Link>
                      <Link href="/price-tracking/alerts">
                        <Button className="w-full bg-gti-dark-green hover:bg-gti-medium-green text-white">
                          Manage Alerts
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Promotions
                      </CardTitle>
                      <CardDescription>Create and manage promotional campaigns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/promotions">
                        <Button className="w-full bg-transparent" variant="outline">
                          View Promotions
                        </Button>
                      </Link>
                      <Link href="/promotion-detection">
                        <Button className="w-full bg-gti-dark-green hover:bg-gti-medium-green text-white">
                          AI Detection
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-500" />
                        Watchlist
                      </CardTitle>
                      <CardDescription>Track your favorite products</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/watchlist">
                        <Button className="w-full bg-transparent" variant="outline">
                          My Watchlist
                        </Button>
                      </Link>
                      <Button className="w-full bg-gti-dark-green hover:bg-gti-medium-green text-white">
                        Add to Watchlist
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-red-500" />
                        Competitor Analysis
                      </CardTitle>
                      <CardDescription>Analyze market positioning</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/competitor-analysis">
                        <Button className="w-full bg-transparent" variant="outline">
                          View Analysis
                        </Button>
                      </Link>
                      <Button className="w-full bg-gti-dark-green hover:bg-gti-medium-green text-white">
                        Run Comparison
                      </Button>
                    </CardContent>
                  </Card>

                  {mockProfile?.role === "admin" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-500" />
                          Admin Panel
                        </CardTitle>
                        <CardDescription>System administration and settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Link href="/admin">
                          <Button className="w-full bg-transparent" variant="outline">
                            Admin Dashboard
                          </Button>
                        </Link>
                        <Link href="/admin/users">
                          <Button className="w-full bg-gti-dark-green hover:bg-gti-medium-green text-white">
                            Manage Users
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
