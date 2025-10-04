import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = "neutral",
  className,
}: MetricCardProps) {
  const trendColors = {
    up: "text-chart-2",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={cn("text-xs mt-1", trendColors[trend])}>
            {change > 0 ? "+" : ""}
            {change}% {changeLabel || "from last period"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
