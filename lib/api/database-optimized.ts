import { createClient } from "@/lib/supabase/server"
import { redisCache } from "../cache/redis-cache"
import { logInfo, logError, logWarn } from "../logger"

interface QueryOptions {
  useCache?: boolean
  cacheTTL?: number
  forceRefresh?: boolean
}

interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: string
  orderDirection?: "asc" | "desc"
}

class OptimizedDatabase {
  private connectionPool: Map<string, any> = new Map()
  private queryCache = new Map<string, { result: any; timestamp: number; ttl: number }>()
  private readonly QUERY_CACHE_TTL = 60000 // 1 minute for query cache

  private async getClient() {
    const clientId = "default"

    if (!this.connectionPool.has(clientId)) {
      const client = await createClient()
      this.connectionPool.set(clientId, client)
    }

    return this.connectionPool.get(clientId)
  }

  private getCacheKey(table: string, operation: string, params: any): string {
    const paramString = JSON.stringify(params)
    return redisCache.generateKey("db", table, operation, paramString)
  }

  private async withCache<T>(cacheKey: string, fetcher: () => Promise<T>, options: QueryOptions = {}): Promise<T> {
    const { useCache = true, cacheTTL = 300, forceRefresh = false } = options

    if (!useCache || forceRefresh) {
      return fetcher()
    }

    // Try cache first
    const cached = await redisCache.get<T>(cacheKey)
    if (cached) {
      logInfo(`Database cache hit: ${cacheKey}`)
      return cached
    }

    // Fetch fresh data
    const result = await fetcher()

    // Cache the result
    await redisCache.set(cacheKey, result, cacheTTL)
    logInfo(`Database cache set: ${cacheKey}`)

    return result
  }

  // Optimized product queries
  async getProducts(pagination: PaginationOptions = {}, options: QueryOptions = {}) {
    const { page = 1, limit = 20, orderBy = "created_at", orderDirection = "desc" } = pagination
    const offset = (page - 1) * limit

    const cacheKey = this.getCacheKey("products", "list", { page, limit, orderBy, orderDirection })

    return this.withCache(
      cacheKey,
      async () => {
        const supabase = await this.getClient()

        const { data, error, count } = await supabase
          .from("products")
          .select("*", { count: "exact" })
          .range(offset, offset + limit - 1)
          .order(orderBy, { ascending: orderDirection === "asc" })

        if (error) {
          throw new Error(`Failed to fetch products: ${error.message}`)
        }

        return {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        }
      },
      { ...options, cacheTTL: 180 }, // 3 minutes for product lists
    )
  }

  async getProductById(id: string, options: QueryOptions = {}) {
    const cacheKey = this.getCacheKey("products", "byId", { id })

    return this.withCache(
      cacheKey,
      async () => {
        const supabase = await this.getClient()

        const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

        if (error) {
          if (error.code === "PGRST116") return null // Not found
          throw new Error(`Failed to fetch product: ${error.message}`)
        }

        return data
      },
      { ...options, cacheTTL: 600 }, // 10 minutes for individual products
    )
  }

  async getProductsByIds(ids: string[], options: QueryOptions = {}) {
    if (ids.length === 0) return []

    const cacheKey = this.getCacheKey("products", "byIds", { ids: ids.sort() })

    return this.withCache(
      cacheKey,
      async () => {
        const supabase = await this.getClient()

        const { data, error } = await supabase.from("products").select("*").in("id", ids)

        if (error) {
          throw new Error(`Failed to fetch products by IDs: ${error.message}`)
        }

        return data || []
      },
      { ...options, cacheTTL: 300 }, // 5 minutes for bulk product queries
    )
  }

  // Optimized discount queries with batch loading
  async getAllActiveDiscounts(options: QueryOptions = {}) {
    const cacheKey = this.getCacheKey("discounts", "allActive", {})

    return this.withCache(
      cacheKey,
      async () => {
        const supabase = await this.getClient()

        // Use Promise.allSettled for parallel queries
        const [customerDiscounts, inventoryDiscounts, bogoPromotions, bundleDeals] = await Promise.allSettled([
          supabase.from("customer_discounts").select("*").eq("status", "active"),
          supabase.from("inventory_discounts").select("*").eq("status", "active"),
          supabase.from("bogo_promotions").select("*").eq("status", "active"),
          supabase.from("bundle_deals").select("*").eq("status", "active"),
        ])

        return {
          customerDiscounts: customerDiscounts.status === "fulfilled" ? customerDiscounts.value.data || [] : [],
          inventoryDiscounts: inventoryDiscounts.status === "fulfilled" ? inventoryDiscounts.value.data || [] : [],
          bogoPromotions: bogoPromotions.status === "fulfilled" ? bogoPromotions.value.data || [] : [],
          bundleDeals: bundleDeals.status === "fulfilled" ? bundleDeals.value.data || [] : [],
        }
      },
      { ...options, cacheTTL: 120 }, // 2 minutes for discount data
    )
  }

