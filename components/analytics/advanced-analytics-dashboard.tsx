"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, Target, Brain, DollarSign, BarChart3, Activity } from "lucide-react"

interface RevenueOptimization {
  summary: {
    totalRevenue: number
    optimizedRevenue: number
    potentialIncrease: number
    optimizationRate: number
  }
  opportunities: Array<{
    id: string
    type: string
    product: string
    expectedRevenueIncrease: number
    confidence: number
    market: string
    reasoning: string
  }>
  trends: Array<{
    month: string
    revenue: number
    optimized: number
    savings: number
  }>
}

interface PredictiveData {
  demandForecast?: {
    nextMonth: {
      totalDemand: number
      confidence: number
      trend: string
    }
    byProduct: Array<{
      productName: string
      currentDemand: number
      forecastedDemand: number
      confidence: number
      priceElasticity: number
    }>
  }
  priceSensitivity?: {
    overall: {
      elasticity: number
      sensitivity: string
      optimalPriceIncrease: number
    }
    bySegment: Array<{
      segment: string
      elasticity: number
      sensitivity: string
      volumeShare: number
      revenueShare: number
    }>
  }
}

export function AdvancedAnalyticsDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueOptimization | null>(null)
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(null)
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [timeframe, setTimeframe] = useState("6months")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedMarket, timeframe])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const [revenueResponse, predictiveResponse] = await Promise.all([
        fetch(`/api/analytics/revenue-optimization?market=${selectedMarket}&timeframe=${timeframe}`),
        fetch(`/api/analytics/predictive?market=${selectedMarket}`),
      ])

      const revenueResult = await revenueResponse.json()
      const predictiveResult = await predictiveResponse.json()

      if (revenueResult.success) setRevenueData(revenueResult.data)
      if (predictiveResult.success) setPredictiveData(predictiveResult.data)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.8) return "text-blue-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Advanced Analytics Dashboard</h3>
          <p className="text-muted-foreground">AI-powered insights for revenue optimization and predictive analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="Illinois">Illinois</SelectItem>
              <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
              <SelectItem value="Massachusetts">Massachusetts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue-optimization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue-optimization">Revenue Optimization</TabsTrigger>
          <TabsTrigger value="predictive-analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="market-intelligence">Market Intelligence</TabsTrigger>
          <TabsTrigger value="scenario-planning">Scenario Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue-optimization" className="space-y-6">
          {revenueData && (
            <>
              {/* Revenue Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revenueData.summary.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">Monthly total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Optimized Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(revenueData.summary.optimizedRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">Potential with optimization</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potential Increase</CardTitle>
                    <Target className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(revenueData.summary.potentialIncrease)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{revenueData.summary.optimizationRate.toFixed(1)}% improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
                    <Activity className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{revenueData.opportunities.length}</div>
                    <p className="text-xs text-muted-foreground">Active optimization opportunities</p>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Optimization Trends</CardTitle>
                  <CardDescription>Current vs optimized revenue potential over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData.trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stackId="1"
                          stroke="#6B7280"
                          fill="#6B7280"
                          fillOpacity={0.6}
                          name="Current Revenue"
                        />
                        <Area
                          type="monotone"
                          dataKey="optimized"
                          stackId="2"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.8}
                          name="Optimized Revenue"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Revenue Opportunities</CardTitle>
                  <CardDescription>AI-identified opportunities for revenue optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{opportunity.product}</h4>
                            <Badge variant="outline">{opportunity.market}</Badge>
                            <Badge variant="secondary">{opportunity.type.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{opportunity.reasoning}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600 font-medium">
                              {formatCurrency(opportunity.expectedRevenueIncrease)} potential
                            </span>
                            <span className={`font-medium ${getConfidenceColor(opportunity.confidence)}`}>
                              {Math.round(opportunity.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <Button size="sm">Apply</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="predictive-analytics" className="space-y-6">
          {predictiveData && (
            <>
              {/* Demand Forecast */}
              {predictiveData.demandForecast && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Demand Forecast
                      </CardTitle>
                      <CardDescription>AI-powered demand predictions for next month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Forecasted Demand</span>
                          <span className="text-2xl font-bold">
                            {predictiveData.demandForecast.nextMonth.totalDemand.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Confidence Level</span>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={predictiveData.demandForecast.nextMonth.confidence * 100}
                              className="w-20"
                            />
                            <span className="text-sm font-medium">
                              {Math.round(predictiveData.demandForecast.nextMonth.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Trend Direction</span>
                          <Badge
                            variant={
                              predictiveData.demandForecast.nextMonth.trend === "increasing" ? "default" : "secondary"
                            }
                          >
                            {predictiveData.demandForecast.nextMonth.trend}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Demand Forecast</CardTitle>
                      <CardDescription>Individual product demand predictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {predictiveData.demandForecast.byProduct.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                            <div>
                              <div className="font-medium text-sm">{product.productName}</div>
                              <div className="text-xs text-muted-foreground">Elasticity: {product.priceElasticity}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {product.forecastedDemand}
                                <span className="text-xs text-muted-foreground ml-1">({product.currentDemand})</span>
                              </div>
                              <div className="text-xs text-green-600">
                                {Math.round(product.confidence * 100)}% confidence
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Price Sensitivity Analysis */}
              {predictiveData.priceSensitivity && (
                <Card>
                  <CardHeader>
                    <CardTitle>Price Sensitivity Analysis</CardTitle>
                    <CardDescription>Customer response to price changes by segment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Overall Market Sensitivity</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Price Elasticity</span>
                            <span className="font-medium">{predictiveData.priceSensitivity.overall.elasticity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Sensitivity Level</span>
                            <Badge variant="outline">{predictiveData.priceSensitivity.overall.sensitivity}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Optimal Price Increase</span>
                            <span className="font-medium text-green-600">
                              +{(predictiveData.priceSensitivity.overall.optimalPriceIncrease * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Segment Analysis</h4>
                        <div className="space-y-2">
                          {predictiveData.priceSensitivity.bySegment.map((segment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <div className="text-sm font-medium">{segment.segment}</div>
                                <div className="text-xs text-muted-foreground">
                                  {Math.round(segment.volumeShare * 100)}% volume,{" "}
                                  {Math.round(segment.revenueShare * 100)}% revenue
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    segment.sensitivity === "low"
                                      ? "default"
                                      : segment.sensitivity === "moderate"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {segment.sensitivity}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="market-intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Intelligence
              </CardTitle>
              <CardDescription>Real-time market trends and competitive insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Market intelligence features coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenario-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Scenario Planning
              </CardTitle>
              <CardDescription>Model different pricing scenarios and their impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">Scenario planning tools coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
