"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Package } from "lucide-react"

interface VolumeSavingsIndicatorProps {
  productId: string
  currentQuantity: number
  customerId?: string
}

interface NextTierInfo {
  nextQuantity: number
  nextDiscount: number
  additionalSavings: number
}

export function VolumeSavingsIndicator({ productId, currentQuantity, customerId }: VolumeSavingsIndicatorProps) {
  const [nextTier, setNextTier] = useState<NextTierInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNextTier()
  }, [productId, currentQuantity, customerId])

  const fetchNextTier = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/pricing/next-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          currentQuantity,
          customerId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setNextTier(result.data)
      }
    } catch (err) {
      console.error("[v0] Error fetching next tier:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !nextTier) {
    return null
  }

  const quantityNeeded = nextTier.nextQuantity - currentQuantity

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
      <div className="text-sm">
        <div className="font-medium text-blue-900">
          Buy {quantityNeeded} more to save an extra ${nextTier.additionalSavings.toFixed(2)}!
        </div>
        <div className="text-xs text-blue-700">
          Next tier: {nextTier.nextQuantity}+ units at {nextTier.nextDiscount}% off
        </div>
      </div>
      <Badge className="ml-auto bg-blue-600 text-white">
        <TrendingDown className="h-3 w-3 mr-1" />
        {nextTier.nextDiscount}%
      </Badge>
    </div>
  )
}
