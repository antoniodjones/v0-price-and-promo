// Promotion performance analytics API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"
import { getPromotionPerformance } from "@/lib/api/database"

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const promotionId = searchParams.get("promotionId")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const performanceData = await getPromotionPerformance({
      promotionId,
      type,
      startDate,
      endDate,
      page,
      limit,
    })

    return NextResponse.json(createApiResponse(performanceData, "Promotion performance data retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
