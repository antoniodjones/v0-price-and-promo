// Promotion performance analytics API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError } from "@/lib/api/utils"
import { getPromotionPerformance } from "@/lib/api/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const promotionId = searchParams.get("promotionId")

    if (!promotionId) {
      return NextResponse.json({ success: false, error: "promotionId is required" }, { status: 400 })
    }

    const performanceData = await getPromotionPerformance(promotionId)

    return NextResponse.json(createApiResponse(performanceData, "Promotion performance data retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
