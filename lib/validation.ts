import { z } from "zod"
import { ValidationError } from "./error-handler"

/**
 * Validates data against a Zod schema and throws ValidationError if invalid
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")
      throw new ValidationError(`Validation failed: ${messages}`)
    }
    throw error
  }
}

/**
 * Validates data against a Zod schema and returns result with success flag
 */
export function safeValidateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  success: boolean
  data?: T
  error?: string
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")
      return { success: false, error: `Validation failed: ${messages}` }
    }
    return { success: false, error: "Unknown validation error" }
  }
}

/**
 * Validates query parameters for pagination
 */
export function validatePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10")))

  return { page, limit }
}

/**
 * Validates and sanitizes string input
 */
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") {
    throw new ValidationError("Input must be a string")
  }

  const sanitized = input.trim()
  if (sanitized.length === 0) {
    throw new ValidationError("Input cannot be empty")
  }

  if (sanitized.length > maxLength) {
    throw new ValidationError(`Input must be less than ${maxLength} characters`)
  }

  return sanitized
}

/**
 * Validates date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
): {
  startDate: Date
  endDate: Date
} {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime())) {
    throw new ValidationError("Invalid start date format")
  }

  if (isNaN(end.getTime())) {
    throw new ValidationError("Invalid end date format")
  }

  if (end <= start) {
    throw new ValidationError("End date must be after start date")
  }

  return { startDate: start, endDate: end }
}

/**
 * Validates numeric range
 */
export function validateNumericRange(value: unknown, min?: number, max?: number, fieldName = "Value"): number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }

  if (min !== undefined && value < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`)
  }

  if (max !== undefined && value > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`)
  }

  return value
}

/**
 * Validates array input
 */
export function validateArray<T>(
  input: unknown,
  itemValidator: (item: unknown) => T,
  minLength = 0,
  maxLength = 1000,
  fieldName = "Array",
): T[] {
  if (!Array.isArray(input)) {
    throw new ValidationError(`${fieldName} must be an array`)
  }

  if (input.length < minLength) {
    throw new ValidationError(`${fieldName} must contain at least ${minLength} items`)
  }

  if (input.length > maxLength) {
    throw new ValidationError(`${fieldName} must contain at most ${maxLength} items`)
  }

  return input.map((item, index) => {
    try {
      return itemValidator(item)
    } catch (error) {
      throw new ValidationError(`${fieldName}[${index}]: ${error instanceof Error ? error.message : "Invalid item"}`)
    }
  })
}
