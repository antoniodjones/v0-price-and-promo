"use client"

import type { ReactNode } from "react"
import { usePermissions } from "@/lib/rbac/hooks"
import type { Permission } from "@/lib/rbac/roles"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProtectedActionProps {
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
  showTooltip?: boolean
  tooltipMessage?: string
  requireAll?: boolean // If true, requires all permissions; if false, requires any
}

export function ProtectedAction({
  permission,
  children,
  fallback = null,
  showTooltip = true,
  tooltipMessage = "You don't have permission to perform this action",
  requireAll = false,
}: ProtectedActionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission)

  if (hasAccess) {
    return <>{children}</>
  }

  if (!showTooltip) {
    return <>{fallback}</>
  }

  // Show disabled version with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="opacity-50 cursor-not-allowed">{children}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
