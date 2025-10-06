import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Check } from "lucide-react"

/**
 * @deprecated This component is deprecated. Use the new form system instead:
 *
 * For enhanced inputs with validation:
 * - Use components/ui/input.tsx with FormField from components/ui/form.tsx
 * - Or use TextField/NumberField from lib/form-helpers.tsx
 *
 * The new system provides:
 * - Automatic validation with Zod schemas
 * - Type-safe form handling with react-hook-form
 * - Consistent error display and accessibility
 *
 * See docs/FORM_PATTERNS.md for migration guide
 *
 * This component will be removed in a future version.
 */

interface EnhancedInputProps extends React.ComponentProps<"input"> {
  error?: string
  success?: boolean
  helperText?: string
  label?: string
  required?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, error, success, helperText, label, required, ...props }, ref) => {
    const hasError = !!error
    const hasSuccess = success && !hasError

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              hasSuccess && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20",
              hasError || hasSuccess ? "pr-10" : "",
              className,
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          {(hasError || hasSuccess) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {hasError && <AlertCircle className="h-4 w-4 text-destructive" />}
              {hasSuccess && <Check className="h-4 w-4 text-green-500" />}
            </div>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
