#!/usr/bin/env node

/**
 * GTI Pricing Engine - Performance Test Runner
 * Comprehensive performance testing suite for Phase 8
 */

import { performance } from "perf_hooks"
import fetch from "node-fetch"

// Test Configuration
const TEST_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  concurrentUsers: [1, 5, 10, 25, 50],
  testDuration: 30000, // 30 seconds
  endpoints: [
    "/api/pricing/calculate",
    "/api/products",
    "/api/promotions",
    "/api/analytics/dashboard",
    "/api/websocket",
  ],
}

// Performance Metrics Collector
class PerformanceCollector {
  constructor() {
    this.metrics = {
      responseTime: [],
      throughput: 0,
      errorRate: 0,
      memoryUsage: [],
      cpuUsage: [],
    }
  }

  recordResponse(startTime, endTime, success) {
    const responseTime = endTime - startTime
    this.metrics.responseTime.push(responseTime)

    if (!success) {
      this.metrics.errorRate++
    }
  }

  recordSystemMetrics() {
    const memUsage = process.memoryUsage()
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
    })
  }

  getResults() {
    const responseTime = this.metrics.responseTime
    const totalRequests = responseTime.length

    return {
      totalRequests,
      averageResponseTime: responseTime.reduce((a, b) => a + b, 0) / totalRequests,
      minResponseTime: Math.min(...responseTime),
      maxResponseTime: Math.max(...responseTime),
      p95ResponseTime: this.percentile(responseTime, 95),
      p99ResponseTime: this.percentile(responseTime, 99),
      errorRate: (this.metrics.errorRate / totalRequests) * 100,
      throughput: totalRequests / (TEST_CONFIG.testDuration / 1000),
      memoryPeak: Math.max(...this.metrics.memoryUsage.map((m) => m.heapUsed)),
    }
  }

  percentile(arr, p) {
    const sorted = arr.sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index]
  }
}

// Load Test Runner
async function runLoadTest(endpoint, concurrentUsers, duration) {
  console.log(`\n🚀 Running load test: ${endpoint} with ${concurrentUsers} users for ${duration / 1000}s`)

  const collector = new PerformanceCollector()
  const promises = []
  const startTime = Date.now()

  // Start concurrent user simulation
  for (let i = 0; i < concurrentUsers; i++) {
    promises.push(simulateUser(endpoint, collector, startTime + duration))
  }

  // Monitor system metrics
  const metricsInterval = setInterval(() => {
    collector.recordSystemMetrics()
  }, 1000)

  // Wait for all users to complete
  await Promise.all(promises)
  clearInterval(metricsInterval)

  return collector.getResults()
}

// User Simulation
async function simulateUser(endpoint, collector, endTime) {
  while (Date.now() < endTime) {
    const requestStart = performance.now()
    let success = true

    try {
      const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "GTI-Performance-Test/1.0",
        },
        timeout: 10000,
      })

      success = response.ok
    } catch (error) {
      success = false
    }

    const requestEnd = performance.now()
    collector.recordResponse(requestStart, requestEnd, success)

    // Random delay between requests (100-500ms)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 100))
  }
}

