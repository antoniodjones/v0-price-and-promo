// BOGO promotions management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { getBogoPromotions, createBogoPromotion } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const triggerLevel = searchParams.get("triggerLevel")

    const promotions = await getBogoPromotions()

    // Apply filters
    let filteredPromotions = promotions
    if (status) {
      filteredPromotions = filteredPromotions.filter((p) => p.status === status)
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
      "buy_product_id",
      "get_product_id",
      "buy_quantity",
      "get_quantity",
      "discount_percentage",
      "startDate",
      "endDate",
    ])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    if (
      typeof body.discount_percentage !== "number" ||
      body.discount_percentage < 0 ||
      body.discount_percentage > 100
    ) {
      return NextResponse.json(createApiResponse(null, "Discount percentage must be between 0 and 100", false), {
        status: 400,
      })
    }

    if (typeof body.buy_quantity !== "number" || body.buy_quantity < 1) {
      return NextResponse.json(createApiResponse(null, "Buy quantity must be at least 1", false), {
        status: 400,
      })
    }

    if (typeof body.get_quantity !== "number" || body.get_quantity < 1) {
      return NextResponse.json(createApiResponse(null, "Get quantity must be at least 1", false), {
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

    const promotion = await createBogoPromotion({
      name: body.name,
      buy_product_id: body.buy_product_id,
      get_product_id: body.get_product_id,
      buy_quantity: body.buy_quantity,
      get_quantity: body.get_quantity,
      discount_percentage: body.discount_percentage,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status || "active",
      customer_tiers: body.customer_tiers,
      markets: body.markets,
    })

    return NextResponse.json(createApiResponse(promotion, "BOGO promotion created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
