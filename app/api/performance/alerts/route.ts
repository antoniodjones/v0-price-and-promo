import { type NextRequest, NextResponse } from "next/server"
import { metricsCollector } from "@/lib/performance/metrics-collector"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active") === "true"

    const alerts = active ? metricsCollector.getActiveAlerts() : metricsCollector.getAllAlerts()

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
    })
  } catch (error) {
    console.error("Error fetching performance alerts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}
