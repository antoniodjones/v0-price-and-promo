import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  cost?: number
  showMargin?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriceDisplay({ price, cost, showMargin = false, size = "md", className }: PriceDisplayProps) {
  const safePrice = price || 0
  const safeCost = cost || 0
  const margin = safeCost ? ((safePrice - safeCost) / safePrice) * 100 : 0

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("font-medium text-foreground", sizeClasses[size])}>${safePrice.toFixed(2)}</div>
      {cost && <div className="text-sm text-muted-foreground">Cost: ${safeCost.toFixed(2)}</div>}
      {showMargin && cost && <div className="text-xs text-muted-foreground">Margin: {margin.toFixed(1)}%</div>}
    </div>
  )
}
