"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Zap,
  Clock,
  Database,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
  Download,
  Filter,
  Server,
  Cpu,
  HardDrive,
  Network,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"

interface AdvancedMetric {
  id: string
  name: string
  value: number
  unit: string
  threshold: {
    warning: number
    critical: number
  }
  status: "healthy" | "warning" | "critical" | "unknown"
  trend: "up" | "down" | "stable"
  category: "system" | "application" | "business" | "database"
  history: Array<{ timestamp: number; value: number }>
  lastUpdated: number
}

interface AlertRule {
  id: string
  metric: string
  operator: ">" | "<" | "=" | ">=" | "<="
  threshold: number
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  cooldownMs: number
  lastTriggered?: number
  description: string
}

interface PerformanceAlert {
  id: string
  ruleId: string
  metric: string
  value: number
  threshold: number
  severity: "low" | "medium" | "high" | "critical"
  timestamp: number
  resolved: boolean
  resolvedAt?: number
  metadata?: Record<string, any>
}

interface SystemHealth {
  overall: "healthy" | "degraded" | "critical"
  score: number
  issues: Array<{
    type: "performance" | "availability" | "error"
    severity: "low" | "medium" | "high" | "critical"
    message: string
    metric?: string
    value?: number
  }>
}

export function AdvancedPerformanceMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("1h")

  const [metrics, setMetrics] = useState<AdvancedMetric[]>([
    // System Metrics
    {
      id: "cpu_usage",
      name: "CPU Usage",
      value: 45.2,
      unit: "%",
      threshold: { warning: 70, critical: 85 },
      status: "healthy",
      trend: "stable",
      category: "system",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "memory_usage",
      name: "Memory Usage",
      value: 62.8,
      unit: "%",
      threshold: { warning: 80, critical: 90 },
      status: "healthy",
      trend: "up",
      category: "system",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "disk_usage",
      name: "Disk Usage",
      value: 34.5,
      unit: "%",
      threshold: { warning: 80, critical: 90 },
      status: "healthy",
      trend: "stable",
      category: "system",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "network_io",
      name: "Network I/O",
      value: 125.6,
      unit: "MB/s",
      threshold: { warning: 500, critical: 800 },
      status: "healthy",
      trend: "up",
      category: "system",
      history: [],
      lastUpdated: Date.now(),
    },
    // Application Metrics
    {
      id: "response_time",
      name: "Avg Response Time",
      value: 245,
      unit: "ms",
      threshold: { warning: 500, critical: 1000 },
      status: "healthy",
      trend: "stable",
      category: "application",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "throughput",
      name: "Throughput",
      value: 1250,
      unit: "req/s",
      threshold: { warning: 500, critical: 200 },
      status: "healthy",
      trend: "up",
      category: "application",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "error_rate",
      name: "Error Rate",
      value: 0.8,
      unit: "%",
      threshold: { warning: 2, critical: 5 },
      status: "healthy",
      trend: "down",
      category: "application",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "active_users",
      name: "Active Users",
      value: 127,
      unit: "users",
      threshold: { warning: 1000, critical: 1500 },
      status: "healthy",
      trend: "up",
      category: "application",
      history: [],
      lastUpdated: Date.now(),
    },
    // Database Metrics
    {
      id: "db_connections",
      name: "DB Connections",
      value: 15,
      unit: "active",
      threshold: { warning: 50, critical: 80 },
      status: "healthy",
      trend: "stable",
      category: "database",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "db_query_time",
      name: "Avg Query Time",
      value: 45,
      unit: "ms",
      threshold: { warning: 100, critical: 200 },
      status: "healthy",
      trend: "stable",
      category: "database",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "cache_hit_rate",
      name: "Cache Hit Rate",
      value: 94.2,
      unit: "%",
      threshold: { warning: 80, critical: 70 },
      status: "healthy",
      trend: "up",
      category: "database",
      history: [],
      lastUpdated: Date.now(),
    },
    // Business Metrics
    {
      id: "pricing_calculations",
      name: "Pricing Calculations",
      value: 456,
      unit: "/min",
      threshold: { warning: 1000, critical: 1500 },
      status: "healthy",
      trend: "up",
      category: "business",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "promotion_usage",
      name: "Promotion Usage",
      value: 23,
      unit: "/min",
      threshold: { warning: 100, critical: 150 },
      status: "healthy",
      trend: "stable",
      category: "business",
      history: [],
      lastUpdated: Date.now(),
    },
    {
      id: "revenue_per_minute",
      name: "Revenue/Min",
      value: 1420.5,
      unit: "$",
      threshold: { warning: 500, critical: 200 },
      status: "healthy",
      trend: "up",
      category: "business",
      history: [],
      lastUpdated: Date.now(),
    },
  ])

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "cpu_high",
      metric: "cpu_usage",
      operator: ">",
      threshold: 80,
      severity: "high",
      enabled: true,
      cooldownMs: 300000, // 5 minutes
      description: "CPU usage is critically high",
    },
    {
      id: "memory_high",
      metric: "memory_usage",
      operator: ">",
      threshold: 85,
      severity: "critical",
      enabled: true,
      cooldownMs: 300000,
      description: "Memory usage is critically high",
    },
    {
      id: "response_time_high",
      metric: "response_time",
      operator: ">",
      threshold: 1000,
      severity: "high",
      enabled: true,
      cooldownMs: 180000, // 3 minutes
      description: "Response time is too high",
    },
    {
      id: "error_rate_high",
      metric: "error_rate",
      operator: ">",
      threshold: 3,
      severity: "critical",
      enabled: true,
      cooldownMs: 120000, // 2 minutes
      description: "Error rate is above acceptable threshold",
    },
  ])

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: "healthy",
    score: 95,
    issues: [],
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate real-time metrics updates
  useEffect(() => {
    if (isMonitoring && autoRefresh) {
      intervalRef.current = setInterval(() => {
        setMetrics((prev) =>
          prev.map((metric) => {
            const variation = (Math.random() - 0.5) * 0.15
            let newValue = Math.max(0, metric.value * (1 + variation))

            // Add some realistic patterns
            if (metric.id === "active_users") {
              const hour = new Date().getHours()
              const businessHourMultiplier = hour >= 9 && hour <= 17 ? 1.2 : 0.8
              newValue = newValue * businessHourMultiplier
            }

            if (metric.id === "revenue_per_minute") {
              newValue = Math.max(200, newValue)
            }

            const newStatus =
              newValue >= metric.threshold.critical
                ? "critical"
                : newValue >= metric.threshold.warning
                  ? "warning"
                  : "healthy"

            const trend = newValue > metric.value * 1.05 ? "up" : newValue < metric.value * 0.95 ? "down" : "stable"

            return {
              ...metric,
              value: Number.parseFloat(newValue.toFixed(metric.unit === "%" ? 1 : metric.unit === "$" ? 2 : 0)),
              status: newStatus,
              trend,
              history: [...metric.history.slice(-59), { timestamp: Date.now(), value: newValue }],
              lastUpdated: Date.now(),
            }
          }),
        )

        // Check alert rules
        checkAlertRules()
        updateSystemHealth()
      }, refreshInterval * 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMonitoring, autoRefresh, refreshInterval])

  const checkAlertRules = () => {
    const currentTime = Date.now()

    alertRules.forEach((rule) => {
      if (!rule.enabled) return

      // Check cooldown
      if (rule.lastTriggered && currentTime - rule.lastTriggered < rule.cooldownMs) {
        return
      }

      const metric = metrics.find((m) => m.id === rule.metric)
      if (!metric) return

      let shouldTrigger = false
      switch (rule.operator) {
        case ">":
          shouldTrigger = metric.value > rule.threshold
          break
        case "<":
          shouldTrigger = metric.value < rule.threshold
          break
        case ">=":
          shouldTrigger = metric.value >= rule.threshold
          break
        case "<=":
          shouldTrigger = metric.value <= rule.threshold
          break
        case "=":
          shouldTrigger = Math.abs(metric.value - rule.threshold) < 0.1
          break
      }

      if (shouldTrigger) {
        const newAlert: PerformanceAlert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ruleId: rule.id,
          metric: rule.metric,
          value: metric.value,
          threshold: rule.threshold,
          severity: rule.severity,
          timestamp: currentTime,
          resolved: false,
          metadata: {
            metricName: metric.name,
            unit: metric.unit,
            description: rule.description,
          },
        }

        setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]) // Keep last 50 alerts

        // Update rule last triggered time
        setAlertRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, lastTriggered: currentTime } : r)))
      }
    })
  }

  const updateSystemHealth = () => {
    const criticalMetrics = metrics.filter((m) => m.status === "critical")
    const warningMetrics = metrics.filter((m) => m.status === "warning")

    let overall: SystemHealth["overall"] = "healthy"
    let score = 100
    const issues: SystemHealth["issues"] = []

    if (criticalMetrics.length > 0) {
      overall = "critical"
      score = Math.max(0, score - criticalMetrics.length * 25)
      criticalMetrics.forEach((metric) => {
        issues.push({
          type: "performance",
          severity: "critical",
          message: `${metric.name} is at critical level: ${metric.value}${metric.unit}`,
          metric: metric.id,
          value: metric.value,
        })
      })
    } else if (warningMetrics.length > 0) {
      overall = "degraded"
      score = Math.max(0, score - warningMetrics.length * 10)
      warningMetrics.forEach((metric) => {
        issues.push({
          type: "performance",
          severity: "medium",
          message: `${metric.name} is above warning threshold: ${metric.value}${metric.unit}`,
          metric: metric.id,
          value: metric.value,
        })
      })
    }

    setSystemHealth({ overall, score, issues })
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true, resolvedAt: Date.now() } : alert)),
    )
  }

  const exportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: metrics.map((m) => ({
        name: m.name,
        value: m.value,
        unit: m.unit,
        status: m.status,
        category: m.category,
      })),
      systemHealth,
      alerts: alerts.filter((a) => !a.resolved).length,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `performance-metrics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredMetrics = selectedCategory === "all" ? metrics : metrics.filter((m) => m.category === selectedCategory)

  const getMetricIcon = (category: string, metricId: string) => {
    if (category === "system") {
      if (metricId.includes("cpu")) return <Cpu className="h-4 w-4" />
      if (metricId.includes("memory")) return <Database className="h-4 w-4" />
      if (metricId.includes("disk")) return <HardDrive className="h-4 w-4" />
      if (metricId.includes("network")) return <Network className="h-4 w-4" />
      return <Server className="h-4 w-4" />
    }
    if (category === "application") {
      if (metricId.includes("users")) return <Users className="h-4 w-4" />
      if (metricId.includes("response")) return <Clock className="h-4 w-4" />
      if (metricId.includes("throughput")) return <Zap className="h-4 w-4" />
      if (metricId.includes("error")) return <AlertTriangle className="h-4 w-4" />
      return <Activity className="h-4 w-4" />
    }
    if (category === "database") {
      return <Database className="h-4 w-4" />
    }
    if (category === "business") {
      if (metricId.includes("revenue")) return <DollarSign className="h-4 w-4" />
      if (metricId.includes("promotion")) return <ShoppingCart className="h-4 w-4" />
      return <TrendingUp className="h-4 w-4" />
    }
    return <Activity className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
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
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-green-500" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Advanced Performance Monitor</span>
                {isMonitoring && <Badge className="bg-green-500 text-white">Live</Badge>}
              </CardTitle>
              <CardDescription>
                Real-time performance monitoring with intelligent alerting and analytics
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportMetrics}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isMonitoring ? "Stop" : "Start"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-refresh" />
              <Label htmlFor="auto-refresh" className="text-sm">
                Auto Refresh
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="refresh-interval" className="text-sm">
                Interval:
              </Label>
              <Input
                id="refresh-interval"
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-16 h-8"
                min="1"
                max="60"
              />
              <span className="text-sm text-muted-foreground">sec</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle
              className={`h-5 w-5 ${
                systemHealth.overall === "healthy"
                  ? "text-green-500"
                  : systemHealth.overall === "degraded"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            />
            <span>System Health</span>
            <Badge
              className={
                systemHealth.overall === "healthy"
                  ? "bg-green-500 text-white"
                  : systemHealth.overall === "degraded"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
              }
            >
              {systemHealth.overall.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Health Score</span>
                <span className="text-2xl font-bold">{systemHealth.score}%</span>
              </div>
              <Progress value={systemHealth.score} className="h-3" />
            </div>
          </div>

          {systemHealth.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Active Issues</h4>
              {systemHealth.issues.slice(0, 3).map((issue, index) => (
                <div key={index} className={`p-2 rounded text-xs border ${getSeverityColor(issue.severity)}`}>
                  {issue.message}
                </div>
              ))}
              {systemHealth.issues.length > 3 && (
                <p className="text-xs text-muted-foreground">+{systemHealth.issues.length - 3} more issues</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {alerts.filter((a) => !a.resolved).length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">{alerts.filter((a) => !a.resolved).length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMetrics.map((metric) => (
              <Card key={metric.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(metric.category, metric.id)}
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <Badge variant="outline" className="text-xs">
                        {metric.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Warning: {metric.threshold.warning}
                          {metric.unit}
                        </span>
                        <span>
                          Critical: {metric.threshold.critical}
                          {metric.unit}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          100,
                          (metric.value / Math.max(metric.threshold.warning, metric.threshold.critical)) * 100,
                        )}
                        className="h-2"
                      />
                    </div>

                    <div className={`text-xs px-2 py-1 rounded border ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Performance Alerts</span>
                <Badge variant="outline">{alerts.filter((a) => !a.resolved).length} Active</Badge>
              </CardTitle>
              <CardDescription>Real-time alerts based on performance thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>No alerts at this time</p>
                      <p className="text-sm">System is running smoothly</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 border rounded-lg ${alert.resolved ? "opacity-50" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                alert.severity === "critical"
                                  ? "text-red-500"
                                  : alert.severity === "high"
                                    ? "text-orange-500"
                                    : alert.severity === "medium"
                                      ? "text-yellow-500"
                                      : "text-blue-500"
                              }`}
                            />
                            <span className="font-medium">{alert.metadata?.metricName || alert.metric}</span>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            {alert.resolved && <Badge className="bg-green-500 text-white">Resolved</Badge>}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <p className="text-sm mb-2">
                          {alert.metadata?.description || `${alert.metric} exceeded threshold`}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <span>
                            Value:{" "}
                            <strong>
                              {alert.value}
                              {alert.metadata?.unit}
                            </strong>{" "}
                            | Threshold:{" "}
                            <strong>
                              {alert.threshold}
                              {alert.metadata?.unit}
                            </strong>
                          </span>
                          {!alert.resolved && (
                            <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* System Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Performance</CardTitle>
                <CardDescription>CPU and Memory usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={metrics.find((m) => m.id === "cpu_usage")?.history.slice(-20) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                      formatter={(value: any) => [`${value.toFixed(1)}%`, "CPU Usage"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Application Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Response Time Trend</CardTitle>
                <CardDescription>Average response time over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={metrics.find((m) => m.id === "response_time")?.history.slice(-20) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                      formatter={(value: any) => [`${value.toFixed(0)}ms`, "Response Time"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Business Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Business Metrics</CardTitle>
                <CardDescription>Revenue and user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics.find((m) => m.id === "revenue_per_minute")?.history.slice(-10) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                      formatter={(value: any) => [`$${value.toFixed(2)}`, "Revenue/Min"]}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Database Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Database Performance</CardTitle>
                <CardDescription>Query time and cache hit rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={metrics.find((m) => m.id === "db_query_time")?.history.slice(-20) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                      formatter={(value: any) => [`${value.toFixed(0)}ms`, "Query Time"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Alert Rules Configuration</span>
              </CardTitle>
              <CardDescription>Configure thresholds and conditions for performance alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) =>
                            setAlertRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled } : r)))
                          }
                        />
                        <span className="font-medium">{rule.description}</span>
                        <Badge className={getSeverityColor(rule.severity)}>{rule.severity}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Metric</p>
                        <p className="font-medium">{rule.metric}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Condition</p>
                        <p className="font-medium">
                          {rule.operator} {rule.threshold}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cooldown</p>
                        <p className="font-medium">{rule.cooldownMs / 1000}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Triggered</p>
                        <p className="font-medium">
                          {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleTimeString() : "Never"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Summary Report</CardTitle>
              <CardDescription>Comprehensive analysis of system performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{systemHealth.score}%</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.find((m) => m.id === "response_time")?.value || 0}ms
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.find((m) => m.id === "throughput")?.value || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Throughput (req/s)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{alerts.filter((a) => !a.resolved).length}</div>
                  <div className="text-sm text-muted-foreground">Active Alerts</div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="space-y-4">
                <h4 className="font-medium">Performance Analysis</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm text-green-600">Strengths</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Response times consistently under 500ms</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>High cache hit rate maintaining performance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Error rates well below acceptable thresholds</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Database connections efficiently managed</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-sm text-yellow-600">Areas for Improvement</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>Memory usage trending upward during peak hours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>CPU spikes during complex pricing calculations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>Network I/O could be optimized for bulk operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-medium">Recommendations</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Implement memory optimization for long-running pricing calculations</li>
                    <li>• Add more aggressive caching for frequently accessed product data</li>
                    <li>• Consider horizontal scaling for CPU-intensive operations</li>
                    <li>• Optimize database queries to reduce connection pool usage</li>
                    <li>• Implement request batching for bulk pricing operations</li>
                    <li>• Set up predictive scaling based on business hour patterns</li>
                  </ul>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="space-y-3">
                <h4 className="font-medium">Trend Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 border rounded">
                    <div className="font-medium text-green-600 mb-1">Improving</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Cache hit rate (+2.3%)</li>
                      <li>• Error rate (-0.4%)</li>
                      <li>• Revenue per minute (+15%)</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium text-blue-600 mb-1">Stable</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Response time (±5ms)</li>
                      <li>• Database connections</li>
                      <li>• Throughput consistency</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium text-yellow-600 mb-1">Monitoring</div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Memory usage (+3.2%)</li>
                      <li>• CPU during peaks</li>
                      <li>• Network I/O patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
