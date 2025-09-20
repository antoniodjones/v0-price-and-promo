// API utility functions for GTI Pricing Engine

import type { NextRequest, NextResponse } from "next/server"
import type { ApiResponse, PaginatedResponse } from "./types"
import { cache } from "../cache"
import { logInfo } from "../logger"
import { handleError } from "../error-handler"
import { withErrorHandling } from "./error-handler" // Declare the variable before using it
import { validateSchema, safeValidateSchema } from "../validation"
import { PaginationSchema, type PaginationParams } from "../schemas"
import type z from "zod"

export function createApiResponse<T>(data?: T, message?: string, success = true): ApiResponse<T> {
  return {
    success,
    data,
    message,
    ...(success ? {} : { error: message }),
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string,
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export function handleApiError(error: unknown, context?: string): NextResponse {
  return handleError(error, context)
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `Missing required field: ${field}`
    }
  }
  return null
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams
  const rawParams = {
    page: Number.parseInt(searchParams.get("page") || "1"),
    limit: Number.parseInt(searchParams.get("limit") || "10"),
  }

  return validateSchema(PaginationSchema, rawParams)
}

export function validateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  return validateSchema(schema, body)
}

export function safeValidateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown) {
  return safeValidateSchema(schema, body)
}

export async function withCache<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 300): Promise<T> {
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
}

export const withApiErrorHandling = withErrorHandling
