import { logDebug, logError, logInfo } from "../logger"

interface DebugSession {
  id: string
  startTime: number
  events: DebugEvent[]
  active: boolean
}

interface DebugEvent {
  timestamp: number
  type: "error" | "warning" | "info" | "user-action" | "api-call" | "render"
  message: string
  data?: any
  stackTrace?: string
}

class DebugUtils {
  private sessions = new Map<string, DebugSession>()
  private globalSession: DebugSession
  private isDebugMode = false

  constructor() {
    this.isDebugMode =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && window.location.search.includes("debug=true"))

    this.globalSession = {
      id: "global",
      startTime: Date.now(),
      events: [],
      active: true,
    }

    if (this.isDebugMode) {
      this.setupDebugMode()
    }
  }

  private setupDebugMode() {
    if (typeof window === "undefined") return // Add debug info to window for console access
    ;(window as any).__GTI_DEBUG__ = {
      getSessions: () => Array.from(this.sessions.values()),
      getGlobalSession: () => this.globalSession,
      exportDebugData: () => this.exportDebugData(),
      clearSessions: () => this.clearAllSessions(),
      toggleDebug: () => this.toggleDebugMode(),
    }

    logInfo("Debug mode enabled. Access debug utils via window.__GTI_DEBUG__")
  }

  startSession(sessionId: string): string {
    const session: DebugSession = {
      id: sessionId,
      startTime: Date.now(),
      events: [],
      active: true,
    }

    this.sessions.set(sessionId, session)
    this.addEvent("info", `Debug session started: ${sessionId}`, undefined, sessionId)

    return sessionId
  }

  endSession(sessionId: string) {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.active = false
      this.addEvent(
        "info",
        `Debug session ended: ${sessionId}`,
        {
          duration: Date.now() - session.startTime,
          eventCount: session.events.length,
        },
        sessionId,
      )
    }
  }

  addEvent(type: DebugEvent["type"], message: string, data?: any, sessionId?: string) {
    const event: DebugEvent = {
      timestamp: Date.now(),
      type,
      message,
      data,
      stackTrace: type === "error" ? new Error().stack : undefined,
    }

    // Add to global session
    this.globalSession.events.push(event)

    // Add to specific session if provided
    if (sessionId) {
      const session = this.sessions.get(sessionId)
      if (session && session.active) {
        session.events.push(event)
      }
    }

    // Prevent memory leaks
    if (this.globalSession.events.length > 1000) {
      this.globalSession.events.shift()
    }

    if (this.isDebugMode) {
      const prefix = sessionId ? `[${sessionId}]` : "[global]"
      logDebug(`${prefix} ${type.toUpperCase()}: ${message}`, data)
    }
  }

  logError(message: string, error: Error, sessionId?: string) {
    this.addEvent(
      "error",
      message,
      {
        error: error.message,
        stack: error.stack,
        name: error.name,
      },
      sessionId,
    )

    logError(message, error)
  }

  logUserAction(action: string, data?: any, sessionId?: string) {
    this.addEvent("user-action", action, data, sessionId)
  }

  logApiCall(endpoint: string, method: string, data?: any, sessionId?: string) {
    this.addEvent("api-call", `${method} ${endpoint}`, data, sessionId)
  }

  logRender(component: string, props?: any, sessionId?: string) {
    this.addEvent("render", `Rendered ${component}`, props, sessionId)
  }

  getSession(sessionId: string): DebugSession | undefined {
    return this.sessions.get(sessionId)
  }

  getRecentEvents(count = 50, sessionId?: string): DebugEvent[] {
    const session = sessionId ? this.sessions.get(sessionId) : this.globalSession
    if (!session) return []

    return session.events.slice(-count)
  }

  searchEvents(query: string, sessionId?: string): DebugEvent[] {
    const session = sessionId ? this.sessions.get(sessionId) : this.globalSession
    if (!session) return []

    const lowerQuery = query.toLowerCase()
    return session.events.filter(
      (event) =>
        event.message.toLowerCase().includes(lowerQuery) ||
        event.type.toLowerCase().includes(lowerQuery) ||
        (event.data && JSON.stringify(event.data).toLowerCase().includes(lowerQuery)),
    )
  }

  exportDebugData(sessionId?: string) {
    const session = sessionId ? this.sessions.get(sessionId) : this.globalSession
    if (!session) return null

    return {
      sessionId: session.id,
      startTime: session.startTime,
      duration: Date.now() - session.startTime,
      eventCount: session.events.length,
      events: session.events,
      summary: this.generateSessionSummary(session),
    }
  }

  private generateSessionSummary(session: DebugSession) {
    const eventsByType = session.events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const errors = session.events.filter((e) => e.type === "error")
    const userActions = session.events.filter((e) => e.type === "user-action")
    const apiCalls = session.events.filter((e) => e.type === "api-call")

    return {
      eventsByType,
      errorCount: errors.length,
      userActionCount: userActions.length,
      apiCallCount: apiCalls.length,
      mostRecentError: errors[errors.length - 1]?.message,
      sessionDuration: Date.now() - session.startTime,
    }
  }

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode
    logInfo(`Debug mode ${this.isDebugMode ? "enabled" : "disabled"}`)

    if (this.isDebugMode) {
      this.setupDebugMode()
    }
  }

  clearAllSessions() {
    this.sessions.clear()
    this.globalSession.events = []
    logInfo("All debug sessions cleared")
  }

  getDebugStats() {
    return {
      isDebugMode: this.isDebugMode,
      activeSessions: Array.from(this.sessions.values()).filter((s) => s.active).length,
      totalSessions: this.sessions.size,
      globalEventCount: this.globalSession.events.length,
      totalEvents: Array.from(this.sessions.values()).reduce(
        (sum, session) => sum + session.events.length,
        this.globalSession.events.length,
      ),
    }
  }
}

export const debugUtils = new DebugUtils()

// Convenience functions for common debug operations
export const startDebugSession = (id: string) => debugUtils.startSession(id)
export const endDebugSession = (id: string) => debugUtils.endSession(id)
export const logDebugError = (message: string, error: Error, sessionId?: string) =>
  debugUtils.logError(message, error, sessionId)
export const logUserAction = (action: string, data?: any, sessionId?: string) =>
  debugUtils.logUserAction(action, data, sessionId)
export const logApiCall = (endpoint: string, method: string, data?: any, sessionId?: string) =>
  debugUtils.logApiCall(endpoint, method, data, sessionId)
