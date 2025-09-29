"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldWrapperProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  id?: string
}

export function FormFieldWrapper({ label, error, required = false, children, className, id }: FormFieldWrapperProps) {
  const safeError = error || ""
  const hasError = Boolean(safeError.trim())

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {hasError && (
        <p className="text-sm text-red-600" role="alert">
          {safeError}
        </p>
      )}
    </div>
  )
}
