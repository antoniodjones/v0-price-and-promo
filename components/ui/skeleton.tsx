import type React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />
}

export function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("p-6 border rounded-lg space-y-3", className)} {...props}>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  ...props
}: { rows?: number; columns?: number } & React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonForm({ fields = 3, className, ...props }: { fields?: number } & React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={`field-${i}`} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export function SkeletonStats({ items = 4, className, ...props }: { items?: number } & React.ComponentProps<"div">) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={`stat-${i}`} className="space-y-3 p-6 border rounded-lg">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
