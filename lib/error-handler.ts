import { NextResponse } from "next/server"
import { logError } from "./logger"
import { createApiResponse } from "./api/utils"

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403)
  }
}

export function handleError(error: unknown, context?: string): NextResponse {
  // Log the error with context
  logError(`Error in ${context || "unknown context"}`, error)

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(createApiResponse(null, error.message, false), { status: error.statusCode })
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as any

    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(createApiResponse(null, "A record with this data already exists", false), {
          status: 409,
        })
      case "P2025":
        return NextResponse.json(createApiResponse(null, "Record not found", false), { status: 404 })
      case "P2003":
        return NextResponse.json(createApiResponse(null, "Foreign key constraint failed", false), { status: 400 })
      default:
        logError("Unhandled Prisma error", prismaError)
    }
  }

  // Handle validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as any
    const message = zodError.issues.map((issue: any) => issue.message).join(", ")
    return NextResponse.json(createApiResponse(null, `Validation error: ${message}`, false), { status: 400 })
  }

  // Default error response
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Unknown error"

  return NextResponse.json(createApiResponse(null, message, false), { status: 500 })
}

// Async error wrapper for API routes
export function withErrorHandling<T extends any[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const result = await handler(...args)
      return result instanceof NextResponse ? result : NextResponse.json(result)
    } catch (error) {
      return handleError(error, handler.name)
    }
  }
}
