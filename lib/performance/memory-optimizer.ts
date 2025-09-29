interface MemoryUsage {
  heapUsed: number
  heapTotal: number
  external: number
  rss: number
}

interface MemoryMetrics {
  current: MemoryUsage
  peak: MemoryUsage
  history: Array<{ timestamp: Date; usage: MemoryUsage }>
  leakDetection: {
    suspiciousGrowth: boolean
    growthRate: number
    recommendations: string[]
  }
}

class MemoryOptimizer {
  private metrics: MemoryMetrics
  private monitoringInterval: NodeJS.Timeout | null = null
  private readonly HISTORY_LIMIT = 100
  private readonly LEAK_THRESHOLD = 10 * 1024 * 1024 // 10MB growth per minute

  constructor() {
    this.metrics = {
      current: this.getCurrentMemoryUsage(),
      peak: this.getCurrentMemoryUsage(),
      history: [],
      leakDetection: {
        suspiciousGrowth: false,
        growthRate: 0,
        recommendations: [],
      },
    }

    this.startMonitoring()
  }

  private getCurrentMemoryUsage(): MemoryUsage {
    const usage = process.memoryUsage()
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss,
    }
  }

  private startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.recordMemoryUsage()
      this.detectMemoryLeaks()
    }, 60000) // Every minute
  }

  private recordMemoryUsage() {
    const current = this.getCurrentMemoryUsage()
    this.metrics.current = current

    // Update peak usage
    if (current.heapUsed > this.metrics.peak.heapUsed) {
      this.metrics.peak = { ...current }
    }

    // Add to history
    this.metrics.history.push({
      timestamp: new Date(),
      usage: current,
    })

    // Limit history size
    if (this.metrics.history.length > this.HISTORY_LIMIT) {
      this.metrics.history.shift()
    }
  }

  private detectMemoryLeaks() {
    if (this.metrics.history.length < 5) return

    const recent = this.metrics.history.slice(-5)
    const oldest = recent[0]
    const newest = recent[recent.length - 1]

    const timeDiff = newest.timestamp.getTime() - oldest.timestamp.getTime()
    const memoryDiff = newest.usage.heapUsed - oldest.usage.heapUsed

    // Calculate growth rate (bytes per minute)
    const growthRate = (memoryDiff / timeDiff) * 60000

    this.metrics.leakDetection.growthRate = growthRate
    this.metrics.leakDetection.suspiciousGrowth = growthRate > this.LEAK_THRESHOLD

    // Generate recommendations
    this.metrics.leakDetection.recommendations = this.generateLeakRecommendations(growthRate)
  }

  private generateLeakRecommendations(growthRate: number): string[] {
    const recommendations: string[] = []

    if (growthRate > this.LEAK_THRESHOLD) {
      recommendations.push("Potential memory leak detected - review recent code changes")
      recommendations.push("Check for unclosed database connections or event listeners")
      recommendations.push("Review cache implementations for unbounded growth")
      recommendations.push("Consider implementing memory usage alerts")
    }

    if (this.metrics.current.heapUsed > 500 * 1024 * 1024) {
      // 500MB
      recommendations.push("High memory usage detected - consider optimization")
      recommendations.push("Review large object allocations and data structures")
      recommendations.push("Implement pagination for large data sets")
    }

    return recommendations
  }

  forceGarbageCollection(): boolean {
    try {
      if (global.gc) {
        global.gc()
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  getMemoryReport(): MemoryMetrics & {
    recommendations: string[]
    healthScore: number
  } {
    const recommendations: string[] = []
    let healthScore = 100

    // Analyze current memory usage
    const currentMB = this.metrics.current.heapUsed / (1024 * 1024)

    if (currentMB > 1000) {
      // 1GB
      recommendations.push("Very high memory usage - immediate optimization needed")
      healthScore -= 40
    } else if (currentMB > 500) {
      // 500MB
      recommendations.push("High memory usage - consider optimization")
      healthScore -= 20
    }

    // Analyze growth trend
    if (this.metrics.leakDetection.suspiciousGrowth) {
      recommendations.push("Potential memory leak detected")
      healthScore -= 30
    }

    // Add leak detection recommendations
    recommendations.push(...this.metrics.leakDetection.recommendations)

    return {
      ...this.metrics,
      recommendations,
      healthScore: Math.max(0, healthScore),
    }
  }

  optimizeMemoryUsage() {
    // Clear old history entries
    if (this.metrics.history.length > 50) {
      this.metrics.history = this.metrics.history.slice(-50)
    }

    // Force garbage collection if available
    this.forceGarbageCollection()

    // Clear any large temporary objects (implementation specific)
    this.clearTemporaryData()
  }

  private clearTemporaryData() {
    // Implementation would clear temporary caches, buffers, etc.
    // This is a placeholder for application-specific cleanup
  }

  cleanup() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
  }
}

export const memoryOptimizer = new MemoryOptimizer()
