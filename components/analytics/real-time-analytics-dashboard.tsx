"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Target,
  Zap,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie, // Declare Pie variable here
} from "recharts"

interface RealtimeMetrics {
  timestamp: number
  revenue: {
    total: number
    change: number
    trend: "up" | "down" | "stable"
    hourly: number
    daily: number
  }
  orders: {
    total: number
    change: number
    averageValue: number
    conversionRate: number
  }
  promotions: {
    active: number
    usage: number
    savings: number
    topPerforming: Array<{
      id: string
      name: string
      usage: number
      savings: number
      performance: number
    }>
  }
  products: {
    totalSold: number
    topSelling: Array<{
      id: string
      name: string
      quantity: number
      revenue: number
    }>
    lowStock: number
  }
  customers: {
    active: number
    new: number
    returning: number
    averageSpend: number
  }
  margins: {
    average: number
    change: number
    byCategory: Array<{
      category: string
      margin: number
      revenue: number
    }>
  }
}

interface ChartDataPoint {
  time: string
  revenue: number
  orders: number
  margin: number
  promotionUsage: number
  activeUsers: number
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export function RealTimeAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [timeframe, setTimeframe] = useState<"1h" | "6h" | "24h" | "7d">("24h")
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "orders" | "margin" | "promotions">("revenue")

