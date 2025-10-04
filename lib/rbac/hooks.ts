"use client"

import { useAuth } from "@/lib/context/auth-context"
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessRoute, type Permission, type Role } from "./roles"

export function usePermissions() {
  const { state } = useAuth()
  const userRole = (state.user as any)?.role as Role | undefined

  return {
    hasPermission: (permission: Permission) => {
      if (!userRole) return false
      return hasPermission(userRole, permission)
    },
    hasAnyPermission: (permissions: Permission[]) => {
      if (!userRole) return false
      return hasAnyPermission(userRole, permissions)
    },
    hasAllPermissions: (permissions: Permission[]) => {
      if (!userRole) return false
      return hasAllPermissions(userRole, permissions)
    },
    canAccessRoute: (routePath: string) => {
      if (!userRole) return false
      return canAccessRoute(userRole, routePath)
    },
    userRole,
  }
}