// Database Performance Test
async function testDatabasePerformance() {
  console.log("\n📊 Testing Database Performance...")

  const tests = [
    {
      name: "Product Lookup",
      query: "SELECT * FROM products LIMIT 100",
      expectedTime: 50, // ms
    },
    {
      name: "Pricing Calculation",
      query: "SELECT * FROM pricing_rules WHERE active = true",
      expectedTime: 100, // ms
    },
    {
      name: "Analytics Query",
      query: "SELECT COUNT(*) FROM audit_logs WHERE created_at > NOW() - INTERVAL '1 day'",
      expectedTime: 200, // ms
    },
  ]

  for (const test of tests) {
    const startTime = performance.now()

    try {
      // Simulate database query via API
      await fetch(`${TEST_CONFIG.baseUrl}/api/test/db-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: test.query }),
      })

      const endTime = performance.now()
      const duration = endTime - startTime

      console.log(`  ✅ ${test.name}: ${duration.toFixed(2)}ms ${duration > test.expectedTime ? "⚠️  SLOW" : "✅ FAST"}`)
    } catch (error) {
      console.log(`  ❌ ${test.name}: FAILED - ${error.message}`)
    }
  }
}

// WebSocket Performance Test
async function testWebSocketPerformance() {
  console.log("\n🔌 Testing WebSocket Performance...")

  return new Promise((resolve) => {
    const WebSocket = require("ws")
    const ws = new WebSocket(`ws://localhost:3000/api/websocket`)

    let messageCount = 0
    const startTime = Date.now()

    ws.on("open", () => {
      console.log("  📡 WebSocket connected")

      // Send test messages
      const interval = setInterval(() => {
        if (messageCount < 100) {
          ws.send(
            JSON.stringify({
              type: "performance_test",
              timestamp: Date.now(),
              messageId: messageCount++,
            }),
          )
        } else {
          clearInterval(interval)
          ws.close()
        }
      }, 10)
    })

    ws.on("message", (data) => {
      const message = JSON.parse(data)
      if (message.type === "performance_test_response") {
        const latency = Date.now() - message.originalTimestamp
        console.log(`  📨 Message ${message.messageId}: ${latency}ms latency`)
      }
    })

    ws.on("close", () => {
      const totalTime = Date.now() - startTime
      console.log(`  ✅ WebSocket test completed: ${messageCount} messages in ${totalTime}ms`)
      resolve()
    })

    ws.on("error", (error) => {
      console.log(`  ❌ WebSocket error: ${error.message}`)
      resolve()
    })
  })
}

// Memory Leak Detection
function detectMemoryLeaks() {
  console.log("\n🧠 Memory Leak Detection...")

  const initialMemory = process.memoryUsage()
  console.log(`  📊 Initial Memory: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`)

  // Force garbage collection if available
  if (global.gc) {
    global.gc()
    const afterGC = process.memoryUsage()
    console.log(`  🗑️  After GC: ${(afterGC.heapUsed / 1024 / 1024).toFixed(2)} MB`)
  }

  return {
    initialHeap: initialMemory.heapUsed,
    initialExternal: initialMemory.external,
  }
}

// Generate Performance Report
function generateReport(results) {
  console.log("\n📋 PERFORMANCE TEST REPORT")
  console.log("=".repeat(50))

  results.forEach((result, index) => {
    const endpoint = TEST_CONFIG.endpoints[index % TEST_CONFIG.endpoints.length]
    console.log(`\n🎯 Endpoint: ${endpoint}`)
    console.log(`   Users: ${result.users}`)
    console.log(`   Total Requests: ${result.metrics.totalRequests}`)
    console.log(`   Average Response Time: ${result.metrics.averageResponseTime.toFixed(2)}ms`)
    console.log(`   95th Percentile: ${result.metrics.p95ResponseTime.toFixed(2)}ms`)
    console.log(`   99th Percentile: ${result.metrics.p99ResponseTime.toFixed(2)}ms`)
    console.log(`   Throughput: ${result.metrics.throughput.toFixed(2)} req/s`)
    console.log(`   Error Rate: ${result.metrics.errorRate.toFixed(2)}%`)
    console.log(`   Memory Peak: ${(result.metrics.memoryPeak / 1024 / 1024).toFixed(2)} MB`)

    // Performance Assessment
    const assessment = assessPerformance(result.metrics)
    console.log(`   Assessment: ${assessment.emoji} ${assessment.status}`)
  })

  console.log("\n" + "=".repeat(50))
}

// Performance Assessment
function assessPerformance(metrics) {
  if (metrics.errorRate > 5) {
    return { emoji: "❌", status: "CRITICAL - High Error Rate" }
  } else if (metrics.averageResponseTime > 1000) {
    return { emoji: "⚠️", status: "WARNING - Slow Response Time" }
  } else if (metrics.p95ResponseTime > 2000) {
    return { emoji: "⚠️", status: "WARNING - High P95 Latency" }
  } else if (metrics.throughput < 10) {
    return { emoji: "⚠️", status: "WARNING - Low Throughput" }
  } else {
    return { emoji: "✅", status: "EXCELLENT - All Metrics Good" }
  }
}

// Main Test Runner
async function main() {
  console.log("🚀 GTI Pricing Engine - Performance Test Suite")
  console.log("=".repeat(50))

  const memoryBaseline = detectMemoryLeaks()
  const results = []

  try {
    // Run load tests for each endpoint and user count
    for (const endpoint of TEST_CONFIG.endpoints) {
      for (const userCount of TEST_CONFIG.concurrentUsers) {
        const testResult = await runLoadTest(endpoint, userCount, TEST_CONFIG.testDuration)
        results.push({
          endpoint,
          users: userCount,
          metrics: testResult,
        })

        // Cool down between tests
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Run specialized tests
    await testDatabasePerformance()
    await testWebSocketPerformance()

    // Generate final report
    generateReport(results)

    // Final memory check
    const finalMemory = process.memoryUsage()
    const memoryGrowth = finalMemory.heapUsed - memoryBaseline.initialHeap
    console.log(`\n🧠 Memory Growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB`)

    if (memoryGrowth > 50 * 1024 * 1024) {
      // 50MB threshold
      console.log("⚠️  Potential memory leak detected!")
    } else {
      console.log("✅ Memory usage within acceptable limits")
    }
  } catch (error) {
    console.error("❌ Performance test failed:", error.message)
    process.exit(1)
  }

  console.log("\n✅ Performance testing completed successfully!")
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { runLoadTest, testDatabasePerformance, testWebSocketPerformance }
