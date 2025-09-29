"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertMessageProps {
  type?: "info" | "success" | "warning" | "error"
  title?: string
  message: string
  actions?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "destructive"
  }[]
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function AlertMessage({
  type = "info",
  title,
  message,
  actions,
  dismissible = false,
  onDismiss,
  className,
}: AlertMessageProps) {
  const safeMessage = message || "No message provided"
  const safeActions = actions || []

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  }

  const Icon = icons[type]

  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    success: "border-green-200 bg-green-50 text-green-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
    error: "border-red-200 bg-red-50 text-red-900",
  }

  return (
    <Alert className={cn(variants[type], className)}>
      <Icon className="h-4 w-4" />
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{safeMessage}</AlertDescription>
        {safeActions.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            {safeActions.map((action, index) => (
              <Button key={index} size="sm" variant={action.variant || "outline"} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {dismissible && onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
          <X className="h-3 w-3" />
        </Button>
      )}
    </Alert>
  )
}
