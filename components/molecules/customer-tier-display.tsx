import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CustomerTierDisplayProps {
  tier: "bronze" | "silver" | "gold" | "platinum"
  totalSpent: number
  className?: string
}

export function CustomerTierDisplay({ tier, totalSpent, className }: CustomerTierDisplayProps) {
  const tierConfig = {
    bronze: {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      label: "Bronze",
    },
    silver: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Silver",
    },
    gold: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: "Gold",
    },
    platinum: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      label: "Platinum",
    },
  }

  const config = tierConfig[tier]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge className={config.color}>{config.label}</Badge>
      <span className="text-sm text-muted-foreground">${totalSpent.toLocaleString()} spent</span>
    </div>
  )
}
