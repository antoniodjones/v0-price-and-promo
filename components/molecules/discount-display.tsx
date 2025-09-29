"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DiscountRule {
  id: string
  name: string
  type: string
  discountValue: number
  discountType: "percentage" | "fixed"
  reason?: string
}

interface DiscountDisplayProps {
  appliedDiscount?: DiscountRule
  availableDiscounts?: DiscountRule[]
  savings?: number
  className?: string
}

export function DiscountDisplay({
  appliedDiscount,
  availableDiscounts = [],
  savings = 0,
  className,
}: DiscountDisplayProps) {
  const safeAvailableDiscounts = availableDiscounts || []
  const safeSavings = savings || 0

  if (!appliedDiscount && safeAvailableDiscounts.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-4 text-center text-muted-foreground">No discounts available</CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4 space-y-3">
        {appliedDiscount && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Applied Discount:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                {appliedDiscount.name}
              </Badge>
            </div>
            {appliedDiscount.reason && <p className="text-xs text-muted-foreground">{appliedDiscount.reason}</p>}
            {safeSavings > 0 && (
              <div className="text-sm font-medium text-green-600">You save: ${safeSavings.toFixed(2)}</div>
            )}
          </div>
        )}

        {safeAvailableDiscounts.length > 1 && (
          <div className="space-y-2 border-t pt-3">
            <span className="text-sm font-medium">Other Available Discounts:</span>
            <div className="space-y-1">
              {safeAvailableDiscounts
                .filter((discount) => discount.id !== appliedDiscount?.id)
                .map((discount) => (
                  <div key={discount.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{discount.name}</span>
                    <Badge variant="outline" size="sm">
                      {discount.discountType === "percentage"
                        ? `${discount.discountValue}%`
                        : `$${discount.discountValue}`}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
