import { logError } from "../logger"

interface ErrorContext {
  url?: string
  userAgent?: string
  timestamp: string
  userId?: string
  sessionId?: string
  buildId?: string
  errorBoundary?: string
}

interface ErrorReport {
  message: string
  stack?: string
  type: "uncaught-exception" | "unhandled-rejection" | "error-boundary" | "manual"
  context: ErrorContext
  fingerprint: string
}

class GlobalErrorHandler {
  private isInitialized = false
  private errorQueue: ErrorReport[] = []
  private maxQueueSize = 100

  initialize() {
    if (this.isInitialized || typeof window === "undefined") {
      return
    }

    console.log("[v0] Initializing global error handler")

    // Handle uncaught JavaScript errors
    window.addEventListener("error", (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        type: "uncaught-exception",
        context: this.getErrorContext({
          errorBoundary: "window-error-handler",
        }),
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason
      this.handleError({
        message: error?.message || "Unhandled promise rejection",
        stack: error?.stack,
        type: "unhandled-rejection",
        context: this.getErrorContext({
          errorBoundary: "promise-rejection-handler",
        }),
      })
    })

    // Handle React error boundary errors
    this.setupReactErrorHandler()

    this.isInitialized = true
  }

  private setupReactErrorHandler() {
    // Monkey patch console.error to catch React error boundary logs
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const message = args.join(" ")

      // Check if this is a React error boundary error
      if (message.includes("Error boundary") || message.includes("componentDidCatch")) {
        this.handleError({
          message: "React Error Boundary triggered",
          stack: args.find((arg) => arg?.stack)?.stack,
          type: "error-boundary",
          context: this.getErrorContext({
            errorBoundary: "react-error-boundary",
          }),
        })
      }

      // Call original console.error
      originalConsoleError.apply(console, args)
    }
  }

  private getErrorContext(additional: Partial<ErrorContext> = {}): ErrorContext {
    return {
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      buildId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development",
      ...additional,
    }
  }

  private generateFingerprint(error: Omit<ErrorReport, "fingerprint">): string {
    // Create a unique fingerprint for error deduplication
    const key = `${error.type}-${error.message}-${error.stack?.split("\n")[0] || ""}`
    return btoa(key).slice(0, 16)
  }

  private handleError(errorData: Omit<ErrorReport, "fingerprint">) {
    const error: ErrorReport = {
      ...errorData,
      fingerprint: this.generateFingerprint(errorData),
    }

    // Log error locally
    logError(`Global error [${error.type}]: ${error.message}`, {
      stack: error.stack,
      context: error.context,
      fingerprint: error.fingerprint,
    })

    // Add to queue for batch reporting
    this.addToQueue(error)

    // Report immediately for critical errors
    if (error.type === "uncaught-exception") {
      this.reportError(error)
    }
  }

  private addToQueue(error: ErrorReport) {
    this.errorQueue.push(error)

    // Prevent memory leaks by limiting queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }

    // Batch report every 10 errors or after 30 seconds
    if (this.errorQueue.length >= 10) {
      this.flushQueue()
    } else {
      setTimeout(() => this.flushQueue(), 30000)
    }
  }

  private async reportError(error: ErrorReport) {
    try {
      // In a real implementation, this would send to an error reporting service
      // For now, we'll use the browser's reporting API if available
      if ("ReportingObserver" in window) {
        console.log("[v0] Would report error to external service:", error)
      }

      // Could also send to a custom endpoint
      // await fetch("/api/errors", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(error)
      // })
    } catch (reportingError) {
      console.error("[v0] Failed to report error:", reportingError)
    }
  }

  private flushQueue() {
    if (this.errorQueue.length === 0) return

    const errors = [...this.errorQueue]
    this.errorQueue = []

    // Report all queued errors
    errors.forEach((error) => this.reportError(error))
  }

  // Public method to manually report errors
  reportManualError(error: Error, context?: Partial<ErrorContext>) {
    this.handleError({
      message: error.message,
      stack: error.stack,
      type: "manual",
      context: this.getErrorContext(context),
    })
  }

  // Get error statistics
  getErrorStats() {
    return {
      queueSize: this.errorQueue.length,
      isInitialized: this.isInitialized,
    }
  }
}

export const globalErrorHandler = new GlobalErrorHandler()

// Auto-initialize in browser environment
if (typeof window !== "undefined") {
  globalErrorHandler.initialize()
}
