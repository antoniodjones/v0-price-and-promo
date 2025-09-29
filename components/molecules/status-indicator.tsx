"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: string
  text?: string
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

export function StatusIndicator({ status, text, variant = "default", className }: StatusIndicatorProps) {
  const safeStatus = (status || "").toLowerCase()
  const displayText = text || status || "Unknown"

  const getVariant = () => {
    if (variant !== "default") return variant

    // Auto-detect variant based on status
    if (safeStatus.includes("active") || safeStatus.includes("success")) return "success"
    if (safeStatus.includes("warning") || safeStatus.includes("pending")) return "warning"
    if (safeStatus.includes("error") || safeStatus.includes("failed")) return "error"
    return "default"
  }

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  }

  const selectedVariant = getVariant()

  return (
    <Badge variant="secondary" className={cn(variantClasses[selectedVariant], className)}>
      {displayText}
    </Badge>
  )
}
