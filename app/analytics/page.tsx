"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, TrendingUp, DollarSign, Users, Package, AlertCircle } from "lucide-react"
import { DiscountAnalytics } from "@/components/analytics/discount-analytics"
import { RebateReports } from "@/components/analytics/rebate-reports"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { CustomerInsights } from "@/components/analytics/customer-insights"
import { AdvancedAnalyticsDashboard } from "@/components/analytics/advanced-analytics-dashboard"
import type { DateRange } from "react-day-picker"
import { DocumentationLink } from "@/components/shared/documentation-link"

export default function AnalyticsPage() {
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })

  const overviewStats = [
    {
      title: "Total Discounts Applied",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Last 30 days",
    },
    {
      title: "Active Discount Rules",
      value: "47",
      change: "+3",
      trend: "up",
      icon: Package,
      description: "Across all markets",
    },
    {
      title: "Customers with Discounts",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "Active customers",
    },
    {
      title: "Avg Discount Rate",
      value: "6.8%",
      change: "-0.3%",
      trend: "down",
      icon: TrendingUp,
      description: "Weighted average",
    },
  ]

  const alerts = [
    {
      type: "warning",
      title: "High Discount Usage",
      message: "Incredibles brand discounts are 23% above target this month",
      action: "Review pricing strategy",
    },
    {
      type: "info",
      title: "Expiration Discounts Active",
      message: "15 batches currently have automated expiration discounts applied",
      action: "Monitor inventory levels",
    },
    {
      type: "success",
      title: "Volume Pricing Performance",
      message: "Massachusetts volume pricing increased sales by 18% this quarter",
      action: "Consider expanding to other markets",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Analytics & Reporting</h2>
          <p className="text-muted-foreground mt-2">Pricing performance insights and discount analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <DocumentationLink pageId="analytics" />
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select market..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="massachusetts">Massachusetts</SelectItem>
              <SelectItem value="ohio">Ohio</SelectItem>
              <SelectItem value="illinois">Illinois</SelectItem>
              <SelectItem value="pennsylvania">Pennsylvania</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <Button className="bg-gti-green hover:bg-gti-green/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium ${
                    stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-gray-600">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Pricing Alerts
          </CardTitle>
          <CardDescription>Important notifications about pricing performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === "warning"
                    ? "bg-amber-50 border-amber-400"
                    : alert.type === "success"
                      ? "bg-green-50 border-green-400"
                      : "bg-blue-50 border-blue-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="advanced" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="discount-analysis">Discount Analysis</TabsTrigger>
          <TabsTrigger value="rebate-reports">Rebate Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="customer-insights">Customer Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="discount-analysis" className="space-y-4">
          <DiscountAnalytics selectedMarket={selectedMarket} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="rebate-reports" className="space-y-4">
          <RebateReports selectedMarket={selectedMarket} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics selectedMarket={selectedMarket} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="customer-insights" className="space-y-4">
          <CustomerInsights selectedMarket={selectedMarket} dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
