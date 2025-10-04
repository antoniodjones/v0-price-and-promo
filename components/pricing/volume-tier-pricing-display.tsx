"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Info, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PricingDisplayProps {
  productId: string
  customerId?: string
  quantity: number
  basePrice: number
  showBreakdown?: boolean
}

interface PricingBreakdown {
  basePrice: number
  finalPrice: number
  totalDiscount: number
  discountPercentage: number
  breakdown: {
    basePrice: number
    volumeDiscount: number
    tierDiscount: number
    finalPrice: number
  }
  appliedRules: {
    volumeRule?: string
    tieredRule?: string
  }
}

export function VolumeTierPricingDisplay({
  productId,
  customerId,
  quantity,
  basePrice,
  showBreakdown = true,
}: PricingDisplayProps) {
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPricing()
  }, [productId, customerId, quantity])

  const fetchPricing = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerId,
          quantity,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPricing(result.data)
      }
    } catch (err) {
      console.error("[v0] Error fetching pricing:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!pricing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Unable to calculate pricing</div>
        </CardContent>
      </Card>
    )
  }

  const hasSavings = pricing.totalDiscount > 0

  return (
    <Card className={hasSavings ? "border-gti-bright-green/30 bg-green-50/30" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pricing</CardTitle>
          {hasSavings && (
            <Badge className="bg-gti-bright-green text-white">
              <TrendingDown className="h-3 w-3 mr-1" />
              Save {pricing.discountPercentage.toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Base Price ({quantity}x)</span>
            <span className={hasSavings ? "line-through text-muted-foreground" : "font-semibold"}>
              ${pricing.basePrice.toFixed(2)}
            </span>
          </div>

          {hasSavings && (
            <>
              <div className="flex items-center justify-between text-sm text-gti-bright-green font-medium">
                <span>Discount Applied</span>
                <span>-${pricing.totalDiscount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                <span>Final Price</span>
                <span className="text-gti-bright-green">${pricing.finalPrice.toFixed(2)}</span>
              </div>
            </>
          )}

          {!hasSavings && (
            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>${pricing.finalPrice.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Applied Rules */}
        {showBreakdown && hasSavings && (
          <div className="pt-3 border-t space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                {pricing.appliedRules.volumeRule && (
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span>Volume discount: {pricing.appliedRules.volumeRule}</span>
                  </div>
                )}
                {pricing.appliedRules.tieredRule && (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="h-4 px-1 text-[10px]">
                      TIER
                    </Badge>
                    <span>Customer tier: {pricing.appliedRules.tieredRule}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        {showBreakdown && hasSavings && (
          <div className="pt-3 border-t">
            <div className="text-xs font-medium mb-2">Price Breakdown</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price</span>
                <span>${pricing.breakdown.basePrice.toFixed(2)}</span>
              </div>
              {pricing.breakdown.volumeDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Volume Discount</span>
                  <span>-${pricing.breakdown.volumeDiscount.toFixed(2)}</span>
                </div>
              )}
              {pricing.breakdown.tierDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tier Discount</span>
                  <span>-${pricing.breakdown.tierDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-1 border-t">
                <span>Final Price</span>
                <span>${pricing.breakdown.finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
