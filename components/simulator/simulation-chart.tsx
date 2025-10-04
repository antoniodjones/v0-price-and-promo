"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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

interface SimulationChartProps {
  scenario: SimulationScenario
}

export function SimulationChart({ scenario }: SimulationChartProps) {
  if (!scenario.results) return null

  const { results } = scenario

  // Calculate baseline values
  const baselineRevenue = results.revenue / (1 + results.revenueChange / 100)
  const baselineMargin = results.margin - results.marginChange
  const baselineUnits = results.unitsSold / (1 + results.unitsSoldChange / 100)

  const chartData = [
    {
      metric: "Revenue",
      baseline: Math.round(baselineRevenue),
      withPromo: Math.round(results.revenue),
    },
    {
      metric: "Units Sold",
      baseline: Math.round(baselineUnits),
      withPromo: results.unitsSold,
    },
    {
      metric: "Margin %",
      baseline: Math.round(baselineMargin * 10),
      withPromo: Math.round(results.margin * 10),
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Before vs. After Comparison</CardTitle>
        <CardDescription>Visual comparison of key metrics with and without promotion</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            baseline: {
              label: "Without Promo",
              color: "hsl(var(--chart-2))",
            },
            withPromo: {
              label: "With Promo",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="metric" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="baseline" fill="var(--color-baseline)" name="Without Promo" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withPromo" fill="var(--color-withPromo)" name="With Promo" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
