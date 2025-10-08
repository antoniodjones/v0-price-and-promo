// API utility functions for GTI Pricing Engine

import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, PaginatedResponse } from "./types"
import { cache } from "../cache"
import { logInfo, logError } from "../logger"
import { handleError } from "../error-handler"
import { withErrorHandling } from "../error-handler"
import { validateSchema, safeValidateSchema } from "../validation"
import { PaginationSchema, type PaginationParams } from "../schemas"
import type z from "zod"

export function createApiResponse<T>(data?: T, message?: string, success = true): ApiResponse<T> {
  try {
    return {
      success,
      data,
      message,
      ...(success ? {} : { error: message }),
    }
  } catch (error) {
    logError("Error creating API response", error)
    return {
      success: false,
      error: "Internal server error",
    } as ApiResponse<T>
  }
}

export const handleApiSuccess = createApiResponse

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string,
): PaginatedResponse<T> {
  try {
    // Validate inputs
    const validData = Array.isArray(data) ? data : []
    const validPage = Math.max(1, Number(page) || 1)
    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10))
    const validTotal = Math.max(0, Number(total) || 0)

    return {
      success: true,
      data: validData,
      message,
      pagination: {
        page: validPage,
        limit: validLimit,
        total: validTotal,
        totalPages: Math.ceil(validTotal / validLimit),
      },
    }
  } catch (error) {
    logError("Error creating paginated response", error)
    return {
      success: false,
      data: [],
      error: "Internal server error",
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    } as PaginatedResponse<T>
  }
}

export function handleApiError(error: unknown, context?: string): NextResponse {
  try {
    return handleError(error, context)
  } catch (handlerError) {
    logError("Error in handleApiError", handlerError)
    return NextResponse.json(createApiResponse(null, "Internal server error", false), { status: 500 })
  }
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  try {
    if (!data || typeof data !== "object") {
      return "Invalid data format"
    }

    if (!Array.isArray(requiredFields)) {
      return "Invalid required fields configuration"
    }

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0 && data[field] !== false) {
        return `Missing required field: ${field}`
      }
    }
    return null
  } catch (error) {
    logError("Error validating required fields", error)
    return "Validation error"
  }
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  try {
    const searchParams = request.nextUrl.searchParams
    const rawParams = {
      page: Math.max(1, Number.parseInt(searchParams.get("page") || "1") || 1),
      limit: Math.max(1, Math.min(100, Number.parseInt(searchParams.get("limit") || "10") || 10)),
    }

    return validateSchema(PaginationSchema, rawParams)
  } catch (error) {
    logError("Error getting pagination params", error)
    // Return safe defaults
    return { page: 1, limit: 10 }
  }
}

export function validateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  try {
    return validateSchema(schema, body)
  } catch (error) {
    logError("Error validating request body", error)
    throw error
  }
}

export function safeValidateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown) {
  try {
    return safeValidateSchema(schema, body)
  } catch (error) {
    logError("Error in safe validation", error)
    return { success: false, error: "Validation failed" }
  }
}

export async function withCache<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 300): Promise<T> {
  try {
    if (!key || typeof key !== "string") {
      throw new Error("Invalid cache key")
    }

    // Try to get from cache first
    const cached = await cache.get<T>(key)
    if (cached) {
      logInfo(`Cache hit for key: ${key}`)
      return cached
    }

    // Fetch fresh data
    const data = await fetcher()

    // Cache the result
    await cache.set(key, data, ttlSeconds)
    logInfo(`Cache set for key: ${key}`)

    return data
  } catch (error) {
    logError(`Cache error for key: ${key}`, error)
    // If cache fails, still try to fetch fresh data
    try {
      return await fetcher()
    } catch (fetchError) {
      logError(`Fetcher error for key: ${key}`, fetchError)
      throw fetchError
    }
  }
}

export const withApiErrorHandling = withErrorHandling
