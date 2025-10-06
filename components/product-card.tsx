"use client"

import { UnifiedCard } from "@/components/shared/unified-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Bell } from "lucide-react"
import type { Product, PriceHistory } from "@/lib/types"
import { calculateTrend, formatCurrency } from "@/lib/card-helpers"

interface ProductCardProps {
  product: Product
  priceHistory?: PriceHistory[]
  onAddToWatchlist?: (productId: string) => void
  onSetAlert?: (productId: string) => void
}

export function ProductCard({ product, priceHistory = [], onAddToWatchlist, onSetAlert }: ProductCardProps) {
  const latestPrice = priceHistory[0]?.price || product.price
  const previousPrice = priceHistory[1]?.price || product.price
  const trend = calculateTrend(latestPrice, previousPrice)

  const productContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{formatCurrency(latestPrice)}</div>
          {trend.change !== 0 && (
            <div
              className={`flex items-center gap-1 text-sm ${trend.direction === "up" ? "text-red-500" : trend.direction === "down" ? "text-green-500" : "text-muted-foreground"}`}
            >
              {trend.icon}
              <span>
                {formatCurrency(Math.abs(trend.change))} ({Math.abs(trend.percentage).toFixed(1)}%)
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
    </div>
  )

  const productActions = (
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" onClick={() => onAddToWatchlist?.(product.id)} className="h-8 w-8 p-0">
        <Heart className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onSetAlert?.(product.id)} className="h-8 w-8 p-0">
        <Bell className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <UnifiedCard
      variant="product"
      title={product.name}
      subtitle={`${product.brand} • ${product.category}`}
      content={productContent}
      actions={productActions}
    />
  )
}
