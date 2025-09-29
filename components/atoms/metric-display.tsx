import { cn } from "@/lib/utils"

interface MetricDisplayProps {
  label: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MetricDisplay({ label, value, change, size = "md", className }: MetricDisplayProps) {
  const safeLabel = label || ""
  const safeValue = value ?? 0
  const safeChange = change?.value ?? 0

  const sizeClasses = {
    sm: {
      value: "text-lg font-semibold",
      label: "text-xs",
      change: "text-xs",
    },
    md: {
      value: "text-2xl font-bold",
      label: "text-sm",
      change: "text-sm",
    },
    lg: {
      value: "text-3xl font-bold",
      label: "text-base",
      change: "text-base",
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn("space-y-1", className)}>
      {safeLabel && <div className={cn("text-muted-foreground", classes.label)}>{safeLabel}</div>}
      <div className={cn("text-foreground", classes.value)}>
        {typeof safeValue === "number" ? safeValue.toLocaleString() : safeValue}
      </div>
      {change && (
        <div className={cn(classes.change, change.type === "increase" ? "text-green-600" : "text-red-600")}>
          {change.type === "increase" ? "↗" : "↘"} {Math.abs(safeChange)}%
        </div>
      )}
    </div>
  )
}
