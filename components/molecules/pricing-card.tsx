import { UnifiedCard } from "@/components/shared/unified-card"
import { PriceDisplay, DiscountBadge } from "@/components/atoms"

interface PricingCardProps {
  originalPrice: number
  finalPrice: number
  discountPercentage?: number
  appliedRules: string[]
  className?: string
}

export function PricingCard({
  originalPrice,
  finalPrice,
  discountPercentage,
  appliedRules,
  className,
}: PricingCardProps) {
  const safeOriginalPrice = originalPrice || 0
  const safeFinalPrice = finalPrice || 0
  const safeAppliedRules = appliedRules || []

  const hasDiscount = safeFinalPrice < safeOriginalPrice
  const savings = safeOriginalPrice - safeFinalPrice

  return (
    <UnifiedCard variant="info" title="Pricing Details" className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Original Price:</span>
          <PriceDisplay price={safeOriginalPrice} size="sm" />
        </div>

        {hasDiscount && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Savings:</span>
              <span className="text-sm font-medium text-green-600">-${savings.toFixed(2)}</span>
            </div>

            {discountPercentage && (
              <div className="flex justify-center">
                <DiscountBadge percentage={discountPercentage} />
              </div>
            )}
          </>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Final Price:</span>
            <PriceDisplay price={safeFinalPrice} size="lg" />
          </div>
        </div>

        {safeAppliedRules.length > 0 && (
          <div className="text-xs text-muted-foreground">Applied rules: {safeAppliedRules.join(", ")}</div>
        )}
      </div>
    </UnifiedCard>
  )
}
