"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  getTrendIcon,
  getTrendColor,
  formatCardValue,
  getCardPadding,
  getCardTextSize,
  type TrendData,
  type CardSize,
} from "@/lib/card-helpers"
import type { ReactNode } from "react"

// Base card props
interface BaseCardProps {
  className?: string
  size?: CardSize
  isLoading?: boolean
  error?: string | null
  children?: ReactNode
}

// Stat card variant
interface StatCardProps extends BaseCardProps {
  variant: "stat"
  title: string
  value: string | number
  icon?: LucideIcon
  trend?: TrendData
}

// Metric card variant
interface MetricCardProps extends BaseCardProps {
  variant: "metric"
  label: string
  value: string | number
  trend?: TrendData
}

// Action card variant
interface ActionCardProps extends BaseCardProps {
  variant: "action"
  title: string
  description: string
  icon?: LucideIcon
  iconColor?: string
  onClick?: () => void
  href?: string
}

// Info card variant
interface InfoCardProps extends BaseCardProps {
  variant: "info"
  title: string
  description?: string
  content: ReactNode
  footer?: ReactNode
  badge?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }
}

// Product card variant
interface ProductCardProps extends BaseCardProps {
  variant: "product"
  title: string
  subtitle?: string
  price?: number
  image?: string
  badge?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }
  actions?: Array<{ label: string; onClick: () => void; variant?: "default" | "outline" | "ghost" }>
}

export type UnifiedCardProps = StatCardProps | MetricCardProps | ActionCardProps | InfoCardProps | ProductCardProps

// Loading skeleton for cards
function CardSkeleton({ size = "md" }: { size?: CardSize }) {
  return (
    <Card className={cn(getCardPadding(size))}>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32 mb-1" />
      <Skeleton className="h-3 w-20" />
    </Card>
  )
}

// Error display for cards
function CardError({ error }: { error: string }) {
  return (
    <Card className="border-destructive">
      <CardContent className="p-6">
        <p className="text-sm text-destructive">{error}</p>
      </CardContent>
    </Card>
  )
}

// Stat card implementation
function StatCard({ title, value, icon: Icon, trend, size = "md", className }: Omit<StatCardProps, "variant">) {
  const TrendIcon = trend ? getTrendIcon(trend.direction) : null

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCardValue(value)}</div>
        {trend && TrendIcon && (
          <div className={cn("flex items-center gap-1 text-sm mt-1", getTrendColor(trend.direction))}>
            <TrendIcon className="h-4 w-4" />
            <span>
              {trend.value > 0 ? "+" : ""}
              {trend.value.toFixed(1)}%
            </span>
            {trend.period && <span className="text-muted-foreground ml-1">vs {trend.period}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Metric card implementation
function MetricCard({ label, value, trend, size = "md", className }: Omit<MetricCardProps, "variant">) {
  const textSizes = getCardTextSize(size)
  const TrendIcon = trend ? getTrendIcon(trend.direction) : null

  return (
    <Card className={cn("", className)}>
      <CardContent className={cn("flex flex-col", getCardPadding(size))}>
        <div className="flex items-baseline justify-between">
          <span className={cn("font-bold", textSizes.value)}>{formatCardValue(value)}</span>
          {trend && TrendIcon && (
            <div className="flex items-center gap-1">
              <TrendIcon className={cn("h-4 w-4", getTrendColor(trend.direction))} />
              <span className={cn("text-sm font-medium", getTrendColor(trend.direction))}>
                {trend.value > 0 ? "+" : ""}
                {trend.value.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn("text-muted-foreground font-medium", textSizes.label)}>{label}</span>
          {trend?.period && <span className="text-xs text-muted-foreground">vs {trend.period}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

// Action card implementation
function ActionCard({
  title,
  description,
  icon: Icon,
  iconColor = "bg-gti-dark-green",
  onClick,
  className,
}: Omit<ActionCardProps, "variant">) {
  return (
    <Button
      variant="outline"
      className={cn("w-full justify-start h-auto p-4 hover:bg-gray-50 bg-transparent", className)}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 w-full">
        {Icon && (
          <div className={cn("p-2 rounded-md flex-shrink-0", iconColor)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </Button>
  )
}

// Info card implementation
function InfoCard({ title, description, content, footer, badge, className }: Omit<InfoCardProps, "variant">) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

// Product card implementation
function ProductCard({
  title,
  subtitle,
  price,
  image,
  badge,
  actions = [],
  className,
}: Omit<ProductCardProps, "variant">) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-balance">{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {price !== undefined && <div className="text-2xl font-bold">${price.toFixed(2)}</div>}
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                size="sm"
                onClick={action.onClick}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main unified card component
export function UnifiedCard(props: UnifiedCardProps) {
  // Handle loading state
  if (props.isLoading) {
    return <CardSkeleton size={props.size} />
  }

  // Handle error state
  if (props.error) {
    return <CardError error={props.error} />
  }

  // Render appropriate variant
  switch (props.variant) {
    case "stat":
      return <StatCard {...props} />
    case "metric":
      return <MetricCard {...props} />
    case "action":
      return <ActionCard {...props} />
    case "info":
      return <InfoCard {...props} />
    case "product":
      return <ProductCard {...props} />
  }
}
