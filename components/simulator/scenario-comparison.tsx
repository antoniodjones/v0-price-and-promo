import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award } from "lucide-react"

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

interface ScenarioComparisonProps {
  scenarios: SimulationScenario[]
}

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  // Find best scenarios
  const bestRevenue = scenarios.reduce((best, current) =>
    (current.results?.revenue || 0) > (best.results?.revenue || 0) ? current : best,
  )

  const bestProfit = scenarios.reduce((best, current) =>
    (current.results?.profitImpact || 0) > (best.results?.profitImpact || 0) ? current : best,
  )

  const bestMargin = scenarios.reduce((best, current) =>
    (current.results?.margin || 0) > (best.results?.margin || 0) ? current : best,
  )

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-chart-5" />
          Scenario Comparison
        </CardTitle>
        <CardDescription>Compare performance across all simulated scenarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Best Revenue */}
          <div className="p-4 rounded-lg border border-chart-1/30 bg-chart-1/5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-chart-1" />
              <span className="text-sm font-semibold text-chart-1">Highest Revenue</span>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold">{bestRevenue.name}</div>
              <div className="text-2xl font-bold text-chart-1">${bestRevenue.results?.revenue.toLocaleString()}</div>
              <Badge variant="outline" className="text-xs">
                +{bestRevenue.results?.revenueChange.toFixed(1)}% increase
              </Badge>
            </div>
          </div>

          {/* Best Profit */}
          <div className="p-4 rounded-lg border border-chart-4/30 bg-chart-4/5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-chart-4" />
              <span className="text-sm font-semibold text-chart-4">Best Profit Impact</span>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold">{bestProfit.name}</div>
              <div className="text-2xl font-bold text-chart-4">
                +${bestProfit.results?.profitImpact.toLocaleString()}
              </div>
              <Badge variant="outline" className="text-xs">
                Net profit increase
              </Badge>
            </div>
          </div>

          {/* Best Margin */}
          <div className="p-4 rounded-lg border border-chart-2/30 bg-chart-2/5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-chart-2" />
              <span className="text-sm font-semibold text-chart-2">Best Margin Retention</span>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-bold">{bestMargin.name}</div>
              <div className="text-2xl font-bold text-chart-2">{bestMargin.results?.margin.toFixed(1)}%</div>
              <Badge variant="outline" className="text-xs">
                {bestMargin.results?.marginChange.toFixed(1)}% change
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
