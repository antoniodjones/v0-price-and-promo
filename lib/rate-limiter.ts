import type { NextRequest } from "next/server"
import { cache } from "./cache"
import { logWarn } from "./logger"

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async isAllowed(req: NextRequest): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req)
    const cacheKey = cache.generateKey("rate-limit", key)

    const now = Date.now()
    const windowStart = Math.floor(now / this.config.windowMs) * this.config.windowMs
    const windowKey = `${cacheKey}:${windowStart}`

    try {
      const currentCount = (await cache.get<number>(windowKey)) || 0

      if (currentCount >= this.config.maxRequests) {
        logWarn(`Rate limit exceeded for key: ${key}`, {
          currentCount,
          maxRequests: this.config.maxRequests,
          ip: this.getClientIP(req),
        })

        return {
          allowed: false,
          remaining: 0,
          resetTime: windowStart + this.config.windowMs,
        }
      }

      // Increment counter
      await cache.set(windowKey, currentCount + 1, Math.ceil(this.config.windowMs / 1000))

      return {
        allowed: true,
        remaining: this.config.maxRequests - currentCount - 1,
        resetTime: windowStart + this.config.windowMs,
      }
    } catch (error) {
      // If cache fails, allow the request (fail open)
      logWarn("Rate limiter cache error, allowing request", error)
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: windowStart + this.config.windowMs,
      }
    }
  }

  private getDefaultKey(req: NextRequest): string {
    return this.getClientIP(req)
  }

  private getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for")
    const realIP = req.headers.get("x-real-ip")

    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    if (realIP) {
      return realIP
    }

    return "unknown"
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
})

export const pricingRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 pricing calculations per minute
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
})
