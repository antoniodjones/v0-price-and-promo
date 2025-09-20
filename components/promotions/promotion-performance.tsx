"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from "lucide-react"

const performanceData = [
  { name: "Week 1", conversions: 45, revenue: 2340, orders: 156 },
  { name: "Week 2", conversions: 67, revenue: 3120, orders: 189 },
  { name: "Week 3", conversions: 89, revenue: 4560, orders: 234 },
  { name: "Week 4", conversions: 123, revenue: 6780, orders: 298 },
]

const campaignBreakdown = [
  { name: "Premium Gummies BOGO", value: 45, color: "#22c55e" },
  { name: "Incredibles Brand BOGO", value: 30, color: "#3b82f6" },
  { name: "Edibles Category BOGO", value: 25, color: "#f59e0b" },
]

const topPerformers = [
  {
    campaign: "Premium Gummies BOGO November",
    conversions: 156,
    revenue: 4680,
    roi: 234,
    trend: "up",
  },
  {
    campaign: "Incredibles Brand BOGO",
    conversions: 89,
    revenue: 2670,
    roi: 189,
    trend: "up",
  },
  {
    campaign: "Edibles Category BOGO",
    conversions: 234,
    revenue: 7020,
    roi: 156,
    trend: "down",
  },
]

export function PromotionPerformance() {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">479</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BOGO Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">$16,800</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +24.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Users className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">$342</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.3% with BOGO
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Savings</CardTitle>
            <Calendar className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">$24,580</div>
            <div className="flex items-center text-xs text-muted-foreground">Total customer savings this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Campaign Breakdown</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>BOGO Performance Over Time</CardTitle>
              <CardDescription>Weekly conversion and revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="conversions" fill="#22c55e" name="Conversions" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Distribution</CardTitle>
                <CardDescription>Conversion share by campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={campaignBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {campaignBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Conversions by campaign type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={campaignBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Ranked by ROI and conversion performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gti-bright-green rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{campaign.campaign}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.conversions} conversions • ${campaign.revenue.toLocaleString()} revenue
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{campaign.roi}% ROI</p>
                        <div
                          className={`flex items-center text-xs ${
                            campaign.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {campaign.trend === "up" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {campaign.trend === "up" ? "Trending up" : "Trending down"}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
