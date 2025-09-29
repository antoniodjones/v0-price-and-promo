import { type NextRequest, NextResponse } from "next/server"
import { metricsCollector } from "@/lib/performance/metrics-collector"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const minutes = Number.parseInt(searchParams.get("minutes") || "60")
    const latest = searchParams.get("latest") === "true"

    if (latest) {
      const latestMetrics = metricsCollector.getLatestMetrics()
      return NextResponse.json({
        success: true,
        data: latestMetrics,
      })
    }

    const metrics = metricsCollector.getMetricsHistory(minutes)
    return NextResponse.json({
      success: true,
      data: metrics,
      count: metrics.length,
    })
  } catch (error) {
    console.error("Error fetching performance metrics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch metrics" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const metrics = await metricsCollector.collectMetrics()
    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error("Error collecting performance metrics:", error)
    return NextResponse.json({ success: false, error: "Failed to collect metrics" }, { status: 500 })
  }
}
