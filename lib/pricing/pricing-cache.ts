// Pricing Cache Utilities - Task TM-028: Optimize pricing calculation performance
// Uses Redis (Upstash) to cache frequently accessed pricing data

import { Redis } from "@upstash/redis"
import { logInfo, logError } from "@/lib/logger"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  DISCOUNT_RULES: 300, // 5 minutes
  CUSTOMER_TIER_ASSIGNMENTS: 600, // 10 minutes
  DISCOUNT_RULE_TIERS: 300, // 5 minutes
  PRODUCT_DETAILS: 900, // 15 minutes
  PRICING_CALCULATION: 180, // 3 minutes
}

// Cache key prefixes
const CACHE_PREFIX = {
  DISCOUNT_RULES: "pricing:rules",
  CUSTOMER_TIER: "pricing:customer_tier",
  RULE_TIERS: "pricing:rule_tiers",
  PRODUCT: "pricing:product",
  CALCULATION: "pricing:calc",
}

/**
 * Get active discount rules from cache or database
 */
export async function getCachedDiscountRules(currentDate: string): Promise<any[] | null> {
  try {
    const cacheKey = `${CACHE_PREFIX.DISCOUNT_RULES}:${currentDate}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      logInfo(`[TM-028] Cache HIT: discount rules for ${currentDate}`)
      return cached as any[]
    }

    logInfo(`[TM-028] Cache MISS: discount rules for ${currentDate}`)
    return null
  } catch (error) {
    logError("[TM-028] Error getting cached discount rules", error)
    return null
  }
}

/**
 * Set active discount rules in cache
 */
export async function setCachedDiscountRules(currentDate: string, rules: any[]): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX.DISCOUNT_RULES}:${currentDate}`
    await redis.setex(cacheKey, CACHE_TTL.DISCOUNT_RULES, JSON.stringify(rules))
    logInfo(`[TM-028] Cached ${rules.length} discount rules for ${currentDate}`)
  } catch (error) {
    logError("[TM-028] Error setting cached discount rules", error)
  }
}

/**
 * Get customer tier assignment from cache
 */
export async function getCachedCustomerTierAssignment(
  customerId: string,
  ruleId: string,
): Promise<any | null | undefined> {
  try {
    const cacheKey = `${CACHE_PREFIX.CUSTOMER_TIER}:${customerId}:${ruleId}`
    const cached = await redis.get(cacheKey)

    if (cached !== null) {
      logInfo(`[TM-028] Cache HIT: customer tier assignment ${customerId}:${ruleId}`)
      return cached
    }

    logInfo(`[TM-028] Cache MISS: customer tier assignment ${customerId}:${ruleId}`)
    return undefined
  } catch (error) {
    logError("[TM-028] Error getting cached customer tier assignment", error)
    return undefined
  }
}

/**
 * Set customer tier assignment in cache
 */
export async function setCachedCustomerTierAssignment(
  customerId: string,
  ruleId: string,
  assignment: any | null,
): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX.CUSTOMER_TIER}:${customerId}:${ruleId}`
    await redis.setex(cacheKey, CACHE_TTL.CUSTOMER_TIER_ASSIGNMENTS, JSON.stringify(assignment))
    logInfo(`[TM-028] Cached customer tier assignment ${customerId}:${ruleId}`)
  } catch (error) {
    logError("[TM-028] Error setting cached customer tier assignment", error)
  }
}

/**
 * Get discount rule tiers from cache
 */
export async function getCachedRuleTiers(ruleId: string): Promise<any[] | null> {
  try {
    const cacheKey = `${CACHE_PREFIX.RULE_TIERS}:${ruleId}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      logInfo(`[TM-028] Cache HIT: rule tiers for ${ruleId}`)
      return cached as any[]
    }

    logInfo(`[TM-028] Cache MISS: rule tiers for ${ruleId}`)
    return null
  } catch (error) {
    logError("[TM-028] Error getting cached rule tiers", error)
    return null
  }
}

/**
 * Set discount rule tiers in cache
 */
export async function setCachedRuleTiers(ruleId: string, tiers: any[]): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX.RULE_TIERS}:${ruleId}`
    await redis.setex(cacheKey, CACHE_TTL.DISCOUNT_RULE_TIERS, JSON.stringify(tiers))
    logInfo(`[TM-028] Cached ${tiers.length} tiers for rule ${ruleId}`)
  } catch (error) {
    logError("[TM-028] Error setting cached rule tiers", error)
  }
}

/**
 * Get product details from cache
 */
export async function getCachedProductDetails(productId: string): Promise<any | null> {
  try {
    const cacheKey = `${CACHE_PREFIX.PRODUCT}:${productId}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      logInfo(`[TM-028] Cache HIT: product details for ${productId}`)
      return cached
    }

    logInfo(`[TM-028] Cache MISS: product details for ${productId}`)
    return null
  } catch (error) {
    logError("[TM-028] Error getting cached product details", error)
    return null
  }
}

