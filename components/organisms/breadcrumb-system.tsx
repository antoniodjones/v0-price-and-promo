"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbSystemProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function BreadcrumbSystem({ items, showHome = true, className }: BreadcrumbSystemProps) {
  // Ensure we have safe data
  const safeItems = items || []

  const allItems = showHome ? [{ label: "Dashboard", href: "/", isActive: false }, ...safeItems] : safeItems

  if (allItems.length === 0) {
    return null
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1
        const itemLabel = (item?.label || "").toString()

        return (
          <React.Fragment key={`breadcrumb-${index}-${itemLabel}`}>
            {index === 0 && showHome ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (item?.href) {
                    console.log("[v0] Navigate to:", item.href)
                  }
                }}
              >
                <Home className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-auto p-1 font-normal",
                  isLast || item?.isActive
                    ? "text-foreground cursor-default"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => {
                  if (!isLast && !item?.isActive && item?.href) {
                    console.log("[v0] Navigate to:", item.href)
                  }
                }}
                disabled={isLast || item?.isActive}
              >
                {itemLabel}
              </Button>
            )}

            {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Error Boundary for BreadcrumbSystem
export class BreadcrumbErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Breadcrumb Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <span>Navigation temporarily unavailable</span>
        </nav>
      )
    }

    return this.props.children
  }
}
