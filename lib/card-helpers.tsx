import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { JSX } from "react"

export type CardVariant = "stat" | "metric" | "action" | "info" | "product"
export type TrendDirection = "up" | "down" | "neutral"

export interface TrendData {
  value: number
  direction: TrendDirection
  period?: string
}

export interface CardState {
  isLoading: boolean
  error: string | null
}

// Trend calculation helpers
export function calculateTrendDirection(current: number, previous: number): TrendDirection {
  if (current > previous) return "up"
  if (current < previous) return "down"
  return "neutral"
}

export function calculateTrendPercentage(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function formatTrendValue(value: number): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export interface TrendResult {
  change: number
  percentage: number
  direction: TrendDirection
  icon: JSX.Element
}

// Trend icon helpers
export function getTrendIcon(direction: TrendDirection): LucideIcon {
  switch (direction) {
    case "up":
      return TrendingUp
    case "down":
      return TrendingDown
    case "neutral":
      return Minus
  }
}

export function getTrendColor(direction: TrendDirection): string {
  switch (direction) {
    case "up":
      return "text-green-600"
    case "down":
      return "text-red-600"
    case "neutral":
      return "text-gray-500"
  }
}

export function getTrendIconColor(direction: TrendDirection): string {
  switch (direction) {
    case "up":
      return "text-green-600"
    case "down":
      return "text-red-600"
    case "neutral":
      return "text-gray-500"
  }
}

// Size helpers
export type CardSize = "sm" | "md" | "lg"

export function getCardPadding(size: CardSize): string {
  switch (size) {
    case "sm":
      return "p-4"
    case "md":
      return "p-6"
    case "lg":
      return "p-8"
  }
}

export function getCardTextSize(size: CardSize): { value: string; label: string } {
  switch (size) {
    case "sm":
      return { value: "text-xl", label: "text-xs" }
    case "md":
      return { value: "text-2xl", label: "text-sm" }
    case "lg":
      return { value: "text-3xl", label: "text-base" }
  }
}

// Value formatting helpers
export function formatCardValue(value: string | number): string {
  if (typeof value === "number") {
    return value.toLocaleString()
  }
  return value
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function calculateTrend(current: number, previous: number): TrendResult {
  const change = current - previous
  const percentage = previous === 0 ? 0 : ((current - previous) / previous) * 100
  const direction = calculateTrendDirection(current, previous)

  const iconMap = {
    up: <TrendingUp className="h-4 w-4" />,
    down: <TrendingDown className="h-4 w-4" />,
    neutral: <Minus className="h-4 w-4" />,
  }

  return {
    change,
    percentage,
    direction,
    icon: iconMap[direction],
  }
}
