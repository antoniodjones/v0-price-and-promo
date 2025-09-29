"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, TrendingUp, TrendingDown, Crown } from "lucide-react"
import type { CompetitorAnalysis } from "@/lib/types"

interface CompetitorComparisonProps {
  analysis: CompetitorAnalysis[]
  productName: string
  ourPrice: number
}

export function CompetitorComparison({ analysis, productName, ourPrice }: CompetitorComparisonProps) {
  const sortedAnalysis = [...analysis].sort((a, b) => a.competitor_price - b.competitor_price)
  const bestPrice = sortedAnalysis[0]?.competitor_price || ourPrice
  const ourRanking = sortedAnalysis.findIndex((a) => a.our_price <= a.competitor_price) + 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-balance">Competitor Analysis - {productName}</CardTitle>
          <div className="flex items-center gap-2">
            {ourRanking <= 3 && <Crown className="h-4 w-4 text-yellow-500" />}
            <Badge variant={ourRanking === 1 ? "default" : "secondary"}>#{ourRanking} Best Price</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Our Price */}
        <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-primary">Our Price</div>
              <div className="text-2xl font-bold">${ourPrice.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Market Position</div>
              <div className="font-semibold">
                {ourRanking === 1 ? "Best Price" : `#${ourRanking} of ${analysis.length + 1}`}
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Prices */}
        <div className="space-y-3">
          {sortedAnalysis.map((competitor, index) => {
            const priceDiff = competitor.competitor_price - ourPrice
            const priceDiffPercent = ourPrice > 0 ? (priceDiff / ourPrice) * 100 : 0
            const isLowest = index === 0
            const isHighest = index === sortedAnalysis.length - 1

            return (
              <div
                key={competitor.id}
                className={`p-3 rounded-lg border ${
                  isLowest
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    : isHighest
                      ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                      : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{competitor.competitor_name}</div>
                      <div className="text-sm text-muted-foreground">{competitor.market_position}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">${competitor.competitor_price.toFixed(2)}</div>
                    <div
                      className={`text-sm flex items-center gap-1 ${
                        priceDiff > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {priceDiff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {priceDiff >= 0 ? "+" : ""}${priceDiff.toFixed(2)} ({priceDiffPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">${bestPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Market Best</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              ${(sortedAnalysis.reduce((sum, a) => sum + a.competitor_price, 0) / sortedAnalysis.length).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Market Average</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Sources
          </Button>
          <Button size="sm" className="flex-1">
            Update Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
