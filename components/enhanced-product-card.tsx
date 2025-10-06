"use client"

import { useState, useEffect } from "react"
import { UnifiedCard } from "@/components/shared/unified-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Bell, ExternalLink } from "lucide-react"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/services/watchlist"
import { createPriceAlert } from "@/lib/services/price-alerts"
import { getProductPriceDataClient } from "@/lib/services/products"
import type { Product, PriceData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useCardState } from "@/lib/hooks/use-card-state"
import { useCardActions } from "@/lib/hooks/use-card-actions"
import { calculateTrend, formatCurrency } from "@/lib/card-helpers"

interface EnhancedProductCardProps {
  product: Product
  userId?: string
  showActions?: boolean
}

export function EnhancedProductCard({ product, userId, showActions = true }: EnhancedProductCardProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const { toast } = useToast()

  const { isLoading, error, setLoading, setError } = useCardState()

  const { handleClick } = useCardActions({
    onClick: () => {},
    disabled: isLoading,
  })

  useEffect(() => {
    const loadPriceData = async () => {
      setLoading(true)
      try {
        const data = await getProductPriceDataClient(product.id)
        setPriceData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load price data")
      } finally {
        setLoading(false)
      }
    }

    const checkWatchlistStatus = async () => {
      if (userId) {
        const inWatchlist = await isInWatchlist(userId, product.id)
        setIsWatchlisted(inWatchlist)
      }
    }

    loadPriceData()
    checkWatchlistStatus()
  }, [product.id, userId, setLoading, setError])

  const handleWatchlistToggle = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your watchlist.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isWatchlisted) {
        await removeFromWatchlist(userId, product.id)
        setIsWatchlisted(false)
        toast({
          title: "Removed from watchlist",
          description: `${product.name} has been removed from your watchlist.`,
        })
      } else {
        await addToWatchlist(userId, product.id)
        setIsWatchlisted(true)
        toast({
          title: "Added to watchlist",
          description: `${product.name} has been added to your watchlist.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetAlert = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to set price alerts.",
        variant: "destructive",
      })
      return
    }

    const currentPrice = priceData?.current_price || product.price
    const alertPrice = currentPrice * 0.9

    try {
      await createPriceAlert(userId, product.id, alertPrice)
      toast({
        title: "Price alert set",
        description: `You'll be notified when ${product.name} drops below ${formatCurrency(alertPrice)}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set price alert. Please try again.",
        variant: "destructive",
      })
    }
  }

  const currentPrice = priceData?.current_price || product.price
  const previousPrice = priceData?.previous_price || product.price
  const trend = calculateTrend(currentPrice, previousPrice)

  const productContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold">{formatCurrency(currentPrice)}</div>
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
          <ExternalLink className="h-4 w-4 mr-1" />
          Compare
        </Button>
      </div>
    </div>
  )

  const productActions = showActions ? (
    <div className="flex gap-1">
      <Button
        variant={isWatchlisted ? "default" : "ghost"}
        size="sm"
        onClick={handleWatchlistToggle}
        disabled={isLoading}
        className="h-8 w-8 p-0"
      >
        <Heart className={`h-4 w-4 ${isWatchlisted ? "fill-current" : ""}`} />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSetAlert} className="h-8 w-8 p-0">
        <Bell className="h-4 w-4" />
      </Button>
    </div>
  ) : undefined

  return (
    <UnifiedCard
      variant="product"
      title={product.name}
      subtitle={`${product.brand} • ${product.category}`}
      content={productContent}
      actions={productActions}
      isLoading={isLoading}
      error={error}
    />
  )
}
