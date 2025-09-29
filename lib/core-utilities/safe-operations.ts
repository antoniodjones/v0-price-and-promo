// Core safe operations for preventing runtime errors
// This module provides null-safe alternatives to common operations that cause crashes

export type SafeStringOptions = {
  defaultValue?: string
  trim?: boolean
  maxLength?: number
}

export type SafeNumberOptions = {
  defaultValue?: number
  min?: number
  max?: number
  allowNaN?: boolean
}

// Enhanced safe string operations
export function safeStringOperation(
  value: unknown,
  operation: "toLowerCase" | "toUpperCase" | "trim" | "toString",
  options: SafeStringOptions = {},
): string {
  const { defaultValue = "", trim = false, maxLength } = options

  let result: string

  try {
    if (value === null || value === undefined) {
      result = defaultValue
    } else {
      const stringValue = String(value)

      switch (operation) {
        case "toLowerCase":
          result = stringValue.toLowerCase()
          break
        case "toUpperCase":
          result = stringValue.toUpperCase()
          break
        case "trim":
          result = stringValue.trim()
          break
        case "toString":
        default:
          result = stringValue
          break
      }
    }

    if (trim && operation !== "trim") {
      result = result.trim()
    }

    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength)
    }

    return result
  } catch (error) {
    console.warn(`[v0] Safe string operation failed:`, error)
    return defaultValue
  }
}

// Enhanced safe number operations
export function safeNumberOperation(value: unknown, options: SafeNumberOptions = {}): number {
  const { defaultValue = 0, min, max, allowNaN = false } = options

  try {
    let result: number

    if (typeof value === "number") {
      result = value
    } else if (typeof value === "string") {
      result = Number.parseFloat(value)
    } else if (value === null || value === undefined) {
      result = defaultValue
    } else {
      result = Number.parseFloat(String(value))
    }

    if (!allowNaN && isNaN(result)) {
      result = defaultValue
    }

    if (typeof min === "number" && result < min) {
      result = min
    }

    if (typeof max === "number" && result > max) {
      result = max
    }

    return result
  } catch (error) {
    console.warn(`[v0] Safe number operation failed:`, error)
    return defaultValue
  }
}

// Safe array operations with comprehensive error handling
export function safeArrayOperation<T>(
  value: unknown,
  operation: "filter" | "map" | "find" | "length" | "slice",
  operationFn?: (item: T, index: number) => any,
  fallback: any = [],
): any {
  try {
    if (!Array.isArray(value)) {
      return operation === "length" ? 0 : fallback
    }

    switch (operation) {
      case "filter":
        return operationFn ? value.filter(operationFn) : value
      case "map":
        return operationFn ? value.map(operationFn) : value
      case "find":
        return operationFn ? value.find(operationFn) : value[0]
      case "length":
        return value.length
      case "slice":
        return value.slice()
      default:
        return value
    }
  } catch (error) {
    console.warn(`[v0] Safe array operation failed:`, error)
    return operation === "length" ? 0 : fallback
  }
}

// Safe object property access
export function safePropertyAccess<T>(obj: unknown, path: string | string[], defaultValue?: T): T | undefined {
  try {
    if (obj === null || obj === undefined || typeof obj !== "object") {
      return defaultValue
    }

    const pathArray = Array.isArray(path) ? path : path.split(".")
    let current: any = obj

    for (const key of pathArray) {
      if (current === null || current === undefined || typeof current !== "object") {
        return defaultValue
      }
      current = current[key]
    }

    return current ?? defaultValue
  } catch (error) {
    console.warn(`[v0] Safe property access failed:`, error)
    return defaultValue
  }
}

// Safe function execution with timeout
export function safeExecuteWithTimeout<T>(fn: () => T, timeoutMs: number, fallback: T, onTimeout?: () => void): T {
  try {
    let completed = false
    let result = fallback

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!completed) {
        completed = true
        if (onTimeout) onTimeout()
      }
    }, timeoutMs)

    // Execute function
    result = fn()
    completed = true
    clearTimeout(timeoutId)

    return result
  } catch (error) {
    console.warn(`[v0] Safe execute with timeout failed:`, error)
    return fallback
  }
}

// Safe DOM operations
export function safeDOMOperation<T>(operation: () => T, fallback: T, checkDocument = true): T {
  try {
    if (checkDocument && typeof document === "undefined") {
      return fallback
    }
    return operation()
  } catch (error) {
    console.warn(`[v0] Safe DOM operation failed:`, error)
    return fallback
  }
}

// Safe localStorage operations
export function safeLocalStorage(operation: "get" | "set" | "remove", key: string, value?: string): string | boolean {
  return safeDOMOperation(
    () => {
      switch (operation) {
        case "get":
          return localStorage.getItem(key) || ""
        case "set":
          if (value !== undefined) {
            localStorage.setItem(key, value)
            return true
          }
          return false
        case "remove":
          localStorage.removeItem(key)
          return true
        default:
          return false
      }
    },
    operation === "get" ? "" : false,
  )
}
