"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Bell,
  Activity,
  BarChart3,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
} from "lucide-react"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  activePromotions: number
  promotionChange: number
  trackedProducts: number
  productChange: number
  priceAlerts: number
  alertChange: number
  avgMargin: number
  marginChange: number
  customerSavings: number
  savingsChange: number
}

interface PriceAlert {
  id: string
  product: string
  type: "increase" | "decrease" | "threshold"
  change: number
  severity: "high" | "medium" | "low"
  time: string
}

interface PromotionPerformance {
  name: string
  type: string
  usage: number
  savings: number
  performance: number
}

export function ComprehensiveOverview() {
  const [stats] = useState<DashboardStats>({
    totalRevenue: 2847320,
    revenueChange: 12.5,
    activePromotions: 47,
    promotionChange: 8,
    trackedProducts: 1247,
    productChange: 15.2,
    priceAlerts: 23,
    alertChange: -18,
    avgMargin: 34.8,
    marginChange: 2.1,
    customerSavings: 485920,
    savingsChange: 22.3,
  })

  const [recentAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      product: "Premium Product A - High-volume test product",
      type: "decrease",
      change: -8.5,
      severity: "medium",
      time: "2 hours ago",
    },
    {
      id: "2",
      product: "Mid-range Product B - Workflow testing item",
      type: "increase",
      change: 12.3,
      severity: "high",
      time: "4 hours ago",
    },
    {
      id: "3",
      product: "Budget Product C - Pricing validation test",
      type: "threshold",
      change: 15.0,
      severity: "low",
      time: "6 hours ago",
    },
  ])

  const [topPromotions] = useState<PromotionPerformance[]>([
    {
      name: "Weekend Flash Sale",
      type: "Category Discount",
      usage: 89,
      savings: 12450,
      performance: 94,
    },
    {
      name: "Buy 2 Get 1 Free Bundle",
      type: "BOGO Deal",
      usage: 156,
      savings: 8920,
      performance: 87,
    },
    {
      name: "Premium Brand 15% Off",
      type: "Brand Discount",
      usage: 67,
      savings: 15680,
      performance: 92,
    },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatChange = (change: number) => {
    const isPositive = change > 0
    return (
      <span
        className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? "text-accent-green" : "text-destructive"
        }`}
      >
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(change)}%
      </span>
    )
  }

  const getAlertIcon = (type: string, severity: string) => {
    const baseClasses = "h-4 w-4"
    if (type === "increase") {
      return (
        <TrendingUp className={`${baseClasses} ${severity === "high" ? "text-destructive" : "text-accent-yellow"}`} />
      )
    } else if (type === "decrease") {
      return <TrendingDown className={`${baseClasses} text-accent-green`} />
    } else {
      return <AlertTriangle className={`${baseClasses} text-accent-blue`} />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-balance">Promotions Engine</h1>
          <p className="text-muted-foreground text-lg mt-2">
            Comprehensive pricing analytics and promotion management platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="bg-accent-blue text-white hover:bg-accent-blue/90">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-accent-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center justify-between mt-2">
              {formatChange(stats.revenueChange)}
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Target className="h-4 w-4 text-accent-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activePromotions}</div>
            <div className="flex items-center justify-between mt-2">
              {formatChange(stats.promotionChange)}
              <span className="text-xs text-muted-foreground">campaigns running</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-purple/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Products</CardTitle>
            <Package className="h-4 w-4 text-accent-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.trackedProducts.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              {formatChange(stats.productChange)}
              <span className="text-xs text-muted-foreground">price monitoring</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-yellow/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Alerts</CardTitle>
            <Bell className="h-4 w-4 text-accent-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.priceAlerts}</div>
            <div className="flex items-center justify-between mt-2">
              {formatChange(stats.alertChange)}
              <span className="text-xs text-muted-foreground">active alerts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-accent-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgMargin}%</div>
            <div className="flex items-center justify-between mt-2">
              {formatChange(stats.marginChange)}
              <span className="text-xs text-muted-foreground">profit margin</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Savings</CardTitle>
            <Users className="h-4 w-4 text-accent-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.customerSavings)}</div>
            <div className="flex items-center justify-between mt-2">
              {formatChange(stats.savingsChange)}
              <span className="text-xs text-muted-foreground">total discounts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="promotions">Top Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent-blue" />
                Recent Price Alerts
              </CardTitle>
              <CardDescription>Latest price changes and threshold notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div>
                        <div className="font-medium">{alert.product}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.type === "increase"
                            ? "Price increased"
                            : alert.type === "decrease"
                              ? "Price decreased"
                              : "Threshold reached"}{" "}
                          by {Math.abs(alert.change)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent-green" />
                Top Performing Promotions
              </CardTitle>
              <CardDescription>Best performing campaigns this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPromotions.map((promo, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{promo.name}</div>
                        <div className="text-sm text-muted-foreground">{promo.type}</div>
                      </div>
                      <Badge className="bg-accent-green text-white">{promo.performance}% effective</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Usage</div>
                        <div className="font-medium">{promo.usage} customers</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Savings</div>
                        <div className="font-medium">{formatCurrency(promo.savings)}</div>
                      </div>
                    </div>
                    <Progress value={promo.performance} className="mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Optimization</CardTitle>
                <CardDescription>AI-powered pricing recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Potential Revenue Increase</span>
                    <span className="font-bold text-accent-green">+$47,320</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Underpriced Products</span>
                    <span className="font-bold">23 items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Optimization Score</span>
                    <span className="font-bold text-accent-blue">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
                <CardDescription>Competitive pricing insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Competitive Position</span>
                    <Badge className="bg-accent-green text-white">Strong</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price Advantage</span>
                    <span className="font-bold text-accent-green">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Share</span>
                    <span className="font-bold">34.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent-blue" />
                  Manage Products
                </CardTitle>
                <CardDescription>Add, edit, and organize your product catalog</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent-green" />
                  Create Promotion
                </CardTitle>
                <CardDescription>Set up new discounts and BOGO deals</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent-yellow" />
                  Setup Price Alerts
                </CardTitle>
                <CardDescription>Monitor price changes and set notifications</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent-purple" />
                  Customer Discounts
                </CardTitle>
                <CardDescription>Create targeted customer discount programs</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent-blue" />
                  View Analytics
                </CardTitle>
                <CardDescription>Comprehensive performance reports</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system preferences and integrations</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
