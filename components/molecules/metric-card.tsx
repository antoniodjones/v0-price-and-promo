"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  value: string | number
  label: string
  trend?: {
    value: number
    direction: "up" | "down" | "neutral"
    period?: string
  }
  className?: string
  size?: "sm" | "md" | "lg"
}

export function MetricCard({ value, label, trend, className, size = "md" }: MetricCardProps) {
  const safeValue = value ?? 0
  const safeLabel = label || "Metric"

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  const textSizes = {
    sm: { value: "text-xl", label: "text-xs" },
    md: { value: "text-2xl", label: "text-sm" },
    lg: { value: "text-3xl", label: "text-base" },
  }

  const getTrendIcon = () => {
    if (!trend) return null

    switch (trend.direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "neutral":
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    if (!trend) return ""

    switch (trend.direction) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "neutral":
        return "text-gray-500"
      default:
        return ""
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className={cn("flex flex-col", sizeClasses[size])}>
        <div className="flex items-baseline justify-between">
          <span className={cn("font-bold", textSizes[size].value)}>{safeValue}</span>
          {trend && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn("text-muted-foreground font-medium", textSizes[size].label)}>{safeLabel}</span>
          {trend?.period && <span className="text-xs text-muted-foreground">vs {trend.period}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
