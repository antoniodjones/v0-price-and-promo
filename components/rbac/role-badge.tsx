"use client"

import { Badge } from "@/components/ui/badge"
import { type Role, ROLES } from "@/lib/rbac/roles"
import { Shield, Users, BarChart3, Eye } from "lucide-react"

interface RoleBadgeProps {
  role: Role
  showIcon?: boolean
}

const roleConfig = {
  [ROLES.ADMIN]: {
    label: "Admin",
    variant: "default" as const,
    icon: Shield,
    className: "bg-red-500 hover:bg-red-600",
  },
  [ROLES.MANAGER]: {
    label: "Manager",
    variant: "secondary" as const,
    icon: Users,
    className: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  [ROLES.ANALYST]: {
    label: "Analyst",
    variant: "outline" as const,
    icon: BarChart3,
    className: "bg-green-500 hover:bg-green-600 text-white border-green-600",
  },
  [ROLES.VIEWER]: {
    label: "Viewer",
    variant: "outline" as const,
    icon: Eye,
    className: "bg-gray-500 hover:bg-gray-600 text-white border-gray-600",
  },
}

export function RoleBadge({ role, showIcon = true }: RoleBadgeProps) {
  const config = roleConfig[role]
  if (!config) return null

  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}
