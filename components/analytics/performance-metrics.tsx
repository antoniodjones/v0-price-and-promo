"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Target, Zap } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface PerformanceMetricsProps {
  selectedMarket: string
  dateRange: DateRange | undefined
}

export function PerformanceMetrics({ selectedMarket, dateRange }: PerformanceMetricsProps) {
  const performanceData = [
    { month: "Jan", responseTime: 145, accuracy: 99.8, throughput: 1200, errors: 2 },
    { month: "Feb", responseTime: 152, accuracy: 99.9, throughput: 1350, errors: 1 },
    { month: "Mar", responseTime: 138, accuracy: 99.7, throughput: 1420, errors: 4 },
    { month: "Apr", responseTime: 142, accuracy: 99.9, throughput: 1580, errors: 1 },
    { month: "May", responseTime: 135, accuracy: 99.8, throughput: 1650, errors: 3 },
    { month: "Jun", responseTime: 128, accuracy: 99.9, throughput: 1590, errors: 1 },
  ]

  const systemMetrics = [
    {
      title: "Avg Response Time",
      value: "142ms",
      target: "<200ms",
      status: "excellent",
      trend: "-8ms",
      icon: Zap,
    },
    {
      title: "Pricing Accuracy",
      value: "99.8%",
      target: ">99.5%",
      status: "excellent",
      trend: "+0.1%",
      icon: Target,
    },
    {
      title: "Daily Throughput",
      value: "1,590",
      target: ">1,000",
      status: "good",
      trend: "+12%",
      icon: TrendingUp,
    },
    {
      title: "Error Rate",
      value: "0.06%",
      target: "<0.1%",
      status: "excellent",
      trend: "-0.02%",
      icon: TrendingDown,
    },
  ]

  const rulePerformance = [
    {
      rule: "Customer Discount Rules",
      totalRules: 47,
      activeRules: 45,
      avgProcessingTime: "12ms",
      successRate: "99.9%",
      status: "optimal",
    },
    {
      rule: "Volume Pricing Rules",
      totalRules: 23,
      activeRules: 23,
      avgProcessingTime: "18ms",
      successRate: "99.8%",
      status: "optimal",
    },
    {
      rule: "Automated Inventory Rules",
      totalRules: 15,
      activeRules: 12,
      avgProcessingTime: "25ms",
      successRate: "99.7%",
      status: "good",
    },
    {
      rule: "BOGO Promotions",
      totalRules: 8,
      activeRules: 6,
      avgProcessingTime: "35ms",
      successRate: "99.5%",
      status: "good",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "optimal":
        return <Badge className="bg-green-100 text-green-800">Optimal</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* System Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-gti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Target: {metric.target}</span>
                {getStatusBadge(metric.status)}
              </div>
              <div className="text-xs text-green-600 mt-1">{metric.trend} from last month</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
            <CardDescription>API response times over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}ms`, "Response Time"]} />
                  <Line type="monotone" dataKey="responseTime" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput & Accuracy</CardTitle>
            <CardDescription>Daily processing volume and accuracy rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "throughput" ? `${value} requests` : `${value}%`,
                      name === "throughput" ? "Daily Throughput" : "Accuracy",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="throughput"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rule Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Rule Performance</CardTitle>
          <CardDescription>Performance metrics for different types of pricing rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Rule Type</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total Rules</th>
                  <th className="text-left p-3 font-medium text-gray-600">Active Rules</th>
                  <th className="text-left p-3 font-medium text-gray-600">Avg Processing Time</th>
                  <th className="text-left p-3 font-medium text-gray-600">Success Rate</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {rulePerformance.map((rule, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{rule.rule}</div>
                    </td>
                    <td className="p-3 text-gray-600">{rule.totalRules}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gti-green">{rule.activeRules}</span>
                        <Progress value={(rule.activeRules / rule.totalRules) * 100} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{rule.avgProcessingTime}</td>
                    <td className="p-3 font-medium text-green-600">{rule.successRate}</td>
                    <td className="p-3">{getStatusBadge(rule.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Monitoring</CardTitle>
          <CardDescription>System health and optimization recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Current Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">All systems operational</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Cache hit rate: 94.2%</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Optimal</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">3 inactive rules detected</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Review</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Optimization Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">Rule Consolidation</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Consider merging similar customer discount rules to improve performance
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">Cache Optimization</div>
                  <div className="text-xs text-gray-600 mt-1">Increase cache TTL for volume pricing calculations</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">Database Indexing</div>
                  <div className="text-xs text-gray-600 mt-1">Add composite index for batch-level queries</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
