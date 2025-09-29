"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Heart, Bell, ExternalLink } from "lucide-react"
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/services/watchlist"
import { createPriceAlert } from "@/lib/services/price-alerts"
import { getProductPriceDataClient } from "@/lib/services/products"
import type { Product, PriceData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface EnhancedProductCardProps {
  product: Product
  userId?: string
  showActions?: boolean
}

export function EnhancedProductCard({ product, userId, showActions = true }: EnhancedProductCardProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadPriceData = async () => {
      const data = await getProductPriceDataClient(product.id)
      setPriceData(data)
    }

    const checkWatchlistStatus = async () => {
      if (userId) {
        const inWatchlist = await isInWatchlist(userId, product.id)
        setIsWatchlisted(inWatchlist)
      }
    }

    loadPriceData()
    checkWatchlistStatus()
  }, [product.id, userId])

  const handleWatchlistToggle = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your watchlist.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
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
      setIsLoading(false)
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
    const alertPrice = currentPrice * 0.9 // 10% discount alert

    try {
      await createPriceAlert(userId, product.id, alertPrice)
      toast({
        title: "Price alert set",
        description: `You'll be notified when ${product.name} drops below $${alertPrice.toFixed(2)}.`,
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
  const priceChange = priceData?.price_change || 0
  const priceChangePercent = priceData?.price_change_percentage || 0

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
          {showActions && (
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
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
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
            <ExternalLink className="h-4 w-4 mr-1" />
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
