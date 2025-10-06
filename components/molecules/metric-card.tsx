"use client"

import { UnifiedCard } from "@/components/shared/unified-card"

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
  return (
    <UnifiedCard
      variant="metric"
      title={label}
      value={value}
      trend={
        trend
          ? {
              value: trend.value,
              isPositive: trend.direction === "up",
              label: trend.period ? `vs ${trend.period}` : undefined,
            }
          : undefined
      }
      size={size}
      className={className}
    />
  )
}
