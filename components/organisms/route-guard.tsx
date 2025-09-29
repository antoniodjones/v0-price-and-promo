"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: string
  fallback?: React.ReactNode
  className?: string
}

export function RouteGuard({ children, requireAuth = false, requiredRole, fallback, className }: RouteGuardProps) {
  // For Phase 2, we'll implement basic route protection without auth dependencies
  // This will be enhanced in Phase 3 when authentication is added

  const [isLoading, setIsLoading] = React.useState(true)
  const [hasAccess, setHasAccess] = React.useState(false)

  React.useEffect(() => {
    // Simulate access check - for Phase 2, always allow access
    const checkAccess = async () => {
      try {
        // Phase 2: Basic access control without auth
        if (!requireAuth) {
          setHasAccess(true)
        } else {
          // For now, simulate that user has access
          // This will be replaced with real auth in Phase 3
          console.log("[v0] Route requires auth, simulating access granted")
          setHasAccess(true)
        }
      } catch (error) {
        console.error("[v0] Route guard error:", error)
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [requireAuth, requiredRole])

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {fallback || (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              {requireAuth ? "Please log in to access this page." : "You don't have permission to view this page."}
            </p>
          </div>
        )}
      </div>
    )
  }

  return <div className={className}>{children}</div>
}

// Error Boundary for RouteGuard
export class RouteGuardErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] RouteGuard Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">Navigation Error</h2>
            <p className="text-muted-foreground">Unable to verify page access.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
