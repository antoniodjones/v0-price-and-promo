"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Zap,
  Clock,
  Database,
  Globe,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  threshold: number
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  history: Array<{ timestamp: number; value: number }>
}

interface TestResult {
  id: string
  name: string
  type: "load" | "stress" | "endurance" | "spike"
  status: "running" | "passed" | "failed" | "pending"
  duration: number
  startTime: number
  endTime?: number
  metrics: {
    responseTime: number
    throughput: number
    errorRate: number
    cpuUsage: number
    memoryUsage: number
  }
  details?: string
}

export function PerformanceMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: "Response Time",
      value: 245,
      unit: "ms",
      threshold: 500,
      status: "good",
      trend: "stable",
      history: [],
    },
    {
      name: "Throughput",
      value: 1250,
      unit: "req/s",
      threshold: 1000,
      status: "good",
      trend: "up",
      history: [],
    },
    {
      name: "Error Rate",
      value: 0.8,
      unit: "%",
      threshold: 5,
      status: "good",
      trend: "down",
      history: [],
    },
    {
      name: "CPU Usage",
      value: 45,
      unit: "%",
      threshold: 80,
      status: "good",
      trend: "stable",
      history: [],
    },
    {
      name: "Memory Usage",
      value: 62,
      unit: "%",
      threshold: 85,
      status: "good",
      trend: "up",
      history: [],
    },
    {
      name: "Database Connections",
      value: 15,
      unit: "active",
      threshold: 50,
      status: "good",
      trend: "stable",
      history: [],
    },
  ])

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: "1",
      name: "Pricing Engine Load Test",
      type: "load",
      status: "passed",
      duration: 300000,
      startTime: Date.now() - 600000,
      endTime: Date.now() - 300000,
      metrics: {
        responseTime: 234,
        throughput: 1200,
        errorRate: 0.5,
        cpuUsage: 65,
        memoryUsage: 58,
      },
    },
    {
      id: "2",
      name: "Discount Calculation Stress Test",
      type: "stress",
      status: "running",
      duration: 180000,
      startTime: Date.now() - 90000,
      metrics: {
        responseTime: 456,
        throughput: 800,
        errorRate: 2.1,
        cpuUsage: 78,
        memoryUsage: 72,
      },
    },
  ])

  const [chartData, setChartData] = useState([
    { time: "10:00", responseTime: 200, throughput: 1100, errorRate: 0.5 },
    { time: "10:05", responseTime: 220, throughput: 1150, errorRate: 0.7 },
    { time: "10:10", responseTime: 245, throughput: 1200, errorRate: 0.8 },
    { time: "10:15", responseTime: 230, throughput: 1250, errorRate: 0.6 },
    { time: "10:20", responseTime: 210, throughput: 1300, errorRate: 0.4 },
  ])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        // Simulate real-time metrics updates
        setMetrics((prev) =>
          prev.map((metric) => {
            const variation = (Math.random() - 0.5) * 0.1
            const newValue = Math.max(0, metric.value * (1 + variation))
            const newStatus =
              newValue > metric.threshold * 0.9 ? "critical" : newValue > metric.threshold * 0.7 ? "warning" : "good"

            return {
              ...metric,
              value: Number.parseFloat(newValue.toFixed(metric.unit === "%" ? 1 : 0)),
              status: newStatus,
              trend: newValue > metric.value ? "up" : newValue < metric.value ? "down" : "stable",
              history: [...metric.history.slice(-19), { timestamp: Date.now(), value: newValue }],
            }
          }),
        )

        // Update chart data
        setChartData((prev) => {
          const newTime = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })
          const newData = {
            time: newTime,
            responseTime: 200 + Math.random() * 100,
            throughput: 1000 + Math.random() * 500,
            errorRate: Math.random() * 2,
          }
          return [...prev.slice(-4), newData]
        })
      }, 5000)
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
  }, [isMonitoring])

  const runPerformanceTest = async (testType: "load" | "stress" | "endurance" | "spike") => {
    const testNames = {
      load: "Load Test - Normal Traffic",
      stress: "Stress Test - Peak Traffic",
      endurance: "Endurance Test - Extended Duration",
      spike: "Spike Test - Traffic Bursts",
    }

    const newTest: TestResult = {
      id: Date.now().toString(),
      name: testNames[testType],
      type: testType,
      status: "running",
      duration: testType === "endurance" ? 1800000 : 300000, // 30 min for endurance, 5 min for others
      startTime: Date.now(),
      metrics: {
        responseTime: 0,
        throughput: 0,
        errorRate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
      },
    }

    setTestResults((prev) => [newTest, ...prev])

    // Simulate test execution
    setTimeout(() => {
      setTestResults((prev) =>
        prev.map((test) =>
          test.id === newTest.id
            ? {
                ...test,
                status: Math.random() > 0.2 ? "passed" : "failed",
                endTime: Date.now(),
                metrics: {
                  responseTime: 200 + Math.random() * 300,
                  throughput: 800 + Math.random() * 600,
                  errorRate: Math.random() * 5,
                  cpuUsage: 40 + Math.random() * 40,
                  memoryUsage: 50 + Math.random() * 30,
                },
                details:
                  Math.random() > 0.2
                    ? "All performance thresholds met successfully"
                    : "Response time exceeded threshold during peak load",
              }
            : test,
        ),
      )
    }, 10000) // Complete after 10 seconds for demo
  }

  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "response time":
        return <Clock className="h-4 w-4" />
      case "throughput":
        return <Zap className="h-4 w-4" />
      case "error rate":
        return <AlertTriangle className="h-4 w-4" />
      case "cpu usage":
        return <Activity className="h-4 w-4" />
      case "memory usage":
        return <Database className="h-4 w-4" />
      case "database connections":
        return <Globe className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
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

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "running":
        return <Activity className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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
                <span>Performance Monitor</span>
                {isMonitoring && <Badge className="bg-green-500 text-white">Live</Badge>}
              </CardTitle>
              <CardDescription>Real-time performance monitoring and testing suite</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isMonitoring ? "Stop" : "Start"} Monitoring
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          <TabsTrigger value="tests">Performance Tests</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(metric.name)}
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
                    </div>
                    <Progress
                      value={(metric.value / metric.threshold) * 100}
                      className="h-2"
                      // @ts-ignore
                      indicatorClassName={
                        metric.status === "critical"
                          ? "bg-red-500"
                          : metric.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }
                    />
                    <div className={`text-xs px-2 py-1 rounded border ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()} • Threshold: {metric.threshold}
                      {metric.unit}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Button size="sm" onClick={() => runPerformanceTest("load")}>
              Run Load Test
            </Button>
            <Button size="sm" onClick={() => runPerformanceTest("stress")}>
              Run Stress Test
            </Button>
            <Button size="sm" onClick={() => runPerformanceTest("endurance")}>
              Run Endurance Test
            </Button>
            <Button size="sm" onClick={() => runPerformanceTest("spike")}>
              Run Spike Test
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Results</CardTitle>
              <CardDescription>Recent performance test executions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {testResults.map((test) => (
                    <div key={test.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTestStatusIcon(test.status)}
                          <span className="font-medium">{test.name}</span>
                          <Badge variant="outline">{test.type}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {test.endTime
                            ? `${Math.round((test.endTime - test.startTime) / 1000)}s`
                            : `${Math.round((Date.now() - test.startTime) / 1000)}s`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Response Time</p>
                          <p className="font-medium">{test.metrics.responseTime.toFixed(0)}ms</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Throughput</p>
                          <p className="font-medium">{test.metrics.throughput.toFixed(0)} req/s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Error Rate</p>
                          <p className="font-medium">{test.metrics.errorRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CPU Usage</p>
                          <p className="font-medium">{test.metrics.cpuUsage.toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Memory Usage</p>
                          <p className="font-medium">{test.metrics.memoryUsage.toFixed(0)}%</p>
                        </div>
                      </div>

                      {test.details && <p className="text-sm text-muted-foreground mt-2 italic">{test.details}</p>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Response Time Trend</CardTitle>
                <CardDescription>Average response time over time</CardDescription>
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
                      dataKey="responseTime"
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
                <CardTitle className="text-base">Throughput Analysis</CardTitle>
                <CardDescription>Requests per second over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="throughput" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Error Rate Monitoring</CardTitle>
              <CardDescription>Error percentage over time</CardDescription>
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
                    dataKey="errorRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Summary</CardTitle>
              <CardDescription>Overall system performance analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">245ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,250</div>
                  <div className="text-sm text-muted-foreground">Peak Throughput</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Key Findings</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>All response time thresholds are being met consistently</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>System handles peak loads without degradation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Memory usage trending upward during extended operations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Error rates remain well below acceptable thresholds</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Recommendations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Consider implementing memory optimization for long-running processes</li>
                  <li>• Add more aggressive caching for frequently accessed pricing data</li>
                  <li>• Monitor database connection pooling during peak usage</li>
                  <li>• Schedule regular endurance tests to validate system stability</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
