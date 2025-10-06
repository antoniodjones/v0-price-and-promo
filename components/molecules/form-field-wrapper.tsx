"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * @deprecated This component is deprecated. Use the new form system instead:
 *
 * Import from: lib/form-helpers.tsx
 * - Use FormItem, FormLabel, FormControl from components/ui/form.tsx
 * - Or use TextField/NumberField helpers that include labels and validation
 *
 * See docs/FORM_PATTERNS.md for migration guide
 *
 * This component will be removed in a future version.
 */

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