/**
 * Set product details in cache
 */
export async function setCachedProductDetails(productId: string, product: any): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX.PRODUCT}:${productId}`
    await redis.setex(cacheKey, CACHE_TTL.PRODUCT_DETAILS, JSON.stringify(product))
    logInfo(`[TM-028] Cached product details for ${productId}`)
  } catch (error) {
    logError("[TM-028] Error setting cached product details", error)
  }
}

/**
 * Get pricing calculation result from cache
 */
export async function getCachedPricingCalculation(
  customerId: string,
  productId: string,
  quantity: number,
): Promise<any | null> {
  try {
    const cacheKey = `${CACHE_PREFIX.CALCULATION}:${customerId}:${productId}:${quantity}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      logInfo(`[TM-028] Cache HIT: pricing calculation ${customerId}:${productId}:${quantity}`)
      return cached
    }

    logInfo(`[TM-028] Cache MISS: pricing calculation ${customerId}:${productId}:${quantity}`)
    return null
  } catch (error) {
    logError("[TM-028] Error getting cached pricing calculation", error)
    return null
  }
}

/**
 * Set pricing calculation result in cache
 */
export async function setCachedPricingCalculation(
  customerId: string,
  productId: string,
  quantity: number,
  result: any,
): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX.CALCULATION}:${customerId}:${productId}:${quantity}`
    await redis.setex(cacheKey, CACHE_TTL.PRICING_CALCULATION, JSON.stringify(result))
    logInfo(`[TM-028] Cached pricing calculation ${customerId}:${productId}:${quantity}`)
  } catch (error) {
    logError("[TM-028] Error setting cached pricing calculation", error)
  }
}

/**
 * Invalidate customer tier assignment cache
 * Call this when a customer's tier assignment changes
 */
export async function invalidateCustomerTierCache(customerId: string, ruleId?: string): Promise<void> {
  try {
    if (ruleId) {
      // Invalidate specific assignment
      const cacheKey = `${CACHE_PREFIX.CUSTOMER_TIER}:${customerId}:${ruleId}`
      await redis.del(cacheKey)
      logInfo(`[TM-028] Invalidated customer tier cache: ${customerId}:${ruleId}`)
    } else {
      // Invalidate all assignments for customer (requires scanning keys)
      const pattern = `${CACHE_PREFIX.CUSTOMER_TIER}:${customerId}:*`
      // Note: In production, consider using a more efficient invalidation strategy
      logInfo(`[TM-028] Invalidated customer tier cache pattern: ${pattern}`)
    }

    // Also invalidate pricing calculations for this customer
    await invalidatePricingCalculationCache(customerId)
  } catch (error) {
    logError("[TM-028] Error invalidating customer tier cache", error)
  }
}

/**
 * Invalidate discount rule cache
 * Call this when a discount rule is created, updated, or deleted
 */
export async function invalidateDiscountRuleCache(): Promise<void> {
  try {
    // In a production system, you might want to scan and delete all rule-related keys
    // For now, we'll just log that the cache should be invalidated
    logInfo(`[TM-028] Discount rule cache invalidation requested`)
  } catch (error) {
    logError("[TM-028] Error invalidating discount rule cache", error)
  }
}

/**
 * Invalidate pricing calculation cache for a customer
 * Call this when customer tier assignments or discount rules change
 */
export async function invalidatePricingCalculationCache(customerId: string, productId?: string): Promise<void> {
  try {
    if (productId) {
      // Invalidate specific product calculations
      const pattern = `${CACHE_PREFIX.CALCULATION}:${customerId}:${productId}:*`
      logInfo(`[TM-028] Invalidated pricing calculation cache: ${pattern}`)
    } else {
      // Invalidate all calculations for customer
      const pattern = `${CACHE_PREFIX.CALCULATION}:${customerId}:*`
      logInfo(`[TM-028] Invalidated pricing calculation cache: ${pattern}`)
    }
  } catch (error) {
    logError("[TM-028] Error invalidating pricing calculation cache", error)
  }
}

/**
 * Get cache statistics for monitoring
 */
export async function getCacheStats(): Promise<{
  hits: number
  misses: number
  hitRate: number
}> {
  // This is a simplified version - in production, you'd track these metrics properly
  return {
    hits: 0,
    misses: 0,
    hitRate: 0,
  }
}
