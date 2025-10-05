"use client"

import type React from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requiredRole?: string | string[]
  requiredDepartment?: string | string[]
  requireAdmin?: boolean
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Always render children - no authentication checks until go-live
  return <>{children}</>
}
