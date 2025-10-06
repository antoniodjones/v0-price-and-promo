"use client"

import { UnifiedCard } from "@/components/shared/unified-card"
import type { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: string
}

export function QuickActionCard({ title, description, href, icon, color }: QuickActionCardProps) {
  return (
    <UnifiedCard
      variant="action"
      title={title}
      description={description}
      icon={icon}
      iconColor={color}
      onClick={() => (window.location.href = href)}
      className="cursor-pointer"
    />
  )
}
