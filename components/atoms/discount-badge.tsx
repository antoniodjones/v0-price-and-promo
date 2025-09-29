import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DiscountBadgeProps {
  percentage: number
  type?: "percentage" | "fixed"
  className?: string
}

export function DiscountBadge({ percentage, type = "percentage", className }: DiscountBadgeProps) {
  const safePercentage = percentage || 0
  const displayValue = type === "percentage" ? `${safePercentage}% OFF` : `$${safePercentage.toFixed(2)} OFF`

  return (
    <Badge variant="secondary" className={cn("bg-blue-100 text-blue-800 border-blue-200 font-medium", className)}>
      {displayValue}
    </Badge>
  )
}
