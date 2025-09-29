import { logInfo } from "../logger"

interface ErrorMetric {
  errorId: string
  message: string
  stack?: string
  timestamp: number
  url: string
  userAgent: string
  userId?: string
  sessionId?: string
  resolved: boolean
  recoveryAttempts: number
  tags: string[]
}

class ErrorMetricsCollector {
  private metrics: ErrorMetric[] = []
  private maxMetrics = 1000
  private reportingInterval = 60000 // 1 minute

  constructor() {
    this.startPeriodicReporting()
  }

  recordError(error: {
    errorId: string
    message: string
    stack?: string
    userId?: string
    sessionId?: string
    tags?: string[]
  }) {
    const metric: ErrorMetric = {
      errorId: error.errorId,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "unknown",
      userId: error.userId,
      sessionId: error.sessionId,
      resolved: false,
      recoveryAttempts: 0,
      tags: error.tags || [],
    }

    this.metrics.push(metric)

    // Prevent memory leaks
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    logInfo("Error metric recorded", { errorId: error.errorId, message: error.message })
  }

  markResolved(errorId: string, recoveryAttempts = 0) {
    const metric = this.metrics.find((m) => m.errorId === errorId)
    if (metric) {
      metric.resolved = true
      metric.recoveryAttempts = recoveryAttempts
      logInfo("Error marked as resolved", { errorId, recoveryAttempts })
    }
  }

  getMetrics(filters?: {
    resolved?: boolean
    timeRange?: { start: number; end: number }
    userId?: string
    tags?: string[]
  }) {
    let filtered = [...this.metrics]

    if (filters) {
      if (filters.resolved !== undefined) {
        filtered = filtered.filter((m) => m.resolved === filters.resolved)
      }

      if (filters.timeRange) {
        filtered = filtered.filter(
          (m) => m.timestamp >= filters.timeRange!.start && m.timestamp <= filters.timeRange!.end,
        )
      }

      if (filters.userId) {
        filtered = filtered.filter((m) => m.userId === filters.userId)
      }

      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter((m) => filters.tags!.some((tag) => m.tags.includes(tag)))
      }
    }

    return filtered
  }

  getErrorStats() {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    const oneDay = 24 * oneHour

    const recentErrors = this.metrics.filter((m) => now - m.timestamp < oneHour)
    const dailyErrors = this.metrics.filter((m) => now - m.timestamp < oneDay)

    const errorsByType = this.metrics.reduce(
      (acc, metric) => {
        const type = this.categorizeError(metric.message)
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const resolutionRate =
      this.metrics.length > 0 ? (this.metrics.filter((m) => m.resolved).length / this.metrics.length) * 100 : 0

    return {
      total: this.metrics.length,
      recentHour: recentErrors.length,
      dailyTotal: dailyErrors.length,
      resolved: this.metrics.filter((m) => m.resolved).length,
      unresolved: this.metrics.filter((m) => !m.resolved).length,
      resolutionRate: Math.round(resolutionRate),
      errorsByType,
      averageRecoveryAttempts:
        this.metrics.length > 0
          ? this.metrics.reduce((sum, m) => sum + m.recoveryAttempts, 0) / this.metrics.length
          : 0,
    }
  }

  private categorizeError(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
      return "network"
    }
    if (lowerMessage.includes("database") || lowerMessage.includes("sql")) {
      return "database"
    }
    if (lowerMessage.includes("auth") || lowerMessage.includes("unauthorized")) {
      return "authentication"
    }
    if (lowerMessage.includes("validation") || lowerMessage.includes("invalid")) {
      return "validation"
    }
    if (lowerMessage.includes("memory") || lowerMessage.includes("heap")) {
      return "memory"
    }

    return "unknown"
  }

  private startPeriodicReporting() {
    if (typeof window === "undefined") return

    setInterval(() => {
      const stats = this.getErrorStats()
      if (stats.total > 0) {
        logInfo("Periodic error metrics report", stats)

        // In a real implementation, send to analytics service
        console.log("[v0] Error metrics report:", stats)
      }
    }, this.reportingInterval)
  }

  exportMetrics() {
    return {
      timestamp: Date.now(),
      stats: this.getErrorStats(),
      recentErrors: this.getMetrics({
        timeRange: {
          start: Date.now() - 60 * 60 * 1000, // Last hour
          end: Date.now(),
        },
      }).map((m) => ({
        errorId: m.errorId,
        message: m.message,
        timestamp: m.timestamp,
        resolved: m.resolved,
        recoveryAttempts: m.recoveryAttempts,
        tags: m.tags,
      })),
    }
  }

  clearMetrics() {
    this.metrics = []
    logInfo("Error metrics cleared")
  }
}

export const errorMetricsCollector = new ErrorMetricsCollector()
