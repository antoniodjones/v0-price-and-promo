import { NextResponse } from "next/server"
import { realTimeAnalytics } from "@/lib/analytics/real-time-collector"

export async function GET() {
  try {
    const analytics = realTimeAnalytics.getRealtimeAnalytics()

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching real-time analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch real-time analytics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json()

    // Validate required fields
    if (!event.type || !event.sessionId) {
      return NextResponse.json({ success: false, error: "Missing required fields: type, sessionId" }, { status: 400 })
    }

    realTimeAnalytics.trackEvent(event)

    return NextResponse.json({
      success: true,
      message: "Event tracked successfully",
    })
  } catch (error) {
    console.error("Error tracking analytics event:", error)
    return NextResponse.json({ success: false, error: "Failed to track event" }, { status: 500 })
  }
}
