import { type NextRequest, NextResponse } from "next/server"
import { metricsCollector } from "@/lib/performance/metrics-collector"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    const report = metricsCollector.generateReport(hours)

    return NextResponse.json({
      success: true,
      data: report,
      generatedAt: new Date().toISOString(),
      timeframe: `${hours} hours`,
    })
  } catch (error) {
    console.error("Error generating performance report:", error)
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 })
  }
}
