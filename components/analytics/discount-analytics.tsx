"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface DiscountAnalyticsProps {
  selectedMarket: string
  dateRange: { from: Date; to: Date }
}

export function DiscountAnalytics({ selectedMarket, dateRange }: DiscountAnalyticsProps) {
  const discountByType = [
    { name: "Customer Discounts", value: 45, amount: "$1.08M", color: "#10B981" },
    { name: "Volume Pricing", value: 28, amount: "$672K", color: "#3B82F6" },
    { name: "Expiration Discounts", value: 18, amount: "$432K", color: "#F59E0B" },
    { name: "THC Discounts", value: 9, amount: "$216K", color: "#8B5CF6" },
  ]

  const discountByCategory = [
    { category: "Flower", automated: 65, manual: 35, total: "$890K" },
    { category: "Edibles", automated: 42, manual: 58, total: "$520K" },
    { category: "Concentrates", automated: 78, manual: 22, total: "$680K" },
    { category: "Vapes", automated: 55, manual: 45, total: "$310K" },
  ]

  const topPerformingRules = [
    {
      name: "Massachusetts Volume Tier A",
      type: "Volume Pricing",
      discountGiven: "$245K",
      ordersAffected: 1247,
      avgDiscount: "5.8%",
      performance: "Excellent",
    },
    {
      name: "Incredibles Brand Customer Discount",
      type: "Customer Discount",
      discountGiven: "$189K",
      ordersAffected: 892,
      avgDiscount: "4.2%",
      performance: "Good",
    },
    {
      name: "30-Day Expiration Auto Discount",
      type: "Automated",
      discountGiven: "$156K",
      ordersAffected: 634,
      avgDiscount: "18.5%",
      performance: "High Impact",
    },
    {
      name: "Low THC Flower Discount",
      type: "Automated",
      discountGiven: "$98K",
      ordersAffected: 445,
      avgDiscount: "12.3%",
      performance: "Effective",
    },
  ]

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "Good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "High Impact":
        return <Badge className="bg-purple-100 text-purple-800">High Impact</Badge>
      case "Effective":
        return <Badge className="bg-amber-100 text-amber-800">Effective</Badge>
      default:
        return <Badge variant="outline">{performance}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Discount Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Discount Distribution by Type</CardTitle>
            <CardDescription>Breakdown of discount types and their impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={discountByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {discountByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {discountByType.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-ada-secondary">{item.name}</span>
                  </div>
                  <div className="text-sm font-medium">{item.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automated vs Manual Discounts</CardTitle>
            <CardDescription>Breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discountByCategory.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.total}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={category.automated} className="h-2" />
                    </div>
                    <span className="text-xs text-ada-secondary w-16">{category.automated}% auto</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gti-green/5 rounded-lg">
              <p className="text-sm text-gti-green font-medium">Average automation rate: 60% - Target: 70%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Discount Rules</CardTitle>
          <CardDescription>Rules with highest impact on sales and customer satisfaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-ada-secondary">Rule Name</th>
                  <th className="text-left p-3 font-medium text-ada-secondary">Type</th>
                  <th className="text-left p-3 font-medium text-ada-secondary">Total Discount</th>
                  <th className="text-left p-3 font-medium text-ada-secondary">Orders Affected</th>
                  <th className="text-left p-3 font-medium text-ada-secondary">Avg Discount</th>
                  <th className="text-left p-3 font-medium text-ada-secondary">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingRules.map((rule, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{rule.name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{rule.type}</Badge>
                    </td>
                    <td className="p-3 font-medium text-gti-green">{rule.discountGiven}</td>
                    <td className="p-3 text-ada-secondary">{rule.ordersAffected.toLocaleString()}</td>
                    <td className="p-3 text-ada-secondary">{rule.avgDiscount}</td>
                    <td className="p-3">{getPerformanceBadge(rule.performance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Discount Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Discount Trends</CardTitle>
          <CardDescription>Discount amounts and order volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: "Jan", discounts: 180000, orders: 1200 },
                  { month: "Feb", discounts: 195000, orders: 1350 },
                  { month: "Mar", discounts: 210000, orders: 1420 },
                  { month: "Apr", discounts: 225000, orders: 1580 },
                  { month: "May", discounts: 240000, orders: 1650 },
                  { month: "Jun", discounts: 235000, orders: 1590 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "discounts" ? `$${(value as number).toLocaleString()}` : value,
                    name === "discounts" ? "Total Discounts" : "Orders",
                  ]}
                />
                <Bar dataKey="discounts" fill="#10B981" name="discounts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
