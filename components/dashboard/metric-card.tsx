import { UnifiedCard } from "@/components/shared/unified-card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function MetricCard({ title, value, change, changeLabel, icon, trend = "neutral", className }: MetricCardProps) {
  return (
    <UnifiedCard
      variant="stat"
      title={title}
      value={value}
      trend={
        change !== undefined
          ? {
              value: change,
              isPositive: trend === "up",
              label: changeLabel || "from last period",
            }
          : undefined
      }
      icon={icon}
      className={className}
    />
  )
}
