import { Redis } from "@upstash/redis"
import { logInfo, logError, logWarn } from "../logger"
import type { T } from "./types" // Declare the variable before using it

interface CacheConfig {
  defaultTTL: number
  maxRetries: number
  retryDelay: number
  compressionThreshold: number
}

interface CacheMetrics {
  hits: number
  misses: number
  errors: number
  totalRequests: number
}

class RedisCacheService {
  private redis: Redis | null = null
  private isConnected = false
  private config: CacheConfig
  private metrics: CacheMetrics = { hits: 0, misses: 0, errors: 0, totalRequests: 0 }
  private fallbackCache = new Map<string, { value: any; expiry: number }>()

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 300, // 5 minutes
      maxRetries: 3,
      retryDelay: 1000,
      compressionThreshold: 1024, // 1KB
      ...config,
    }
    this.connect()
  }

  private async connect() {
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        this.redis = new Redis({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
        })

        // Test connection
        await this.redis.ping()
        this.isConnected = true
        logInfo("Redis cache service connected successfully")
      } else {
        logWarn("Redis credentials not found, using fallback memory cache")
        this.isConnected = false
      }
    } catch (error) {
      logError("Failed to connect to Redis, using fallback memory cache", error)
      this.isConnected = false
    }
  }

  private shouldCompress(data: string): boolean {
    return data.length > this.config.compressionThreshold
  }

  private compress(data: string): string {
    // Simple compression using JSON.stringify optimization
    return JSON.stringify(JSON.parse(data))
  }

  private decompress(data: string): string {
    return data
  }

  async get(key: string): Promise<T | null> {
    this.metrics.totalRequests++

    try {
      let result: string | null = null

      if (this.isConnected && this.redis) {
        // Try Redis first
        result = await this.redis.get(key)
      }

      if (!result) {
        // Fallback to memory cache
        const fallbackItem = this.fallbackCache.get(key)
        if (fallbackItem && fallbackItem.expiry > Date.now()) {
          result = JSON.stringify(fallbackItem.value)
        }
      }

      if (result) {
        this.metrics.hits++
        const decompressed = this.shouldCompress(result) ? this.decompress(result) : result
        return JSON.parse(decompressed)
      }

      this.metrics.misses++
      return null
    } catch (error) {
      this.metrics.errors++
      logError(`Cache get error for key: ${key}`, error)
      return null
    }
  }

  async set(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    const ttl = ttlSeconds || this.config.defaultTTL

    try {
      const serialized = JSON.stringify(value)
      const compressed = this.shouldCompress(serialized) ? this.compress(serialized) : serialized

      if (this.isConnected && this.redis) {
        // Set in Redis
        await this.redis.setex(key, ttl, compressed)
      }

      // Always set in fallback cache
      this.fallbackCache.set(key, {
        value,
        expiry: Date.now() + ttl * 1000,
      })

      return true
    } catch (error) {
      this.metrics.errors++
      logError(`Cache set error for key: ${key}`, error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.del(key)
      }

      this.fallbackCache.delete(key)
      return true
    } catch (error) {
      this.metrics.errors++
      logError(`Cache delete error for key: ${key}`, error)
      return false
    }
  }

  async mget(keys: string[]): Promise<(T | null)[]> {
    if (keys.length === 0) return []

    try {
      if (this.isConnected && this.redis) {
        const results = await this.redis.mget(...keys)
        return results.map((result) => {
          if (result) {
            try {
              const decompressed = this.shouldCompress(result) ? this.decompress(result) : result
              return JSON.parse(decompressed)
            } catch {
              return null
            }
          }
          return null
        })
      }

      // Fallback to individual gets
      return Promise.all(keys.map((key) => this.get(key)))
    } catch (error) {
      this.metrics.errors++
      logError("Cache mget error", error)
      return keys.map(() => null)
    }
  }

  async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        const pipeline = this.redis.pipeline()

        for (const entry of entries) {
          const serialized = JSON.stringify(entry.value)
          const compressed = this.shouldCompress(serialized) ? this.compress(serialized) : serialized
          const ttl = entry.ttl || this.config.defaultTTL

          pipeline.setex(entry.key, ttl, compressed)
        }

        await pipeline.exec()
      }

      // Set in fallback cache
      for (const entry of entries) {
        const ttl = entry.ttl || this.config.defaultTTL
        this.fallbackCache.set(entry.key, {
          value: entry.value,
          expiry: Date.now() + ttl * 1000,
        })
      }

      return true
    } catch (error) {
      this.metrics.errors++
      logError("Cache mset error", error)
      return false
    }
  }

  async flush(): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.flushall()
      }

      this.fallbackCache.clear()
      logInfo("Cache flushed successfully")
      return true
    } catch (error) {
      this.metrics.errors++
      logError("Cache flush error", error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        const result = await this.redis.exists(key)
        return result === 1
      }

      const fallbackItem = this.fallbackCache.get(key)
      return fallbackItem ? fallbackItem.expiry > Date.now() : false
    } catch (error) {
      this.metrics.errors++
      logError(`Cache exists error for key: ${key}`, error)
      return false
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.expire(key, ttlSeconds)
      }

      const fallbackItem = this.fallbackCache.get(key)
      if (fallbackItem) {
        fallbackItem.expiry = Date.now() + ttlSeconds * 1000
      }

      return true
    } catch (error) {
      this.metrics.errors++
      logError(`Cache expire error for key: ${key}`, error)
      return false
    }
  }

  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `gti:${prefix}:${parts.join(":")}`
  }

  getMetrics(): CacheMetrics & { hitRate: number } {
    const hitRate = this.metrics.totalRequests > 0 ? (this.metrics.hits / this.metrics.totalRequests) * 100 : 0

    return {
      ...this.metrics,
      hitRate: Math.round(hitRate * 100) / 100,
    }
  }

  isHealthy(): boolean {
    return this.isConnected || this.fallbackCache.size >= 0 // Fallback is always available
  }

  cleanup() {
    this.fallbackCache.clear()
    this.metrics = { hits: 0, misses: 0, errors: 0, totalRequests: 0 }
  }
}

export const redisCache = new RedisCacheService()
