import { NextResponse } from "next/server"
import { logError } from "./logger"

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

function createErrorResponse(message: string, success = false) {
  return {
    success,
    error: message,
    data: null,
  }
}

export function handleError(error: unknown, context?: string): NextResponse {
  // Log the error with context
  logError(`Error in ${context || "unknown context"}`, error)

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(createErrorResponse(error.message), { status: error.statusCode })
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as any

    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(createErrorResponse("A record with this data already exists"), {
          status: 409,
        })
      case "P2025":
        return NextResponse.json(createErrorResponse("Record not found"), { status: 404 })
      case "P2003":
        return NextResponse.json(createErrorResponse("Foreign key constraint failed"), { status: 400 })
      default:
        logError("Unhandled Prisma error", prismaError)
    }
  }

  // Handle validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as any
    const message = zodError.issues.map((issue: any) => issue.message).join(", ")
    return NextResponse.json(createErrorResponse(`Validation error: ${message}`), { status: 400 })
  }

  // Default error response
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Unknown error"

  return NextResponse.json(createErrorResponse(message), { status: 500 })
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
