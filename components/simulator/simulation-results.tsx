import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"

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

interface SimulationResultsProps {
  scenario: SimulationScenario
}

export function SimulationResults({ scenario }: SimulationResultsProps) {
  if (!scenario.results) return null

  const { results } = scenario

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Detailed Impact Analysis</CardTitle>
        <CardDescription>Comprehensive breakdown of promotional effects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Financial Impact */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Financial Impact</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="text-sm text-muted-foreground">Total Discount Given</div>
                <div className="text-xl font-bold mt-1">${results.totalDiscount.toLocaleString()}</div>
              </div>
              <DollarSign className="h-8 w-8 text-chart-3 opacity-50" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="text-sm text-muted-foreground">Net Profit Impact</div>
                <div className="text-xl font-bold mt-1 flex items-center gap-2">
                  {results.profitImpact > 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-chart-4" />
                      <span className="text-chart-4">+${results.profitImpact.toLocaleString()}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <span className="text-destructive">${Math.abs(results.profitImpact).toLocaleString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <span className="text-sm font-medium">Average Order Value</span>
              <span className="text-lg font-bold">${results.avgOrderValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <span className="text-sm font-medium">Conversion Rate</span>
              <span className="text-lg font-bold">{results.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
              <span className="text-sm font-medium">Units Sold Increase</span>
              <span className="text-lg font-bold text-chart-4">+{results.unitsSoldChange.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recommendations</h4>
          <div className="space-y-2">
            {results.profitImpact > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
                <CheckCircle2 className="h-5 w-5 text-chart-4 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-chart-4">Positive ROI Expected</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    This promotion is projected to increase overall profitability despite the margin reduction.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
                <AlertTriangle className="h-5 w-5 text-chart-3 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-chart-3">Consider Adjusting Parameters</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Current settings may reduce profitability. Try lowering the discount or targeting higher-margin
                    products.
                  </div>
                </div>
              </div>
            )}

            {results.marginChange < -10 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Significant Margin Impact</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    This promotion reduces margins by more than 10%. Ensure volume increase justifies the trade-off.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
