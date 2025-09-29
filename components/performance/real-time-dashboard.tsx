"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Zap,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PerformanceMetrics {
  timestamp: number
  responseTime: number
  throughput: number
  errorRate: number
  cpuUsage: number
  memoryUsage: number
  databaseConnections: number
  cacheHitRate: number
  queueLength: number
  activeUsers: number
}

interface PerformanceAlert {
  id: string
  ruleId: string
  metric: string
  value: number
  threshold: number
  severity: string
  timestamp: number
  resolved: boolean
  resolvedAt?: number
}

export function RealTimePerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [metricsHistory, setMetricsHistory] = useState<PerformanceMetrics[]>([])
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/performance/metrics?latest=true")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setMetrics(data.data)
            setLastUpdate(new Date())
            setIsConnected(true)
          }
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
        setIsConnected(false)
      }
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/performance/metrics?minutes=30")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setMetricsHistory(data.data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch metrics history:", error)
      }
    }

    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/performance/alerts?active=true")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setAlerts(data.data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error)
      }
    }

    // Initial fetch
    fetchMetrics()
    fetchHistory()
    fetchAlerts()

    // Set up real-time updates
    interval = setInterval(() => {
      fetchMetrics()
      fetchAlerts()
    }, 5000)

    // Fetch history less frequently
    const historyInterval = setInterval(fetchHistory, 30000)

    return () => {
      clearInterval(interval)
      clearInterval(historyInterval)
    }
  }, [])

  const getMetricStatus = (value: number, threshold: number, inverse = false) => {
    const ratio = value / threshold
    if (inverse) {
      return ratio < 0.7 ? "critical" : ratio < 0.9 ? "warning" : "good"
    }
    return ratio > 0.9 ? "critical" : ratio > 0.7 ? "warning" : "good"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatChartData = () => {
    return metricsHistory.slice(-20).map((m) => ({
      time: new Date(m.timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      responseTime: m.responseTime,
      throughput: m.throughput,
      errorRate: m.errorRate,
      cpuUsage: m.cpuUsage,
      memoryUsage: m.memoryUsage,
    }))
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading performance metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Performance Dashboard</h2>
          <p className="text-muted-foreground">Live system monitoring and performance analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</span>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {alerts.length} active alert{alerts.length > 1 ? "s" : ""} detected
              </span>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Response Time</span>
              </div>
              {metrics.responseTime > 800 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {Math.round(metrics.responseTime)}
                <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
              </div>
              <Progress value={(metrics.responseTime / 1000) * 100} className="h-2" />
              <div
                className={`text-xs px-2 py-1 rounded border ${getStatusColor(getMetricStatus(metrics.responseTime, 1000))}`}
              >
                {getMetricStatus(metrics.responseTime, 1000).toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Throughput</span>
              </div>
              <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {Math.round(metrics.throughput)}
                <span className="text-sm font-normal text-muted-foreground ml-1">req/s</span>
              </div>
              <Progress value={(metrics.throughput / 2000) * 100} className="h-2" />
              <div className="text-xs px-2 py-1 rounded border bg-green-50 text-green-600 border-green-200">
                OPTIMAL
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Error Rate</span>
              </div>
              {metrics.errorRate > 2 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {metrics.errorRate.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground ml-1">%</span>
              </div>
              <Progress value={(metrics.errorRate / 10) * 100} className="h-2" />
              <div
                className={`text-xs px-2 py-1 rounded border ${getStatusColor(getMetricStatus(metrics.errorRate, 5))}`}
              >
                {getMetricStatus(metrics.errorRate, 5).toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              {metrics.cpuUsage > 70 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {Math.round(metrics.cpuUsage)}
                <span className="text-sm font-normal text-muted-foreground ml-1">%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
              <div
                className={`text-xs px-2 py-1 rounded border ${getStatusColor(getMetricStatus(metrics.cpuUsage, 80))}`}
              >
                {getMetricStatus(metrics.cpuUsage, 80).toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Response Time Trend</CardTitle>
            <CardDescription>Last 30 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Resources</CardTitle>
            <CardDescription>CPU and Memory usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpuUsage" stroke="#8b5cf6" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memoryUsage" stroke="#10b981" strokeWidth={2} name="Memory %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Database</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Active Connections</span>
                <span className="font-medium">{metrics.databaseConnections}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cache Hit Rate</span>
                <span className="font-medium">{metrics.cacheHitRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Traffic</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Active Users</span>
                <span className="font-medium">{metrics.activeUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Queue Length</span>
                <span className="font-medium">{metrics.queueLength}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Alerts</span>
            </div>
            <div className="space-y-2">
              {alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">{alert.metric}</span>
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                </div>
              ))}
              {alerts.length === 0 && <div className="text-xs text-muted-foreground">No active alerts</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
