interface PerformanceMetrics {
  timestamp: number
  responseTime: number
  throughput: number
  errorRate: number
  cpuUsage: number
  memoryUsage: number
  databaseConnections: number
  cacheHitRate: number
  queueLength: number
  activeUsers: number
}

interface AlertRule {
  id: string
  metric: keyof PerformanceMetrics
  threshold: number
  operator: "gt" | "lt" | "eq"
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  cooldownMs: number
  lastTriggered?: number
}

interface PerformanceAlert {
  id: string
  ruleId: string
  metric: string
  value: number
  threshold: number
  severity: string
  timestamp: number
  resolved: boolean
  resolvedAt?: number
}

class MetricsCollector {
  private metrics: PerformanceMetrics[] = []
  private alerts: PerformanceAlert[] = []
  private alertRules: AlertRule[] = [
    {
      id: "response-time-high",
      metric: "responseTime",
      threshold: 1000,
      operator: "gt",
      severity: "high",
      enabled: true,
      cooldownMs: 300000, // 5 minutes
    },
    {
      id: "error-rate-high",
      metric: "errorRate",
      threshold: 5,
      operator: "gt",
      severity: "critical",
      enabled: true,
      cooldownMs: 60000, // 1 minute
    },
    {
      id: "cpu-usage-critical",
      metric: "cpuUsage",
      threshold: 90,
      operator: "gt",
      severity: "critical",
      enabled: true,
      cooldownMs: 180000, // 3 minutes
    },
    {
      id: "memory-usage-high",
      metric: "memoryUsage",
      threshold: 85,
      operator: "gt",
      severity: "high",
      enabled: true,
      cooldownMs: 300000, // 5 minutes
    },
  ]
  private subscribers: ((metrics: PerformanceMetrics) => void)[] = []
  private alertSubscribers: ((alert: PerformanceAlert) => void)[] = []

  async collectMetrics(): Promise<PerformanceMetrics> {
    const startTime = Date.now()

    // Simulate collecting real metrics (in production, these would be actual system metrics)
    const metrics: PerformanceMetrics = {
      timestamp: startTime,
      responseTime: await this.measureResponseTime(),
      throughput: await this.measureThroughput(),
      errorRate: await this.calculateErrorRate(),
      cpuUsage: await this.getCpuUsage(),
      memoryUsage: await this.getMemoryUsage(),
      databaseConnections: await this.getDatabaseConnections(),
      cacheHitRate: await this.getCacheHitRate(),
      queueLength: await this.getQueueLength(),
      activeUsers: await this.getActiveUsers(),
    }

    this.metrics.push(metrics)

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // Check alert rules
    this.checkAlertRules(metrics)

    // Notify subscribers
    this.subscribers.forEach((callback) => callback(metrics))

    return metrics
  }

