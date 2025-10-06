import { type NextRequest, NextResponse } from "next/server"
import { optimizedDb } from "@/lib/api/database-optimized"
import { queryOptimizer } from "@/lib/performance/query-optimizer"
import { memoryOptimizer } from "@/lib/performance/memory-optimizer"
import { redisCache } from "@/lib/cache/redis-cache"
import { createApiResponse } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get("detailed") === "true"

    // Get basic health status
    const [dbHealth, cacheMetrics, queryReport, memoryReport] = await Promise.allSettled([
      optimizedDb.healthCheck(),
      Promise.resolve(redisCache.getMetrics()),
      Promise.resolve(queryOptimizer.getPerformanceReport()),
      Promise.resolve(memoryOptimizer.getMemoryReport()),
    ])

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: dbHealth.status === "fulfilled" ? dbHealth.value : { database: false, cache: false },
      cache: cacheMetrics.status === "fulfilled" ? cacheMetrics.value : null,
      queries: queryReport.status === "fulfilled" ? queryReport.value : null,
      memory: memoryReport.status === "fulfilled" ? memoryReport.value : null,
    }

    // Determine overall health status
    const dbHealthy = health.database.database && health.database.cache
    const cacheHealthy = (health.cache?.hitRate ?? 0) > 50
    const queryHealthy = (health.queries?.healthScore ?? 0) > 70
    const memoryHealthy = (health.memory?.healthScore ?? 0) > 70

    if (!dbHealthy || !cacheHealthy || !queryHealthy || !memoryHealthy) {
      health.status = "degraded"
    }

    if (!dbHealthy || (health.memory?.healthScore ?? 0) < 50) {
      health.status = "unhealthy"
    }

    // Include detailed information if requested
    if (detailed) {
      return NextResponse.json(createApiResponse(health, "Detailed health check completed"))
    }

    // Return summary for regular health checks
    const summary = {
      status: health.status,
      timestamp: health.timestamp,
      components: {
        database: dbHealthy,
        cache: cacheHealthy,
        queries: queryHealthy,
        memory: memoryHealthy,
      },
      scores: {
        query: health.queries?.healthScore ?? 0,
        memory: health.memory?.healthScore ?? 0,
        cache: health.cache?.hitRate ?? 0,
      },
    }

    return NextResponse.json(createApiResponse(summary, "Health check completed"))
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      createApiResponse({ status: "error", timestamp: new Date().toISOString() }, "Health check failed", false),
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "optimize_memory":
        memoryOptimizer.optimizeMemoryUsage()
        return NextResponse.json(createApiResponse(null, "Memory optimization triggered"))

      case "clear_cache":
        await redisCache.flush()
        return NextResponse.json(createApiResponse(null, "Cache cleared successfully"))

      case "reset_metrics":
        queryOptimizer.reset()
        return NextResponse.json(createApiResponse(null, "Query metrics reset"))

      default:
        return NextResponse.json(createApiResponse(null, "Invalid action", false), { status: 400 })
    }
  } catch (error) {
    console.error("Performance action error:", error)
    return NextResponse.json(createApiResponse(null, "Performance action failed", false), { status: 500 })
  }
}
