"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import { Users, TrendingUp, Award, AlertTriangle } from "lucide-react"

interface CustomerInsightsProps {
  selectedMarket: string
  dateRange: { from: Date; to: Date }
}

export function CustomerInsights({ selectedMarket, dateRange }: CustomerInsightsProps) {
  const customerSegments = [
    {
      segment: "A-Tier Premium",
      customers: 45,
      avgOrderValue: "$2,850",
      avgDiscount: "6.8%",
      totalRevenue: "$1.28M",
      discountUtilization: 92,
      loyaltyScore: 95,
    },
    {
      segment: "B-Tier Standard",
      customers: 128,
      avgOrderValue: "$1,650",
      avgDiscount: "4.2%",
      totalRevenue: "$2.11M",
      discountUtilization: 78,
      loyaltyScore: 82,
    },
    {
      segment: "C-Tier Basic",
      customers: 89,
      avgOrderValue: "$890",
      avgDiscount: "2.8%",
      totalRevenue: "$792K",
      discountUtilization: 65,
      loyaltyScore: 71,
    },
  ]

  const topCustomers = [
    {
      business_legal_name: "Elite Cannabis Co",
      tier: "A-Tier",
      totalOrders: 156,
      totalSpent: "$445K",
      avgDiscount: "7.2%",
      discountSavings: "$32K",
      lastOrder: "2 days ago",
      status: "Active",
    },
    {
      business_legal_name: "Premium Dispensary LLC",
      tier: "A-Tier",
      totalOrders: 142,
      totalSpent: "$398K",
      avgDiscount: "6.8%",
      discountSavings: "$27K",
      lastOrder: "1 day ago",
      status: "Active",
    },
    {
      business_legal_name: "High Volume Buyer",
      tier: "B-Tier",
      totalOrders: 98,
      totalSpent: "$162K",
      avgDiscount: "4.5%",
      discountSavings: "$7.3K",
      lastOrder: "5 days ago",
      status: "Active",
    },
    {
      business_legal_name: "Dispensary ABC",
      tier: "B-Tier",
      totalOrders: 87,
      totalSpent: "$143K",
      avgDiscount: "4.1%",
      discountSavings: "$5.9K",
      lastOrder: "3 days ago",
      status: "Active",
    },
  ]

  const discountUtilizationData = [
    { month: "Jan", aTier: 88, bTier: 72, cTier: 58 },
    { month: "Feb", aTier: 91, bTier: 75, cTier: 62 },
    { month: "Mar", aTier: 89, bTier: 78, cTier: 65 },
    { month: "Apr", aTier: 93, bTier: 79, cTier: 67 },
    { month: "May", aTier: 92, bTier: 78, cTier: 65 },
    { month: "Jun", aTier: 92, bTier: 78, cTier: 65 },
  ]

  const customerValueData = customerSegments.map((segment) => ({
    segment: segment.segment,
    customers: segment.customers,
    revenue:
      Number.parseFloat(segment.totalRevenue.replace(/[$MK,]/g, "")) * (segment.totalRevenue.includes("M") ? 1000 : 1),
    avgDiscount: Number.parseFloat(segment.avgDiscount.replace("%", "")),
  }))

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "A-Tier":
        return <Badge className="bg-green-100 text-green-800">A-Tier</Badge>
      case "B-Tier":
        return <Badge className="bg-blue-100 text-blue-800">B-Tier</Badge>
      case "C-Tier":
        return <Badge className="bg-purple-100 text-purple-800">C-Tier</Badge>
      default:
        return <Badge variant="outline">{tier}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Customer Segment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerSegments.map((segment) => (
          <Card key={segment.segment}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {segment.segment}
                <Users className="h-5 w-5 text-gti-green" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Customers</div>
                  <div className="font-medium text-lg">{segment.customers}</div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Order</div>
                  <div className="font-medium text-lg">{segment.avgOrderValue}</div>
                </div>
                <div>
                  <div className="text-gray-600">Total Revenue</div>
                  <div className="font-medium text-lg text-gti-green">{segment.totalRevenue}</div>
                </div>
                <div>
                  <div className="text-gray-600">Avg Discount</div>
                  <div className="font-medium text-lg">{segment.avgDiscount}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount Utilization</span>
                  <span className="font-medium">{segment.discountUtilization}%</span>
                </div>
                <Progress value={segment.discountUtilization} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loyalty Score</span>
                  <span className="font-medium">{segment.loyaltyScore}/100</span>
                </div>
                <Progress value={segment.loyaltyScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Discount Utilization Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Utilization by Customer Tier</CardTitle>
          <CardDescription>Monthly discount usage rates across customer segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={discountUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Utilization Rate"]} />
                <Bar dataKey="aTier" fill="#10B981" name="A-Tier" />
                <Bar dataKey="bTier" fill="#3B82F6" name="B-Tier" />
                <Bar dataKey="cTier" fill="#8B5CF6" name="C-Tier" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Customers</CardTitle>
          <CardDescription>Highest value customers and their discount utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Business Name</th>
                  <th className="text-left p-3 font-medium text-gray-600">Tier</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total Orders</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total Spent</th>
                  <th className="text-left p-3 font-medium text-gray-600">Avg Discount</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total Savings</th>
                  <th className="text-left p-3 font-medium text-gray-600">Last Order</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{customer.business_legal_name}</div>
                    </td>
                    <td className="p-3">{getTierBadge(customer.tier)}</td>
                    <td className="p-3 text-gray-600">{customer.totalOrders}</td>
                    <td className="p-3 font-medium text-gti-green">{customer.totalSpent}</td>
                    <td className="p-3 text-gray-600">{customer.avgDiscount}</td>
                    <td className="p-3 font-medium text-blue-600">{customer.discountSavings}</td>
                    <td className="p-3 text-gray-600">{customer.lastOrder}</td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800">{customer.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Value Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Value Distribution</CardTitle>
            <CardDescription>Revenue contribution by customer segment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={customerValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="customers" name="Customers" />
                  <YAxis dataKey="revenue" name="Revenue" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `$${value}K` : value,
                      name === "revenue" ? "Revenue" : "Customers",
                    ]}
                  />
                  <Scatter dataKey="revenue" fill="#10B981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Insights & Recommendations</CardTitle>
            <CardDescription>Key findings and action items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">High Performer</h4>
                    <p className="text-sm text-green-700 mt-1">
                      A-Tier customers show 92% discount utilization with strong loyalty scores
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Growth Opportunity</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      B-Tier customers have potential for tier upgrade with targeted incentives
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Attention Needed</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      C-Tier customers show lower engagement - consider retention strategies
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create tier upgrade incentives for B-Tier customers</li>
                  <li>• Implement retention campaigns for C-Tier segment</li>
                  <li>• Expand A-Tier benefits to maintain loyalty</li>
                  <li>• Review discount thresholds for optimal utilization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
