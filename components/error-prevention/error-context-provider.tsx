"use client"

import React, { createContext, useContext, useCallback, useRef } from "react"
import { globalErrorHandler } from "@/lib/error-prevention/global-error-handler"

interface ErrorContextData {
  userId?: string
  sessionId?: string
  currentPage?: string
  userActions: string[]
  breadcrumbs: Array<{
    timestamp: string
    message: string
    level: "info" | "warn" | "error"
    category?: string
  }>
}

interface ErrorContextValue {
  addBreadcrumb: (message: string, level?: "info" | "warn" | "error", category?: string) => void
  setUserId: (userId: string) => void
  setSessionId: (sessionId: string) => void
  recordUserAction: (action: string) => void
  getContext: () => ErrorContextData
  reportError: (error: Error, additionalContext?: Record<string, any>) => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

export function ErrorContextProvider({ children }: { children: React.ReactNode }) {
  const contextRef = useRef<ErrorContextData>({
    userActions: [],
    breadcrumbs: [],
  })

  const addBreadcrumb = useCallback((message: string, level: "info" | "warn" | "error" = "info", category?: string) => {
    const breadcrumb = {
      timestamp: new Date().toISOString(),
      message,
      level,
      category,
    }

    contextRef.current.breadcrumbs.push(breadcrumb)

    // Keep only last 50 breadcrumbs to prevent memory issues
    if (contextRef.current.breadcrumbs.length > 50) {
      contextRef.current.breadcrumbs.shift()
    }

    console.log(`[v0] Breadcrumb [${level}]: ${message}`, category ? { category } : undefined)
  }, [])

  const setUserId = useCallback(
    (userId: string) => {
      contextRef.current.userId = userId
      addBreadcrumb(`User identified: ${userId}`, "info", "auth")
    },
    [addBreadcrumb],
  )

  const setSessionId = useCallback(
    (sessionId: string) => {
      contextRef.current.sessionId = sessionId
      addBreadcrumb(`Session started: ${sessionId}`, "info", "session")
    },
    [addBreadcrumb],
  )

  const recordUserAction = useCallback(
    (action: string) => {
      const timestamp = new Date().toISOString()
      const actionWithTimestamp = `${timestamp}: ${action}`

      contextRef.current.userActions.push(actionWithTimestamp)

      // Keep only last 20 actions
      if (contextRef.current.userActions.length > 20) {
        contextRef.current.userActions.shift()
      }

      addBreadcrumb(`User action: ${action}`, "info", "user-action")
    },
    [addBreadcrumb],
  )

  const getContext = useCallback(() => {
    return { ...contextRef.current }
  }, [])

  const reportError = useCallback(
    (error: Error, additionalContext?: Record<string, any>) => {
      const context = getContext()
      globalErrorHandler.reportManualError(error, {
        userId: context.userId,
        sessionId: context.sessionId,
        ...additionalContext,
        breadcrumbs: JSON.stringify(context.breadcrumbs.slice(-10)), // Last 10 breadcrumbs
        userActions: JSON.stringify(context.userActions.slice(-5)), // Last 5 actions
      })
    },
    [getContext],
  )

  // Track page changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPage = window.location.pathname
      contextRef.current.currentPage = currentPage
      addBreadcrumb(`Page loaded: ${currentPage}`, "info", "navigation")
    }
  }, [addBreadcrumb])

  const value: ErrorContextValue = {
    addBreadcrumb,
    setUserId,
    setSessionId,
    recordUserAction,
    getContext,
    reportError,
  }

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

export function useErrorContext() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorContextProvider")
  }
  return context
}

// Hook for easy error reporting with context
export function useErrorReporting() {
  const errorContext = useErrorContext()

  return {
    reportError: errorContext.reportError,
    addBreadcrumb: errorContext.addBreadcrumb,
    recordAction: errorContext.recordUserAction,
  }
}
