"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  type?: "text" | "email" | "password" | "number"
  disabled?: boolean
  className?: string
  id?: string
}

/**
 * @deprecated This component is deprecated. Use the new form system instead:
 *
 * Import from: lib/form-helpers.tsx
 * - TextField, NumberField, SelectField, etc. for component-based forms
 * - Or use components/ui/form.tsx with react-hook-form + Zod for full forms
 *
 * See docs/FORM_PATTERNS.md for migration guide
 *
 * This component will be removed in a future version.
 */

export function FormField({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  type = "text",
  disabled = false,
  className,
  id,
}: FormFieldProps) {
  const safeValue = value || ""
  const safeError = error || ""
  const hasError = Boolean(safeError.trim())
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={fieldId}
        type={type}
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(hasError && "border-red-500 focus-visible:ring-red-500")}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${fieldId}-error` : undefined}
      />
      {hasError && (
        <p id={`${fieldId}-error`} className="text-sm text-red-600" role="alert">
          {safeError}
        </p>
      )}
    </div>
  )
}
