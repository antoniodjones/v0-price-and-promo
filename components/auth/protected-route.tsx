"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requiredRole?: string | string[]
  requiredDepartment?: string | string[]
}

export function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
  requiredRole,
  requiredDepartment,
}: ProtectedRouteProps) {
  const { state, hasRole, hasDepartment } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (state.isDevelopmentMode) {
      return
    }

    if (!state.loading && !state.isAuthenticated) {
      router.push(redirectTo)
    }
  }, [state.loading, state.isAuthenticated, state.isDevelopmentMode, router, redirectTo])

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    )
  }

  if (state.isDevelopmentMode) {
    return <>{children}</>
  }

  if (!state.isAuthenticated) {
    return null // Will redirect
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have the required role to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredDepartment && !hasDepartment(requiredDepartment)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have the required department access to view this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
