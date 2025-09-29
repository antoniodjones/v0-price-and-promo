import type * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "card" | "table" | "form" | "stats"
  lines?: number
}

function LoadingSkeleton({ className, variant = "default", lines = 1, ...props }: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded"

  if (variant === "card") {
    return (
      <div className={cn("space-y-3", className)} {...props}>
        <div className={cn(baseClasses, "h-4 w-3/4")} />
        <div className={cn(baseClasses, "h-3 w-1/2")} />
        <div className={cn(baseClasses, "h-20 w-full")} />
        <div className="flex space-x-2">
          <div className={cn(baseClasses, "h-8 w-16")} />
          <div className={cn(baseClasses, "h-8 w-16")} />
        </div>
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className={cn(baseClasses, "h-4 w-1/4")} />
            <div className={cn(baseClasses, "h-4 w-1/3")} />
            <div className={cn(baseClasses, "h-4 w-1/6")} />
            <div className={cn(baseClasses, "h-4 w-1/5")} />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "form") {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        <div className={cn(baseClasses, "h-4 w-1/4")} />
        <div className={cn(baseClasses, "h-9 w-full")} />
        <div className={cn(baseClasses, "h-4 w-1/3")} />
        <div className={cn(baseClasses, "h-9 w-full")} />
      </div>
    )
  }

  if (variant === "stats") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)} {...props}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className={cn(baseClasses, "h-8 w-16")} />
            <div className={cn(baseClasses, "h-4 w-20")} />
          </div>
        ))}
      </div>
    )
  }

  // Default variant - simple lines
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn(baseClasses, "h-4", i === lines - 1 ? "w-3/4" : "w-full")} />
      ))}
    </div>
  )
}

export { LoadingSkeleton }
