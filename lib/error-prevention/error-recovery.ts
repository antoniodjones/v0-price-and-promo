import { logError, logInfo } from "../logger"

interface RecoveryStrategy {
  name: string
  condition: (error: Error) => boolean
  recover: (error: Error) => Promise<boolean>
  maxAttempts: number
}

class ErrorRecoveryManager {
  private strategies: RecoveryStrategy[] = []
  private recoveryAttempts = new Map<string, number>()

  constructor() {
    this.registerDefaultStrategies()
  }

  private registerDefaultStrategies() {
    // Network error recovery
    this.addStrategy({
      name: "network-retry",
      condition: (error) =>
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Failed to fetch"),
      recover: async (error) => {
        logInfo("Attempting network error recovery", { error: error.message })
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return true // Allow retry
      },
      maxAttempts: 3,
    })

    // Database connection recovery
    this.addStrategy({
      name: "database-reconnect",
      condition: (error) =>
        error.message.includes("database") ||
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED"),
      recover: async (error) => {
        logInfo("Attempting database reconnection", { error: error.message })
        // In a real app, this would attempt to reconnect to the database
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return true
      },
      maxAttempts: 2,
    })

    // Authentication error recovery
    this.addStrategy({
      name: "auth-refresh",
      condition: (error) =>
        error.message.includes("unauthorized") || error.message.includes("401") || error.message.includes("token"),
      recover: async (error) => {
        logInfo("Attempting auth token refresh", { error: error.message })
        // In a real app, this would refresh the auth token
        if (typeof window !== "undefined") {
          // Could trigger auth refresh here
          console.log("[v0] Would refresh auth token")
        }
        return false // Don't retry, redirect to login instead
      },
      maxAttempts: 1,
    })

    // Memory cleanup recovery
    this.addStrategy({
      name: "memory-cleanup",
      condition: (error) =>
        error.message.includes("memory") || error.message.includes("heap") || error.name === "RangeError",
      recover: async (error) => {
        logInfo("Attempting memory cleanup", { error: error.message })

        if (typeof window !== "undefined") {
          // Clear caches and force garbage collection
          if ("caches" in window) {
            const cacheNames = await caches.keys()
            await Promise.all(cacheNames.map((name) => caches.delete(name)))
          }

          // Clear localStorage of non-essential items
          const essentialKeys = ["gti-ui-theme", "auth-token"]
          Object.keys(localStorage).forEach((key) => {
            if (!essentialKeys.includes(key)) {
              localStorage.removeItem(key)
            }
          })
        }

        return true
      },
      maxAttempts: 1,
    })
  }

  addStrategy(strategy: RecoveryStrategy) {
    this.strategies.push(strategy)
  }

  async attemptRecovery(error: Error): Promise<boolean> {
    const applicableStrategies = this.strategies.filter((s) => s.condition(error))

    if (applicableStrategies.length === 0) {
      logError("No recovery strategy found for error", error)
      return false
    }

    for (const strategy of applicableStrategies) {
      const attemptKey = `${strategy.name}-${error.message}`
      const currentAttempts = this.recoveryAttempts.get(attemptKey) || 0

      if (currentAttempts >= strategy.maxAttempts) {
        logError(`Max recovery attempts exceeded for strategy: ${strategy.name}`, error)
        continue
      }

      try {
        this.recoveryAttempts.set(attemptKey, currentAttempts + 1)
        const recovered = await strategy.recover(error)

        if (recovered) {
          logInfo(`Error recovery successful using strategy: ${strategy.name}`)
          // Reset attempt counter on success
          this.recoveryAttempts.delete(attemptKey)
          return true
        }
      } catch (recoveryError) {
        logError(`Recovery strategy ${strategy.name} failed`, recoveryError)
      }
    }

    return false
  }

  clearAttempts() {
    this.recoveryAttempts.clear()
  }

  getRecoveryStats() {
    return {
      strategies: this.strategies.length,
      activeAttempts: this.recoveryAttempts.size,
      attempts: Object.fromEntries(this.recoveryAttempts),
    }
  }
}

export const errorRecoveryManager = new ErrorRecoveryManager()