  // Simulate real-time data updates
  useEffect(() => {
    const generateMockMetrics = (): RealtimeMetrics => ({
      timestamp: Date.now(),
      revenue: {
        total: 2847320 + Math.random() * 100000,
        change: (Math.random() - 0.5) * 20,
        trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
        hourly: 15000 + Math.random() * 5000,
        daily: 120000 + Math.random() * 20000,
      },
      orders: {
        total: 1247 + Math.floor(Math.random() * 100),
        change: (Math.random() - 0.5) * 15,
        averageValue: 89.5 + Math.random() * 20,
        conversionRate: 23.4 + Math.random() * 5,
      },
      promotions: {
        active: 47 + Math.floor(Math.random() * 10),
        usage: 156 + Math.floor(Math.random() * 50),
        savings: 12450 + Math.random() * 2000,
        topPerforming: [
          {
            id: "promo_1",
            name: "Weekend Flash Sale",
            usage: 89 + Math.floor(Math.random() * 20),
            savings: 12450 + Math.random() * 1000,
            performance: 94 + Math.random() * 5,
          },
          {
            id: "promo_2",
            name: "BOGO Edibles",
            usage: 67 + Math.floor(Math.random() * 15),
            savings: 8920 + Math.random() * 800,
            performance: 87 + Math.random() * 8,
          },
        ],
      },
      products: {
        totalSold: 3456 + Math.floor(Math.random() * 200),
        topSelling: [
          {
            id: "prod_1",
            name: "Blue Dream 1oz",
            quantity: 45 + Math.floor(Math.random() * 10),
            revenue: 12600 + Math.random() * 1000,
          },
          {
            id: "prod_2",
            name: "OG Kush Cartridge",
            quantity: 38 + Math.floor(Math.random() * 8),
            revenue: 9500 + Math.random() * 800,
          },
        ],
        lowStock: 23 + Math.floor(Math.random() * 5),
      },
      customers: {
        active: 234 + Math.floor(Math.random() * 50),
        new: 45 + Math.floor(Math.random() * 10),
        returning: 189 + Math.floor(Math.random() * 40),
        averageSpend: 127.5 + Math.random() * 30,
      },
      margins: {
        average: 34.8 + Math.random() * 5,
        change: (Math.random() - 0.5) * 4,
        byCategory: [
          { category: "Flower", margin: 32.5 + Math.random() * 3, revenue: 145000 + Math.random() * 10000 },
          { category: "Edibles", margin: 42.1 + Math.random() * 4, revenue: 89000 + Math.random() * 8000 },
          { category: "Concentrates", margin: 28.7 + Math.random() * 3, revenue: 67000 + Math.random() * 6000 },
        ],
      },
    })

    const generateChartData = (): ChartDataPoint => ({
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      revenue: 15000 + Math.random() * 5000,
      orders: 50 + Math.random() * 20,
      margin: 30 + Math.random() * 10,
      promotionUsage: 20 + Math.random() * 15,
      activeUsers: 200 + Math.random() * 100,
    })

    // Initial data
    setMetrics(generateMockMetrics())
    setChartData(Array.from({ length: 20 }, generateChartData))

    let interval: NodeJS.Timeout
    if (isLive) {
      interval = setInterval(() => {
        setMetrics(generateMockMetrics())
        setChartData((prev) => [...prev.slice(-19), generateChartData()])
        setLastUpdate(new Date())
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLive])

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
      <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading real-time analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Real-Time Analytics</h2>
          <p className="text-muted-foreground">Live business intelligence and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={isLive ? "default" : "outline"} size="sm" onClick={() => setIsLive(!isLive)}>
            <Activity className={`h-4 w-4 mr-2 ${isLive ? "animate-pulse" : ""}`} />
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm font-medium">{isLive ? "Live Updates" : "Updates Paused"}</span>
          </div>
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {metrics.customers.active} Active Users
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {metrics.promotions.active} Active Promotions
          </Badge>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-medium">Total Revenue</span>
              </div>
              {getTrendIcon(metrics.revenue.trend)}
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{formatCurrency(metrics.revenue.total)}</div>
              <div className="flex items-center justify-between">
                {formatChange(metrics.revenue.change)}
                <span className="text-sm text-muted-foreground">vs yesterday</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Hourly</span>
                  <div className="font-medium">{formatCurrency(metrics.revenue.hourly)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Daily</span>
                  <div className="font-medium">{formatCurrency(metrics.revenue.daily)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Orders</span>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{metrics.orders.total.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                {formatChange(metrics.orders.change)}
                <span className="text-sm text-muted-foreground">vs yesterday</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Avg Value</span>
                  <div className="font-medium">{formatCurrency(metrics.orders.averageValue)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Conversion</span>
                  <div className="font-medium">{metrics.orders.conversionRate.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Promotions</span>
              </div>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{metrics.promotions.active}</div>
              <div className="text-sm text-muted-foreground">Active campaigns</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Usage</span>
                  <div className="font-medium">{metrics.promotions.usage}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Savings</span>
                  <div className="font-medium">{formatCurrency(metrics.promotions.savings)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Avg Margin</span>
              </div>
              {metrics.margins.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{metrics.margins.average.toFixed(1)}%</div>
              <div className="flex items-center justify-between">
                {formatChange(metrics.margins.change)}
                <span className="text-sm text-muted-foreground">vs yesterday</span>
              </div>
              <div className="space-y-1">
                {metrics.margins.byCategory.slice(0, 2).map((cat) => (
                  <div key={cat.category} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cat.category}</span>
                    <span className="font-medium">{cat.margin.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Real-time revenue tracking over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
                <CardDescription>Multiple metrics comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="Orders" />
                    <Line type="monotone" dataKey="margin" stroke="#8b5cf6" name="Margin %" />
                    <Line type="monotone" dataKey="promotionUsage" stroke="#f59e0b" name="Promo Usage" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Performing Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {metrics.promotions.topPerforming.map((promo) => (
                      <div key={promo.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium text-sm">{promo.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {promo.usage} uses • {formatCurrency(promo.savings)} saved
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{promo.performance.toFixed(0)}%</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {metrics.products.topSelling.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.quantity} sold • {formatCurrency(product.revenue)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{product.quantity}</div>
                          <div className="text-xs text-muted-foreground">units</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Now</span>
                    <span className="font-bold text-green-600">{metrics.customers.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Today</span>
                    <span className="font-bold text-blue-600">{metrics.customers.new}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Returning</span>
                    <span className="font-bold text-purple-600">{metrics.customers.returning}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Spend</span>
                      <span className="font-bold">{formatCurrency(metrics.customers.averageSpend)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={metrics.margins.byCategory}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ category, revenue }) => `${category}: ${formatCurrency(revenue)}`}
                    >
                      {metrics.margins.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Sales volume and revenue by product</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.products.topSelling}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#3b82f6" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Products requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded">
                    <div>
                      <div className="font-medium text-red-800">Low Stock Items</div>
                      <div className="text-sm text-red-600">{metrics.products.lowStock} products need restocking</div>
                    </div>
                    <Badge variant="destructive">{metrics.products.lowStock}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded">
                    <div>
                      <div className="font-medium text-green-800">Total Products Sold</div>
                      <div className="text-sm text-green-600">Across all categories today</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{metrics.products.totalSold}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Promotion Usage Trends</CardTitle>
                <CardDescription>Real-time promotion engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="promotionUsage" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Promotion Performance</CardTitle>
                <CardDescription>Top performing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.promotions.topPerforming.map((promo, index) => (
                    <div key={promo.id} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{promo.name}</div>
                        <Badge className="bg-green-100 text-green-800">{promo.performance.toFixed(0)}% effective</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Usage</span>
                          <div className="font-medium">{promo.usage} customers</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Savings</span>
                          <div className="font-medium">{formatCurrency(promo.savings)}</div>
                        </div>
                      </div>
                      <Progress value={promo.performance} className="mt-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
                <CardDescription>Real-time user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activeUsers" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Key customer metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">{metrics.customers.active}</div>
                      <div className="text-sm text-muted-foreground">Active Now</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">{metrics.customers.new}</div>
                      <div className="text-sm text-muted-foreground">New Today</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Returning Customers</span>
                      <span className="font-bold">{metrics.customers.returning}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Spend</span>
                      <span className="font-bold">{formatCurrency(metrics.customers.averageSpend)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-bold">{metrics.orders.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
