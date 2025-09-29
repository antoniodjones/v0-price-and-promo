"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Heart, Bell } from "lucide-react"
import type { Product, PriceHistory } from "@/lib/types"

interface ProductCardProps {
  product: Product
  priceHistory?: PriceHistory[]
  onAddToWatchlist?: (productId: string) => void
  onSetAlert?: (productId: string) => void
}

export function ProductCard({ product, priceHistory = [], onAddToWatchlist, onSetAlert }: ProductCardProps) {
  const latestPrice = priceHistory[0]?.price || product.price
  const previousPrice = priceHistory[1]?.price || product.price
  const priceChange = latestPrice - previousPrice
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0

  const getPriceIcon = () => {
    if (priceChange > 0) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (priceChange < 0) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getPriceChangeClass = () => {
    if (priceChange > 0) return "price-up"
    if (priceChange < 0) return "price-down"
    return "price-neutral"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-balance">{product.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onAddToWatchlist?.(product.id)} className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onSetAlert?.(product.id)} className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">${latestPrice.toFixed(2)}</div>
            {priceChange !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${getPriceChangeClass()}`}>
                {getPriceIcon()}
                <span>
                  ${Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercent).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          <div className="text-right space-y-1">
            <div className="text-sm text-muted-foreground">Stock: {product.inventory_count}</div>
            {product.inventory_count < 10 && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">SKU: {product.sku}</span>
          {product.thc_percentage && <Badge variant="secondary">{product.thc_percentage}% THC</Badge>}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Compare Prices
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
