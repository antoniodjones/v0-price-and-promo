import { logWarn } from "../logger"

interface QueryPlan {
  query: string
  estimatedCost: number
  suggestedIndexes: string[]
  optimizations: string[]
}

interface PerformanceMetrics {
  queryCount: number
  averageResponseTime: number
  slowQueries: Array<{
    query: string
    duration: number
    timestamp: Date
  }>
  cacheHitRate: number
}

class QueryOptimizer {
  private metrics: PerformanceMetrics = {
    queryCount: 0,
    averageResponseTime: 0,
    slowQueries: [],
    cacheHitRate: 0,
  }

  private queryTimes: number[] = []
  private readonly SLOW_QUERY_THRESHOLD = 1000 // 1 second
  private readonly MAX_SLOW_QUERIES = 100

  analyzeQuery(query: string): QueryPlan {
    const plan: QueryPlan = {
      query,
      estimatedCost: 0,
      suggestedIndexes: [],
      optimizations: [],
    }

    // Analyze SELECT queries
    if (query.toLowerCase().includes("select")) {
      // Check for missing WHERE clauses on large tables
      if (this.isLargeTableQuery(query) && !query.toLowerCase().includes("where")) {
        plan.optimizations.push("Consider adding WHERE clause to limit results")
        plan.estimatedCost += 50
      }

      // Check for SELECT *
      if (query.includes("SELECT *")) {
        plan.optimizations.push("Consider selecting only needed columns instead of SELECT *")
        plan.estimatedCost += 10
      }

      // Check for missing ORDER BY with LIMIT
      if (query.toLowerCase().includes("limit") && !query.toLowerCase().includes("order by")) {
        plan.optimizations.push("Consider adding ORDER BY clause with LIMIT for consistent results")
        plan.estimatedCost += 5
      }

      // Suggest indexes based on WHERE clauses
      const whereMatches = query.match(/WHERE\s+(\w+)\s*=/gi)
      if (whereMatches) {
        whereMatches.forEach((match) => {
          const column = match.replace(/WHERE\s+/i, "").replace(/\s*=.*/, "")
          plan.suggestedIndexes.push(`CREATE INDEX IF NOT EXISTS idx_${column} ON table_name(${column})`)
        })
      }
    }

    // Analyze JOIN queries
    if (query.toLowerCase().includes("join")) {
      plan.optimizations.push("Ensure JOIN conditions use indexed columns")
      plan.estimatedCost += 20
    }

    return plan
  }

  private isLargeTableQuery(query: string): boolean {
    const largeTables = ["products", "customers", "orders", "analytics", "audit_logs"]
    return largeTables.some((table) => query.toLowerCase().includes(table))
  }

  recordQueryExecution(query: string, duration: number) {
    this.metrics.queryCount++
    this.queryTimes.push(duration)

    // Keep only last 1000 query times for average calculation
    if (this.queryTimes.length > 1000) {
      this.queryTimes.shift()
    }

    // Update average response time
    this.metrics.averageResponseTime = this.queryTimes.reduce((sum, time) => sum + time, 0) / this.queryTimes.length

    // Record slow queries
    if (duration > this.SLOW_QUERY_THRESHOLD) {
      this.metrics.slowQueries.push({
        query: query.substring(0, 200), // Truncate long queries
        duration,
        timestamp: new Date(),
      })

      // Keep only recent slow queries
      if (this.metrics.slowQueries.length > this.MAX_SLOW_QUERIES) {
        this.metrics.slowQueries.shift()
      }

      logWarn(`Slow query detected (${duration}ms): ${query.substring(0, 100)}...`)
    }
  }

  getPerformanceReport(): PerformanceMetrics & {
    recommendations: string[]
    healthScore: number
  } {
    const recommendations: string[] = []
    let healthScore = 100

    // Analyze average response time
    if (this.metrics.averageResponseTime > 500) {
      recommendations.push("Average query response time is high. Consider query optimization.")
      healthScore -= 20
    }

    // Analyze slow query frequency
    const recentSlowQueries = this.metrics.slowQueries.filter(
      (q) => Date.now() - q.timestamp.getTime() < 3600000, // Last hour
    )

    if (recentSlowQueries.length > 10) {
      recommendations.push("High number of slow queries detected. Review query patterns.")
      healthScore -= 30
    }

    // Analyze cache hit rate
    if (this.metrics.cacheHitRate < 70) {
      recommendations.push("Cache hit rate is low. Consider adjusting cache TTL or cache keys.")
      healthScore -= 15
    }

    return {
      ...this.metrics,
      recommendations,
      healthScore: Math.max(0, healthScore),
    }
  }

  updateCacheHitRate(hitRate: number) {
    this.metrics.cacheHitRate = hitRate
  }

  generateOptimizationSuggestions(): string[] {
    const suggestions: string[] = []

    // Analyze query patterns
    const commonSlowQueries = this.getCommonSlowQueryPatterns()

    commonSlowQueries.forEach((pattern) => {
      suggestions.push(`Optimize queries matching pattern: ${pattern}`)
    })

    // General suggestions based on metrics
    if (this.metrics.averageResponseTime > 200) {
      suggestions.push("Consider implementing database connection pooling")
      suggestions.push("Review and optimize database indexes")
      suggestions.push("Consider query result caching for frequently accessed data")
    }

    if (this.metrics.cacheHitRate < 80) {
      suggestions.push("Increase cache TTL for stable data")
      suggestions.push("Implement cache warming for critical queries")
      suggestions.push("Review cache key strategies for better hit rates")
    }

    return suggestions
  }

  private getCommonSlowQueryPatterns(): string[] {
    const patterns = new Map<string, number>()

    this.metrics.slowQueries.forEach((slowQuery) => {
      // Extract query pattern (simplified)
      const pattern = slowQuery.query
        .replace(/\d+/g, "?") // Replace numbers with placeholders
        .replace(/'[^']*'/g, "?") // Replace string literals
        .substring(0, 50)

      patterns.set(pattern, (patterns.get(pattern) || 0) + 1)
    })

    // Return patterns that appear more than once
    return Array.from(patterns.entries())
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .map(([pattern, _]) => pattern)
  }

  reset() {
    this.metrics = {
      queryCount: 0,
      averageResponseTime: 0,
      slowQueries: [],
      cacheHitRate: 0,
    }
    this.queryTimes = []
  }
}

export const queryOptimizer = new QueryOptimizer()
