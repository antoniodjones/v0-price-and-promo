"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { PriceHistory } from "@/lib/types"

interface PriceChartProps {
  data: PriceHistory[]
  productName: string
  currentPrice: number
}

export function PriceChart({ data, productName, currentPrice }: PriceChartProps) {
  // Transform data for chart
  const chartData = data
    .map((item) => ({
      date: new Date(item.scraped_at).toLocaleDateString(),
      price: item.price,
      originalPrice: item.original_price || item.price,
      timestamp: item.scraped_at,
    }))
    .reverse() // Show oldest to newest

  const firstPrice = chartData[0]?.price || currentPrice
  const lastPrice = chartData[chartData.length - 1]?.price || currentPrice
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0

  const minPrice = Math.min(...chartData.map((d) => d.price))
  const maxPrice = Math.max(...chartData.map((d) => d.price))
  const avgPrice = chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length

  const getPriceIcon = () => {
    if (priceChange > 0) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (priceChange < 0) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getPriceChangeClass = () => {
    if (priceChange > 0) return "text-red-600 dark:text-red-400"
    if (priceChange < 0) return "text-green-600 dark:text-green-400"
    return "text-muted-foreground"
  }

  return (
    <Card className="price-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-balance">Price History - {productName}</CardTitle>
          <div className="flex items-center gap-2">
            {getPriceIcon()}
            <span className={`text-sm font-medium ${getPriceChangeClass()}`}>
              {priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">${minPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Lowest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${avgPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">${maxPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Highest</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">Price: ${payload[0].value?.toFixed(2)}</p>
                        {payload[0].payload.originalPrice !== payload[0].payload.price && (
                          <p className="text-muted-foreground text-sm">
                            Original: ${payload[0].payload.originalPrice?.toFixed(2)}
                          </p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Alerts */}
        <div className="flex flex-wrap gap-2">
          {minPrice < currentPrice * 0.9 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Great Deal Available
            </Badge>
          )}
          {maxPrice > currentPrice * 1.1 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Price Volatility
            </Badge>
          )}
          <Badge variant="outline">{chartData.length} data points</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
