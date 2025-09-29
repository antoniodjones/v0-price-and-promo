"use client"

import { useState, useEffect } from "react"
import { useWebSocket } from "@/lib/websocket/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface LiveAnalyticsDashboardProps {
  className?: string
}

interface LiveMetric {
  id: string
  name: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  timestamp: number
}

interface LiveEvent {
  id: string
  type: "pricing" | "discount" | "user" | "system"
  message: string
  timestamp: number
  severity: "low" | "medium" | "high"
}

export function LiveAnalyticsDashboard({ className }: LiveAnalyticsDashboardProps) {
  const { connected, error } = useWebSocket({ enablePricing: true })
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    { id: "revenue", name: "Revenue", value: 125430, change: 12.5, trend: "up", timestamp: Date.now() },
    { id: "orders", name: "Orders", value: 1247, change: -3.2, trend: "down", timestamp: Date.now() },
    { id: "customers", name: "Active Users", value: 892, change: 8.7, trend: "up", timestamp: Date.now() },
    { id: "conversion", name: "Conversion Rate", value: 3.4, change: 0.8, trend: "up", timestamp: Date.now() },
  ])

  const [events, setEvents] = useState<LiveEvent[]>([
    {
      id: "1",
      type: "pricing",
      message: "Bulk discount applied to Electronics category",
      timestamp: Date.now() - 30000,
      severity: "medium",
    },
    {
      id: "2",
      type: "user",
      message: "New customer registered: Premium tier",
      timestamp: Date.now() - 60000,
      severity: "low",
    },
    {
      id: "3",
      type: "discount",
      message: "Flash sale activated: 25% off selected items",
      timestamp: Date.now() - 120000,
      severity: "high",
    },
  ])

  const [chartData, setChartData] = useState([
    { time: "10:00", revenue: 4000, orders: 240 },
    { time: "10:15", revenue: 4200, orders: 250 },
    { time: "10:30", revenue: 4100, orders: 245 },
    { time: "10:45", revenue: 4400, orders: 260 },
    { time: "11:00", revenue: 4600, orders: 275 },
    { time: "11:15", revenue: 4300, orders: 255 },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with random changes
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * metric.value * 0.02,
          change: (Math.random() - 0.5) * 20,
          trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable",
          timestamp: Date.now(),
        })),
      )

      // Add new chart data point
      setChartData((prev) => {
        const newTime = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
        const newData = {
          time: newTime,
          revenue: 4000 + Math.random() * 1000,
          orders: 200 + Math.random() * 100,
        }
        return [...prev.slice(-5), newData]
      })

      // Occasionally add new events
      if (Math.random() > 0.7) {
        const eventTypes = ["pricing", "discount", "user", "system"] as const
        const messages = [
          "Dynamic pricing adjustment applied",
          "Customer discount tier upgraded",
          "New bulk order processed",
          "System performance optimized",
          "Inventory threshold reached",
          "Price alert triggered",
        ]

        const newEvent: LiveEvent = {
          id: Date.now().toString(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: Date.now(),
          severity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        }

        setEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMetricIcon = (id: string) => {
    switch (id) {
      case "revenue":
        return <DollarSign className="h-4 w-4" />
      case "orders":
        return <ShoppingCart className="h-4 w-4" />
      case "customers":
        return <Users className="h-4 w-4" />
      case "conversion":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "discount":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "user":
        return <Users className="h-4 w-4 text-purple-500" />
      case "system":
        return <Activity className="h-4 w-4 text-orange-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-red-500 bg-red-50/30"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/30"
      case "low":
        return "border-l-green-500 bg-green-50/30"
      default:
        return "border-l-gray-500 bg-gray-50/30"
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Live Analytics Dashboard</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {connected ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </div>
          <CardDescription>Real-time business metrics and system events</CardDescription>
        </CardHeader>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(metric.id)}
                  <span className="text-sm font-medium text-muted-foreground">{metric.name}</span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {metric.id === "revenue"
                    ? `$${metric.value.toLocaleString()}`
                    : metric.id === "conversion"
                      ? `${metric.value.toFixed(1)}%`
                      : metric.value.toLocaleString()}
                </div>
                <div
                  className={`text-xs flex items-center space-x-1 ${
                    metric.change > 0 ? "text-green-600" : metric.change < 0 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  <span>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change.toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Events */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList>
          <TabsTrigger value="charts">Live Charts</TabsTrigger>
          <TabsTrigger value="events">Event Stream</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Trend</CardTitle>
                <CardDescription>Real-time revenue updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Volume</CardTitle>
                <CardDescription>Live order processing</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Event Stream</CardTitle>
              <CardDescription>Real-time system and business events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className={`p-3 rounded-lg border-l-4 ${getSeverityColor(event.severity)}`}>
                    <div className="flex items-start space-x-3">
                      {getEventIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
