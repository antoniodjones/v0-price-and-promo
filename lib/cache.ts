import { logInfo, logError } from "./logger"

interface CacheItem {
  value: any
  expiry: number
}

class CacheService {
  private memoryCache = new Map<string, CacheItem>()
  private isConnected = false
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.connect()
    this.startCleanup()
  }

  private async connect() {
    try {
      this.isConnected = true
      logInfo("Cache service initialized (in-memory mode)")
    } catch (error) {
      logError("Failed to initialize cache service", error)
    }
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(
      () => {
        const now = Date.now()
        for (const [key, item] of this.memoryCache.entries()) {
          if (item.expiry < now) {
            this.memoryCache.delete(key)
          }
        }
      },
      5 * 60 * 1000,
    )
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      return null
    }

    try {
      const item = this.memoryCache.get(key)
      if (!item) {
        return null
      }

      if (item.expiry < Date.now()) {
        this.memoryCache.delete(key)
        return null
      }

      return item.value
    } catch (error) {
      logError(`Cache get error for key: ${key}`, error)
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<boolean> {
    if (!this.isConnected) {
      return false
    }

    try {
      const expiry = Date.now() + ttlSeconds * 1000
      this.memoryCache.set(key, { value, expiry })
      return true
    } catch (error) {
      logError(`Cache set error for key: ${key}`, error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false
    }

    try {
      this.memoryCache.delete(key)
      return true
    } catch (error) {
      logError(`Cache delete error for key: ${key}`, error)
      return false
    }
  }

  async flush(): Promise<boolean> {
    if (!this.isConnected) {
      return false
    }

    try {
      this.memoryCache.clear()
      logInfo("Cache flushed successfully")
      return true
    } catch (error) {
      logError("Cache flush error", error)
      return false
    }
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return `gti:${prefix}:${parts.join(":")}`
  }

  isHealthy(): boolean {
    return this.isConnected
  }

  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.memoryCache.clear()
  }
}

export const cache = new CacheService()