  private async measureResponseTime(): Promise<number> {
    // Simulate API response time measurement
    const testEndpoints = ["/api/pricing/calculate", "/api/products", "/api/promotions"]
    const measurements: number[] = []

    for (const endpoint of testEndpoints) {
      const start = performance.now()
      try {
        // In production, make actual HTTP requests
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50))
        measurements.push(performance.now() - start)
      } catch (error) {
        measurements.push(5000) // Timeout value
      }
    }

    return measurements.reduce((sum, time) => sum + time, 0) / measurements.length
  }

  private async measureThroughput(): Promise<number> {
    // Calculate requests per second based on recent activity
    const recentMetrics = this.metrics.slice(-12) // Last minute (5-second intervals)
    if (recentMetrics.length < 2) return 0

    const timeSpan = (Date.now() - recentMetrics[0].timestamp) / 1000
    return Math.round(800 + Math.random() * 600) // Simulated throughput
  }

  private async calculateErrorRate(): Promise<number> {
    // Calculate error rate as percentage
    return Math.random() * 3 // Simulated error rate 0-3%
  }

  private async getCpuUsage(): Promise<number> {
    // Get CPU usage percentage
    if (typeof process !== "undefined" && process.cpuUsage) {
      const usage = process.cpuUsage()
      return (usage.user + usage.system) / 1000000 // Convert to percentage approximation
    }
    return 30 + Math.random() * 40 // Simulated CPU usage
  }

  private async getMemoryUsage(): Promise<number> {
    // Get memory usage percentage
    if (typeof process !== "undefined" && process.memoryUsage) {
      const usage = process.memoryUsage()
      return (usage.heapUsed / usage.heapTotal) * 100
    }
    return 50 + Math.random() * 30 // Simulated memory usage
  }

  private async getDatabaseConnections(): Promise<number> {
    // Get active database connections
    return Math.floor(10 + Math.random() * 20) // Simulated DB connections
  }

  private async getCacheHitRate(): Promise<number> {
    // Calculate cache hit rate percentage
    return 85 + Math.random() * 10 // Simulated cache hit rate 85-95%
  }

  private async getQueueLength(): Promise<number> {
    // Get current queue length
    return Math.floor(Math.random() * 50) // Simulated queue length
  }

  private async getActiveUsers(): Promise<number> {
    // Get number of active users
    return Math.floor(50 + Math.random() * 200) // Simulated active users
  }

  private checkAlertRules(metrics: PerformanceMetrics): void {
    const now = Date.now()

    for (const rule of this.alertRules) {
      if (!rule.enabled) continue

      // Check cooldown period
      if (rule.lastTriggered && now - rule.lastTriggered < rule.cooldownMs) {
        continue
      }

      const value = metrics[rule.metric] as number
      let shouldAlert = false

      switch (rule.operator) {
        case "gt":
          shouldAlert = value > rule.threshold
          break
        case "lt":
          shouldAlert = value < rule.threshold
          break
        case "eq":
          shouldAlert = value === rule.threshold
          break
      }

      if (shouldAlert) {
        const alert: PerformanceAlert = {
          id: `alert_${now}_${rule.id}`,
          ruleId: rule.id,
          metric: rule.metric,
          value,
          threshold: rule.threshold,
          severity: rule.severity,
          timestamp: now,
          resolved: false,
        }

        this.alerts.push(alert)
        rule.lastTriggered = now

        // Notify alert subscribers
        this.alertSubscribers.forEach((callback) => callback(alert))

        // Auto-resolve alerts after conditions improve
        setTimeout(() => this.checkAlertResolution(alert.id), 60000)
      }
    }
  }

  private checkAlertResolution(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId && !a.resolved)
    if (!alert) return

    const rule = this.alertRules.find((r) => r.id === alert.ruleId)
    if (!rule) return

    const latestMetrics = this.getLatestMetrics()
    if (!latestMetrics) return

    const currentValue = latestMetrics[rule.metric] as number
    let isResolved = false

    switch (rule.operator) {
      case "gt":
        isResolved = currentValue <= rule.threshold * 0.9 // 10% buffer
        break
      case "lt":
        isResolved = currentValue >= rule.threshold * 1.1 // 10% buffer
        break
      case "eq":
        isResolved = currentValue !== rule.threshold
        break
    }

    if (isResolved) {
      alert.resolved = true
      alert.resolvedAt = Date.now()
    }
  }

  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  subscribeToAlerts(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertSubscribers.push(callback)
    return () => {
      const index = this.alertSubscribers.indexOf(callback)
      if (index > -1) {
        this.alertSubscribers.splice(index, 1)
      }
    }
  }

  getMetricsHistory(minutes = 60): PerformanceMetrics[] {
    const cutoff = Date.now() - minutes * 60 * 1000
    return this.metrics.filter((m) => m.timestamp >= cutoff)
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null
  }

  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter((a) => !a.resolved)
  }

  getAllAlerts(): PerformanceAlert[] {
    return [...this.alerts].reverse() // Most recent first
  }

  updateAlertRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const rule = this.alertRules.find((r) => r.id === ruleId)
    if (!rule) return false

    Object.assign(rule, updates)
    return true
  }

  addAlertRule(rule: Omit<AlertRule, "id">): string {
    const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.alertRules.push({ ...rule, id })
    return id
  }

  removeAlertRule(ruleId: string): boolean {
    const index = this.alertRules.findIndex((r) => r.id === ruleId)
    if (index === -1) return false

    this.alertRules.splice(index, 1)
    return true
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules]
  }

  generateReport(hours = 24): {
    summary: {
      avgResponseTime: number
      maxResponseTime: number
      avgThroughput: number
      maxThroughput: number
      avgErrorRate: number
      maxErrorRate: number
      uptime: number
      totalAlerts: number
      criticalAlerts: number
    }
    recommendations: string[]
  } {
    const cutoff = Date.now() - hours * 60 * 60 * 1000
    const relevantMetrics = this.metrics.filter((m) => m.timestamp >= cutoff)
    const relevantAlerts = this.alerts.filter((a) => a.timestamp >= cutoff)

    if (relevantMetrics.length === 0) {
      return {
        summary: {
          avgResponseTime: 0,
          maxResponseTime: 0,
          avgThroughput: 0,
          maxThroughput: 0,
          avgErrorRate: 0,
          maxErrorRate: 0,
          uptime: 0,
          totalAlerts: 0,
          criticalAlerts: 0,
        },
        recommendations: ["Insufficient data for analysis"],
      }
    }

    const summary = {
      avgResponseTime: relevantMetrics.reduce((sum, m) => sum + m.responseTime, 0) / relevantMetrics.length,
      maxResponseTime: Math.max(...relevantMetrics.map((m) => m.responseTime)),
      avgThroughput: relevantMetrics.reduce((sum, m) => sum + m.throughput, 0) / relevantMetrics.length,
      maxThroughput: Math.max(...relevantMetrics.map((m) => m.throughput)),
      avgErrorRate: relevantMetrics.reduce((sum, m) => sum + m.errorRate, 0) / relevantMetrics.length,
      maxErrorRate: Math.max(...relevantMetrics.map((m) => m.errorRate)),
      uptime: (relevantMetrics.filter((m) => m.errorRate < 10).length / relevantMetrics.length) * 100,
      totalAlerts: relevantAlerts.length,
      criticalAlerts: relevantAlerts.filter((a) => a.severity === "critical").length,
    }

    const recommendations: string[] = []

    if (summary.avgResponseTime > 500) {
      recommendations.push("Consider optimizing database queries and implementing more aggressive caching")
    }
    if (summary.maxErrorRate > 5) {
      recommendations.push("Investigate error patterns and implement better error handling")
    }
    if (summary.criticalAlerts > 0) {
      recommendations.push("Review critical alerts and adjust system resources or alert thresholds")
    }
    if (summary.uptime < 99.5) {
      recommendations.push("Implement redundancy and failover mechanisms to improve uptime")
    }

    return { summary, recommendations }
  }
}

export const metricsCollector = new MetricsCollector()
export type { PerformanceMetrics, AlertRule, PerformanceAlert }
