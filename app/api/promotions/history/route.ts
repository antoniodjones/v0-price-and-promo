import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse } from "@/lib/api/response"
import { getPromotionHistory, getPromotionHistoryStats } from "@/lib/api/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || undefined
    const dateRange = searchParams.get("dateRange") || "30d"

    // Calculate date filter based on range
    let daysBack = 30
    switch (dateRange) {
      case "7d":
        daysBack = 7
        break
      case "30d":
        daysBack = 30
        break
      case "90d":
        daysBack = 90
        break
      case "1y":
        daysBack = 365
        break
      case "all":
        daysBack = 0 // No date filter
        break
    }

    const startDate = daysBack > 0 ? new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000) : undefined

    // Fetch history and stats
    const [history, stats] = await Promise.all([
      getPromotionHistory({ type, startDate }),
      getPromotionHistoryStats({ type, startDate }),
    ])

    return NextResponse.json(
      createApiResponse(
        {
          history,
          stats,
        },
        "Promotion history retrieved successfully",
      ),
    )
  } catch (error) {
    console.error("[v0] Error fetching promotion history:", error)
    return NextResponse.json(
      createApiResponse(null, error instanceof Error ? error.message : "Failed to fetch promotion history", false),
      { status: 500 },
    )
  }
}
