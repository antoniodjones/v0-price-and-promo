"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Package,
  Users,
  Zap,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { SimulationResults } from "@/components/simulator/simulation-results"
import { SimulationChart } from "@/components/simulator/simulation-chart"
import { ScenarioComparison } from "@/components/simulator/scenario-comparison"
import { PricingSimulator } from "@/components/pricing-simulator/pricing-simulator"

interface SimulationScenario {
  id: string
  name: string
  promoType: "percentage" | "dollar" | "bogo" | "bundle"
  discountValue: number
  targetProducts: number
  estimatedReach: number
  results?: SimulationResult
}

interface SimulationResult {
  revenue: number
  revenueChange: number
  margin: number
  marginChange: number
  unitsSold: number
  unitsSoldChange: number
  avgOrderValue: number
  conversionRate: number
  totalDiscount: number
  profitImpact: number
}

export default function SimulatorPage() {
  const [promoType, setPromoType] = useState<"percentage" | "dollar" | "bogo" | "bundle">("percentage")
  const [discountValue, setDiscountValue] = useState([15])
  const [targetScope, setTargetScope] = useState<"item" | "brand" | "category">("item")
  const [estimatedReach, setEstimatedReach] = useState([100])
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([])
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const runSimulation = async () => {
    setIsSimulating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock simulation results
    const baseRevenue = 50000
    const baseMargin = 35
    const baseUnits = 250

    const discountImpact = promoType === "percentage" ? discountValue[0] / 100 : discountValue[0] / 100
    const revenueMultiplier = 1 + discountImpact * 2.5
    const marginImpact = promoType === "percentage" ? discountValue[0] * 0.4 : (discountValue[0] / 100) * 15

    const results: SimulationResult = {
      revenue: baseRevenue * revenueMultiplier,
      revenueChange: (revenueMultiplier - 1) * 100,
      margin: baseMargin - marginImpact,
      marginChange: -marginImpact,
      unitsSold: Math.round(baseUnits * revenueMultiplier),
      unitsSoldChange: (revenueMultiplier - 1) * 100,
      avgOrderValue: (baseRevenue * revenueMultiplier) / (baseUnits * revenueMultiplier),
      conversionRate: 22.5 + discountImpact * 10,
      totalDiscount: baseRevenue * revenueMultiplier * (discountImpact / 2),
      profitImpact:
        (baseRevenue * revenueMultiplier * (baseMargin - marginImpact)) / 100 - (baseRevenue * baseMargin) / 100,
    }

    const newScenario: SimulationScenario = {
      id: Date.now().toString(),
      name: `${promoType === "percentage" ? discountValue[0] + "%" : "$" + discountValue[0]} ${promoType} - ${targetScope}`,
      promoType,
      discountValue: discountValue[0],
      targetProducts: estimatedReach[0],
      estimatedReach: estimatedReach[0],
      results,
    }

    setActiveScenario(newScenario)
    setScenarios((prev) => [newScenario, ...prev].slice(0, 5))
    setIsSimulating(false)
  }

  const clearSimulation = () => {
    setActiveScenario(null)
    setScenarios([])
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">Pricing & Promo Simulator</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Test promotional scenarios, validate pricing calculations, and visualize their impact on revenue, margins,
              and customer behavior
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              <Zap className="mr-1 h-3 w-3" />
              Real-time Analysis
            </Badge>
          </div>
        </div>

        {/* Tabs to switch between promo simulator and pricing calculator */}
        <Tabs defaultValue="promo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="promo">Promotional Scenarios</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="promo" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Configuration Panel */}
              <Card className="lg:col-span-1 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-chart-1" />
                    Configure Scenario
                  </CardTitle>
                  <CardDescription>Set up your promotional parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Promotion Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Promotion Type</Label>
                    <Select value={promoType} onValueChange={(value: any) => setPromoType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">💰 Percentage Discount</SelectItem>
                        <SelectItem value="dollar">💵 Dollar Discount</SelectItem>
                        <SelectItem value="bogo">🎁 BOGO Deal</SelectItem>
                        <SelectItem value="bundle">📦 Bundle Deal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Discount Value */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {promoType === "percentage" ? "Discount Percentage" : "Discount Amount"}
                      </Label>
                      <span className="text-2xl font-bold text-chart-1">
                        {promoType === "percentage" ? `${discountValue[0]}%` : `$${discountValue[0]}`}
                      </span>
                    </div>
                    <Slider
                      value={discountValue}
                      onValueChange={setDiscountValue}
                      min={promoType === "percentage" ? 5 : 5}
                      max={promoType === "percentage" ? 50 : 100}
                      step={promoType === "percentage" ? 5 : 5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{promoType === "percentage" ? "5%" : "$5"}</span>
                      <span>{promoType === "percentage" ? "50%" : "$100"}</span>
                    </div>
                  </div>

                  {/* Target Scope */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Target Scope</Label>
                    <Select value={targetScope} onValueChange={(value: any) => setTargetScope(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Specific Items
                          </div>
                        </SelectItem>
                        <SelectItem value="brand">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Entire Brand
                          </div>
                        </SelectItem>
                        <SelectItem value="category">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Product Category
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estimated Reach */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Estimated Product Reach</Label>
                      <span className="text-lg font-semibold text-chart-2">{estimatedReach[0]} products</span>
                    </div>
                    <Slider
                      value={estimatedReach}
                      onValueChange={setEstimatedReach}
                      min={10}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10</span>
                      <span>500</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button onClick={runSimulation} disabled={isSimulating} className="w-full" size="lg">
                      {isSimulating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Simulating...
                        </>
                      ) : (
                        <>
                          <Calculator className="mr-2 h-4 w-4" />
                          Run Simulation
                        </>
                      )}
                    </Button>
                    {scenarios.length > 0 && (
                      <Button onClick={clearSimulation} variant="outline" className="w-full bg-transparent">
                        Clear All Scenarios
                      </Button>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-chart-3 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">Simulation Notes</p>
                        <p>Results are based on historical data and predictive models. Actual performance may vary.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-6">
                {activeScenario && activeScenario.results ? (
                  <>
                    {/* Key Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Projected Revenue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${activeScenario.results.revenue.toLocaleString()}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {activeScenario.results.revenueChange > 0 ? (
                              <TrendingUp className="h-4 w-4 text-chart-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                activeScenario.results.revenueChange > 0 ? "text-chart-4" : "text-destructive"
                              }`}
                            >
                              {activeScenario.results.revenueChange > 0 ? "+" : ""}
                              {activeScenario.results.revenueChange.toFixed(1)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Margin Impact
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{activeScenario.results.margin.toFixed(1)}%</div>
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingDown className="h-4 w-4 text-chart-3" />
                            <span className="text-sm font-medium text-chart-3">
                              {activeScenario.results.marginChange.toFixed(1)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Units Sold
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{activeScenario.results.unitsSold.toLocaleString()}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="h-4 w-4 text-chart-4" />
                            <span className="text-sm font-medium text-chart-4">
                              +{activeScenario.results.unitsSoldChange.toFixed(1)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Conversion Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{activeScenario.results.conversionRate.toFixed(1)}%</div>
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle2 className="h-4 w-4 text-chart-4" />
                            <span className="text-sm font-medium text-muted-foreground">Estimated</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detailed Results */}
                    <SimulationResults scenario={activeScenario} />

                    {/* Chart Visualization */}
                    <SimulationChart scenario={activeScenario} />
                  </>
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="rounded-full bg-muted p-6 mb-4">
                        <Calculator className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Simulation Running</h3>
                      <p className="text-muted-foreground text-center max-w-md text-pretty">
                        Configure your promotional scenario on the left and click "Run Simulation" to see projected
                        results and impact analysis.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Scenario Comparison */}
            {scenarios.length > 1 && <ScenarioComparison scenarios={scenarios} />}

            {/* Recent Scenarios */}
            {scenarios.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Scenarios
                  </CardTitle>
                  <CardDescription>Compare your simulated promotional scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scenarios.map((scenario, index) => (
                      <div
                        key={scenario.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                          activeScenario?.id === scenario.id
                            ? "border-chart-1 bg-chart-1/5"
                            : "border-border/50 hover:bg-accent/50"
                        }`}
                        onClick={() => setActiveScenario(scenario)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{scenario.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {scenario.targetProducts} products • {scenario.promoType}
                            </div>
                          </div>
                        </div>
                        {scenario.results && (
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Revenue</div>
                              <div className="font-semibold">${scenario.results.revenue.toLocaleString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Margin</div>
                              <div className="font-semibold">{scenario.results.margin.toFixed(1)}%</div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pricing Calculator Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <PricingSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
