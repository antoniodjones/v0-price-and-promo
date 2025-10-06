import { UnifiedCard } from "@/components/shared/unified-card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  return (
    <UnifiedCard
      variant="stat"
      title={title}
      value={value}
      trend={change ? { value: change.value, isPositive: change.type === "increase" } : undefined}
      icon={icon}
      className={className}
    />
  )
}
