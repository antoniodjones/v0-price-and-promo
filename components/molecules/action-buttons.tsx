"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActionButtonsProps {
  onSave?: () => void
  onCancel?: () => void
  saveText?: string
  cancelText?: string
  saveDisabled?: boolean
  cancelDisabled?: boolean
  loading?: boolean
  className?: string
  variant?: "default" | "inline" | "stacked"
}

export function ActionButtons({
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  saveDisabled = false,
  cancelDisabled = false,
  loading = false,
  className,
  variant = "default",
}: ActionButtonsProps) {
  const containerClasses = {
    default: "flex items-center justify-end space-x-2",
    inline: "flex items-center space-x-2",
    stacked: "flex flex-col space-y-2",
  }

  return (
    <div className={cn(containerClasses[variant], className)}>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={cancelDisabled || loading}>
          {cancelText}
        </Button>
      )}
      {onSave && (
        <Button type="submit" onClick={onSave} disabled={saveDisabled || loading}>
          {loading ? "Saving..." : saveText}
        </Button>
      )}
    </div>
  )
}
