"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { usePermissions } from "@/lib/rbac/hooks"
import type { Permission } from "@/lib/rbac/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: ReactNode
  permission?: Permission | Permission[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function ProtectedRoute({ children, permission, requireAll = false, fallback }: ProtectedRouteProps) {
  const { state } = useAuth()
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()
  const router = useRouter()

  const hasAccess = permission
    ? Array.isArray(permission)
      ? requireAll
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission)
      : hasPermission(permission)
    : true

  useEffect(() => {
    if (!state.loading && !state.isAuthenticated && !state.isDevelopmentMode) {
      router.push("/auth/login")
    }
  }, [state.loading, state.isAuthenticated, state.isDevelopmentMode, router])

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!state.isAuthenticated && !state.isDevelopmentMode) {
    return null
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This page requires specific permissions that your account doesn't have. Please contact your administrator
              if you believe this is an error.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
