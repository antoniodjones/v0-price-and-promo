import type { ApiResponse } from "@/lib/api/types"

/**
 * Enhanced fetch utility that handles JSON parsing errors gracefully
 * and provides consistent error handling across the application.
 */

export class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message)
    this.name = "FetchError"
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number
}

/**
 * Safe fetch wrapper that handles both JSON and non-JSON responses
 * @param url - The URL to fetch
 * @param options - Fetch options with optional timeout
 * @returns Parsed JSON response
 * @throws FetchError with proper error message
 */
export async function safeFetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle non-OK responses
    if (!response.ok) {
      // Try to parse as JSON first
      const contentType = response.headers.get("content-type")
      let errorMessage = `Request failed with status ${response.status}`

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // If JSON parsing fails, try text
          const text = await response.text()
          errorMessage = text || errorMessage
        }
      } else {
        // Not JSON, get text
        const text = await response.text()
        errorMessage = text || errorMessage
      }

      throw new FetchError(errorMessage, response.status, response)
    }

    // Parse successful response
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return await response.json()
    }

    // If not JSON, return text as fallback
    const text = await response.text()
    return text as T
  } catch (error) {
    clearTimeout(timeoutId)

    // Handle abort/timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchError("Request timeout", 408)
    }

    // Re-throw FetchError as-is
    if (error instanceof FetchError) {
      throw error
    }

    // Handle other errors
    throw new FetchError(error instanceof Error ? error.message : "Network error", 0)
  }
}

/**
 * Typed API fetch that expects ApiResponse format
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns The data from ApiResponse.data
 * @throws FetchError if request fails or success is false
 */
export async function apiFetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  const response = await safeFetch<ApiResponse<T>>(url, options)

  if (!response.success) {
    throw new FetchError(response.error || response.message || "API request failed", 400)
  }

  return response.data as T
}

/**
 * POST request helper with JSON body
 */
export async function apiPost<T = any>(url: string, data: any, options: FetchOptions = {}): Promise<T> {
  return apiFetch<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  })
}

/**
 * PUT request helper with JSON body
 */
export async function apiPut<T = any>(url: string, data: any, options: FetchOptions = {}): Promise<T> {
  return apiFetch<T>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  return apiFetch<T>(url, {
    method: "DELETE",
    ...options,
  })
}

/**
 * GET request helper (alias for apiFetch)
 */
export async function apiGet<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  return apiFetch<T>(url, options)
}