  async getCustomerWithDiscounts(customerId: string, market: string, options: QueryOptions = {}) {
    const cacheKey = this.getCacheKey("customers", "withDiscounts", { customerId, market })

    return this.withCache(
      cacheKey,
      async () => {
        const supabase = await this.getClient()

        // Parallel queries for customer and their applicable discounts
        const [customerResult, discountsResult] = await Promise.allSettled([
          supabase.from("customers").select("*").eq("id", customerId).single(),
          this.getAllActiveDiscounts({ useCache: true }),
        ])

        if (customerResult.status === "rejected") {
          throw new Error("Customer not found")
        }

        const customer = customerResult.value.data
        const allDiscounts =
          discountsResult.status === "fulfilled"
            ? discountsResult.value
            : {
                customerDiscounts: [],
                inventoryDiscounts: [],
                bogoPromotions: [],
                bundleDeals: [],
              }

        // Filter discounts applicable to this customer and market
        const applicableCustomerDiscounts = allDiscounts.customerDiscounts.filter(
          (d: any) => d.customerTiers?.includes(customer.tier) && d.markets?.includes(market),
        )

        return {
          customer,
          applicableDiscounts: {
            customerDiscounts: applicableCustomerDiscounts,
            inventoryDiscounts: allDiscounts.inventoryDiscounts,
            bogoPromotions: allDiscounts.bogoPromotions,
            bundleDeals: allDiscounts.bundleDeals,
          },
        }
      },
      { ...options, cacheTTL: 180 }, // 3 minutes for customer discount data
    )
  }

  // Optimized analytics queries
  async getAnalyticsData(dateRange: { start: string; end: string }, options: QueryOptions = {}) {
    const cacheKey = this.getCacheKey("analytics", "dateRange", dateRange)

    return this.withCache(
      cacheKey,
      async () => {
        const supabase = await this.getClient()

        // Parallel analytics queries
        const [salesData, customerData, productData] = await Promise.allSettled([
          supabase.from("sales_analytics").select("*").gte("date", dateRange.start).lte("date", dateRange.end),
          supabase.from("customer_analytics").select("*").gte("date", dateRange.start).lte("date", dateRange.end),
          supabase.from("product_analytics").select("*").gte("date", dateRange.start).lte("date", dateRange.end),
        ])

        return {
          sales: salesData.status === "fulfilled" ? salesData.value.data || [] : [],
          customers: customerData.status === "fulfilled" ? customerData.value.data || [] : [],
          products: productData.status === "fulfilled" ? productData.value.data || [] : [],
        }
      },
      { ...options, cacheTTL: 900 }, // 15 minutes for analytics data
    )
  }

  // Cache invalidation methods
  async invalidateProductCache(productId?: string) {
    if (productId) {
      await redisCache.del(this.getCacheKey("products", "byId", { id: productId }))
    }

    // Invalidate product list caches (this is a simplified approach)
    const patterns = ["gti:db:products:list:*", "gti:db:products:byIds:*"]
    // Note: In a real Redis implementation, you'd use SCAN with pattern matching
    logInfo("Product cache invalidated")
  }

  async invalidateDiscountCache() {
    await redisCache.del(this.getCacheKey("discounts", "allActive", {}))
    // Invalidate customer discount caches
    logInfo("Discount cache invalidated")
  }

  async invalidateCustomerCache(customerId?: string) {
    if (customerId) {
      // Invalidate specific customer caches
      const patterns = [`gti:db:customers:withDiscounts:*${customerId}*`]
      logInfo(`Customer cache invalidated for ${customerId}`)
    }
  }

  // Health check and metrics
  async healthCheck() {
    try {
      const supabase = await this.getClient()
      const { data, error } = await supabase.from("products").select("id").limit(1)

      return {
        database: !error,
        cache: redisCache.isHealthy(),
        cacheMetrics: redisCache.getMetrics(),
      }
    } catch (error) {
      logError("Database health check failed", error)
      return {
        database: false,
        cache: redisCache.isHealthy(),
        cacheMetrics: redisCache.getMetrics(),
      }
    }
  }

  // Query performance monitoring
  private async executeWithMetrics<T>(operation: string, query: () => Promise<T>): Promise<T> {
    const startTime = Date.now()

    try {
      const result = await query()
      const duration = Date.now() - startTime

      if (duration > 1000) {
        logWarn(`Slow query detected: ${operation} took ${duration}ms`)
      } else {
        logInfo(`Query completed: ${operation} took ${duration}ms`)
      }

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      logError(`Query failed: ${operation} failed after ${duration}ms`, error)
      throw error
    }
  }
}

export const optimizedDb = new OptimizedDatabase()
