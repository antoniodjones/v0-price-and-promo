import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(inputs.filter(Boolean).join(" "))
}

// Safe string operations to prevent toLowerCase() errors
export function safeToLowerCase(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value).toLowerCase()
}

export function safeToUpperCase(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value).toUpperCase()
}

export function safeString(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value)
}

export function safeTrim(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

// Safe array operations
export function safeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value
  return []
}

export function safeLength(value: unknown): number {
  if (value === null || value === undefined) return 0
  if (Array.isArray(value)) return value.length
  if (typeof value === "string") return value.length
  return 0
}

// Safe object operations
export function safeGet<T>(obj: unknown, key: string, defaultValue?: T): T | undefined {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return defaultValue
  }
  return (obj as any)[key] ?? defaultValue
}

// Currency formatting (consolidating multiple inline implementations)
export function formatCurrency(value: unknown, currency = "USD"): string {
  const numValue = typeof value === "number" ? value : Number.parseFloat(String(value || 0))
  if (isNaN(numValue)) return "$0.00"

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(numValue)
  } catch (error) {
    // Fallback for invalid currency codes
    return `$${numValue.toFixed(2)}`
  }
}

// Percentage formatting
export function formatPercentage(value: unknown, decimals = 1): string {
  const numValue = typeof value === "number" ? value : Number.parseFloat(String(value || 0))
  if (isNaN(numValue)) return "0%"
  return `${numValue.toFixed(decimals)}%`
}

// Safe number operations
export function safeNumber(value: unknown, defaultValue = 0): number {
  if (typeof value === "number" && !isNaN(value)) return value
  const parsed = Number.parseFloat(String(value || defaultValue))
  return isNaN(parsed) ? defaultValue : parsed
}

// Safe search filtering
export function createSearchFilter(searchTerm: string) {
  const safeTerm = safeToLowerCase(searchTerm)
  return <T extends Record<string, any>>(item: T, fields: (keyof T)[]): boolean => {
    if (!safeTerm) return true
    return fields.some((field) => safeToLowerCase(item[field]).includes(safeTerm))
  }
}

// Safe date operations
export function safeDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }
  return null
}

export function formatDate(value: unknown, options?: Intl.DateTimeFormatOptions): string {
  const date = safeDate(value)
  if (!date) return ""

  try {
    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    return date.toISOString().split("T")[0]
  }
}

// Safe ID generation for form fields
export function generateSafeId(prefix: string, value: unknown): string {
  const safeValue = safeString(value)
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return `${prefix}-${safeValue || "unknown"}`
}

// Debounce utility for search inputs
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Safe JSON operations
export function safeJsonParse<T>(value: unknown, defaultValue?: T): T | null {
  if (typeof value !== "string") return defaultValue ?? null

  try {
    return JSON.parse(value)
  } catch (error) {
    return defaultValue ?? null
  }
}

export function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch (error) {
    return ""
  }
}

// Validation helpers
export function isValidEmail(email: unknown): boolean {
  const emailStr = safeString(email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailStr)
}

export function isValidUrl(url: unknown): boolean {
  const urlStr = safeString(url)
  try {
    new URL(urlStr)
    return true
  } catch {
    return false
  }
}

// Error handling utilities
export function safeExecute<T>(fn: () => T, fallback: T, onError?: (error: unknown) => void): T {
  try {
    return fn()
  } catch (error) {
    if (onError) onError(error)
    return fallback
  }
}

export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  onError?: (error: unknown) => void,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (onError) onError(error)
    return fallback
  }
}
