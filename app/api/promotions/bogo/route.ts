// BOGO promotions management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const triggerLevel = searchParams.get("triggerLevel")

    const promotions = await db.getBogoPromotions()

    // Apply filters
    let filteredPromotions = promotions
    if (status) {
      filteredPromotions = filteredPromotions.filter((p) => p.status === status)
    }
    if (type) {
      filteredPromotions = filteredPromotions.filter((p) => p.type === type)
    }
    if (triggerLevel) {
      filteredPromotions = filteredPromotions.filter((p) => p.triggerLevel === triggerLevel)
    }

    return NextResponse.json(createApiResponse(filteredPromotions, "BOGO promotions retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequiredFields(body, [
      "name",
      "type",
      "triggerLevel",
      "triggerValue",
      "rewardType",
      "rewardValue",
      "startDate",
      "endDate",
    ])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    // Validate promotion type
    if (!["traditional", "percentage", "fixed"].includes(body.type)) {
      return NextResponse.json(createApiResponse(null, "Type must be 'traditional', 'percentage', or 'fixed'", false), {
        status: 400,
      })
    }

    // Validate trigger level
    if (!["item", "brand", "category"].includes(body.triggerLevel)) {
      return NextResponse.json(createApiResponse(null, "Trigger level must be 'item', 'brand', or 'category'", false), {
        status: 400,
      })
    }

    // Validate reward type
    if (!["free", "percentage", "fixed"].includes(body.rewardType)) {
      return NextResponse.json(createApiResponse(null, "Reward type must be 'free', 'percentage', or 'fixed'", false), {
        status: 400,
      })
    }

    // Validate reward value
    if (typeof body.rewardValue !== "number" || body.rewardValue < 0) {
      return NextResponse.json(createApiResponse(null, "Reward value must be a non-negative number", false), {
        status: 400,
      })
    }

    if (body.rewardType === "percentage" && body.rewardValue > 100) {
      return NextResponse.json(createApiResponse(null, "Percentage reward cannot exceed 100%", false), {
        status: 400,
      })
    }

    // Validate dates
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(createApiResponse(null, "Invalid date format", false), { status: 400 })
    }

    if (endDate <= startDate) {
      return NextResponse.json(createApiResponse(null, "End date must be after start date", false), { status: 400 })
    }

    const promotion = await db.createBogoPromotion({
      name: body.name,
      type: body.type,
      triggerLevel: body.triggerLevel,
      triggerValue: body.triggerValue,
      rewardType: body.rewardType,
      rewardValue: body.rewardValue,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status || "active",
    })

    return NextResponse.json(createApiResponse(promotion, "BOGO promotion created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
