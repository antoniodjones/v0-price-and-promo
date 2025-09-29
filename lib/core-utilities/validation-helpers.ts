// Enhanced validation helpers with comprehensive error handling
import { safeStringOperation, safeNumberOperation } from "./safe-operations"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ValidationRule<T> {
  name: string
  validate: (value: T) => boolean
  message: string
  severity: "error" | "warning"
}

// Generic validator class
export class SafeValidator<T> {
  private rules: ValidationRule<T>[] = []

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule)
    return this
  }

  validate(value: T): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    }

    for (const rule of this.rules) {
      try {
        if (!rule.validate(value)) {
          if (rule.severity === "error") {
            result.errors.push(rule.message)
            result.isValid = false
          } else {
            result.warnings.push(rule.message)
          }
        }
      } catch (error) {
        console.warn(`[v0] Validation rule "${rule.name}" failed:`, error)
        result.errors.push(`Validation error in rule: ${rule.name}`)
        result.isValid = false
      }
    }

    return result
  }
}

// Pre-built validators for common use cases
export const emailValidator = new SafeValidator<string>()
  .addRule({
    name: "required",
    validate: (value) => safeStringOperation(value, "trim").length > 0,
    message: "Email is required",
    severity: "error",
  })
  .addRule({
    name: "format",
    validate: (value) => {
      const email = safeStringOperation(value, "trim")
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    message: "Please enter a valid email address",
    severity: "error",
  })

export const passwordValidator = new SafeValidator<string>()
  .addRule({
    name: "required",
    validate: (value) => safeStringOperation(value, "toString").length > 0,
    message: "Password is required",
    severity: "error",
  })
  .addRule({
    name: "minLength",
    validate: (value) => safeStringOperation(value, "toString").length >= 8,
    message: "Password must be at least 8 characters long",
    severity: "error",
  })
  .addRule({
    name: "strength",
    validate: (value) => {
      const password = safeStringOperation(value, "toString")
      const hasUpper = /[A-Z]/.test(password)
      const hasLower = /[a-z]/.test(password)
      const hasNumber = /\d/.test(password)
      return hasUpper && hasLower && hasNumber
    },
    message: "Password should contain uppercase, lowercase, and numbers",
    severity: "warning",
  })

export const priceValidator = new SafeValidator<number>()
  .addRule({
    name: "required",
    validate: (value) => !isNaN(safeNumberOperation(value)),
    message: "Price is required",
    severity: "error",
  })
  .addRule({
    name: "positive",
    validate: (value) => safeNumberOperation(value) >= 0,
    message: "Price must be positive",
    severity: "error",
  })
  .addRule({
    name: "reasonable",
    validate: (value) => {
      const price = safeNumberOperation(value)
      return price <= 1000000 // $1M max
    },
    message: "Price seems unusually high",
    severity: "warning",
  })

export const discountValidator = new SafeValidator<number>()
  .addRule({
    name: "required",
    validate: (value) => !isNaN(safeNumberOperation(value)),
    message: "Discount is required",
    severity: "error",
  })
  .addRule({
    name: "range",
    validate: (value) => {
      const discount = safeNumberOperation(value)
      return discount >= 0 && discount <= 100
    },
    message: "Discount must be between 0% and 100%",
    severity: "error",
  })

// Safe form validation helper
export function validateForm<T extends Record<string, any>>(
  data: T,
  validators: Partial<Record<keyof T, SafeValidator<any>>>,
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>

  for (const [field, validator] of Object.entries(validators)) {
    if (validator && field in data) {
      try {
        results[field as keyof T] = validator.validate(data[field])
      } catch (error) {
        console.warn(`[v0] Form validation failed for field "${field}":`, error)
        results[field as keyof T] = {
          isValid: false,
          errors: [`Validation failed for ${field}`],
          warnings: [],
        }
      }
    }
  }

  return results
}

// Safe business rule validation
export function validateBusinessRule(
  ruleName: string,
  condition: () => boolean,
  errorMessage: string,
): ValidationResult {
  try {
    const isValid = condition()
    return {
      isValid,
      errors: isValid ? [] : [errorMessage],
      warnings: [],
    }
  } catch (error) {
    console.warn(`[v0] Business rule validation failed for "${ruleName}":`, error)
    return {
      isValid: false,
      errors: [`Business rule validation failed: ${ruleName}`],
      warnings: [],
    }
  }
}
