"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, BarChart3 } from "lucide-react"
import { apiGet, apiPost, FetchError } from "@/lib/utils/fetch"
import { toast } from "sonner"

interface PriceComparison {
  productId: string
  productName: string
  ourPrice: number
  competitors: Array<{
    name: string
    price: number
    market: string
  }>
  marketAverage: number
  pricePosition: "above_market" | "competitive" | "below_market"
  recommendedPrice: number
  potentialRevenue: number
  lastUpdated: string
}

interface OptimizationRecommendation {
  strategy: string
  suggestedPrice: number
  expectedVolumeChange: number
  expectedRevenueChange: number
  confidence: number
  reasoning: string
}

export function PriceComparisonDashboard() {
  const [comparisons, setComparisons] = useState<PriceComparison[]>([])
  const [selectedMarket, setSelectedMarket] = useState("Illinois")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [optimizationObjective, setOptimizationObjective] = useState("maximize_revenue")
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComparisons()
  }, [selectedMarket])

  const fetchComparisons = async () => {
    setLoading(true)
    try {
      console.log("[v0] PriceComparison: Fetching comparisons for market:", selectedMarket)
      const data = await apiGet<{ comparisons: PriceComparison[]; summary?: any }>(
        `/api/pricing/compare?market=${selectedMarket}`,
      )
      console.log("[v0] PriceComparison: Received data:", data)
      console.log("[v0] PriceComparison: Comparisons array:", data.comparisons)
      setComparisons(data.comparisons)
    } catch (error) {
      const message = error instanceof FetchError ? error.message : "Failed to fetch price comparisons"
      console.error("[v0] PriceComparison: Error fetching comparisons:", error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const generateOptimization = async () => {
    if (!selectedProduct) return

    setLoading(true)
    try {
      const data = await apiPost<{ recommendations: OptimizationRecommendation[] }>("/api/pricing/optimize", {
        productId: selectedProduct,
        market: selectedMarket,
        objective: optimizationObjective,
      })
      setRecommendations(data.recommendations)
      toast.success("Optimization recommendations generated")
    } catch (error) {
      const message = error instanceof FetchError ? error.message : "Failed to generate optimization"
      console.error("Failed to generate optimization:", error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getPricePositionIcon = (position: string) => {
    switch (position) {
      case "above_market":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "below_market":
        return <TrendingDown className="h-4 w-4 text-blue-500" />
      default:
        return <Minus className="h-4 w-4 text-green-500" />
    }
  }

  const getPricePositionColor = (position: string) => {
    switch (position) {
      case "above_market":
        return "destructive"
      case "below_market":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Price Comparison Engine</h3>
          <p className="text-muted-foreground">Competitive analysis and price optimization recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Illinois">Illinois</SelectItem>
              <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
              <SelectItem value="Massachusetts">Massachusetts</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchComparisons} disabled={loading}>
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList>
          <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="optimization">Price Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid gap-6">
            {comparisons.map((comparison) => (
              <Card key={comparison.productId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {comparison.productName}
                        {getPricePositionIcon(comparison.pricePosition)}
                      </CardTitle>
                      <CardDescription>
                        Last updated: {new Date(comparison.lastUpdated).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={getPricePositionColor(comparison.pricePosition)}>
                      {comparison.pricePosition.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Our Price</Label>
                      <div className="text-2xl font-bold">${comparison.ourPrice}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Market Average</Label>
                      <div className="text-2xl font-bold">${comparison.marketAverage}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Recommended</Label>
                      <div className="text-2xl font-bold text-green-600">${comparison.recommendedPrice}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Potential Revenue</Label>
                      <div className="text-2xl font-bold text-blue-600">${comparison.potentialRevenue}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Competitor Pricing</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {comparison.competitors.map((competitor, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm">{competitor.name}</span>
                          <span className="font-medium">${competitor.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Price Optimization
              </CardTitle>
              <CardDescription>Generate AI-powered pricing recommendations based on your objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {comparisons.map((comparison) => (
                        <SelectItem key={comparison.productId} value={comparison.productId}>
                          {comparison.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Optimization Objective</Label>
                  <Select value={optimizationObjective} onValueChange={setOptimizationObjective}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maximize_revenue">Maximize Revenue</SelectItem>
                      <SelectItem value="maximize_margin">Maximize Margin</SelectItem>
                      <SelectItem value="increase_volume">Increase Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={generateOptimization} disabled={loading || !selectedProduct}>
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>

          {recommendations.length > 0 && (
            <div className="grid gap-4">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {rec.strategy}
                      <Badge variant="outline">{Math.round(rec.confidence * 100)}% confidence</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <Label className="text-sm">Suggested Price</Label>
                        <div className="text-xl font-bold text-green-600">${rec.suggestedPrice}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">Volume Change</Label>
                        <div
                          className={`text-xl font-bold ${rec.expectedVolumeChange >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {rec.expectedVolumeChange >= 0 ? "+" : ""}
                          {rec.expectedVolumeChange}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">Revenue Change</Label>
                        <div
                          className={`text-xl font-bold ${rec.expectedRevenueChange >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {rec.expectedRevenueChange >= 0 ? "+" : ""}
                          {rec.expectedRevenueChange}%
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Analyzed</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{comparisons.length}</div>
                <p className="text-xs text-muted-foreground">Active price comparisons</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Optimization Opportunities</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {comparisons.filter((c) => c.recommendedPrice !== c.ourPrice).length}
                </div>
                <p className="text-xs text-muted-foreground">Products with pricing opportunities</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${comparisons.reduce((sum, c) => sum + c.potentialRevenue, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">From price optimization</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
