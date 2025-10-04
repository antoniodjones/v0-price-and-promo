// Discount Rules API - List and Create

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = {
      status: searchParams.get("status") || undefined,
      rule_type: searchParams.get("rule_type") || undefined,
      level: searchParams.get("level") || undefined,
    }

    const rules = await db.getDiscountRules(filters)

    return NextResponse.json(createApiResponse(rules, "Discount rules retrieved successfully"))
  } catch (error) {
    return handleApiError(error, "GET /api/discount-rules")
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const validationError = validateRequiredFields(body, ["name", "rule_type", "level", "start_date", "tiers"])

    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    // Validate tiers array
    if (!Array.isArray(body.tiers) || body.tiers.length === 0) {
      return NextResponse.json(createApiResponse(null, "At least one tier must be defined", false), { status: 400 })
    }

    // Validate each tier
    for (const tier of body.tiers) {
      if (!["A", "B", "C"].includes(tier.tier)) {
        return NextResponse.json(createApiResponse(null, "Tier must be A, B, or C", false), { status: 400 })
      }
      if (!["percentage", "fixed_amount", "price_override"].includes(tier.discount_type)) {
        return NextResponse.json(createApiResponse(null, "Invalid discount type", false), { status: 400 })
      }
      if (typeof tier.discount_value !== "number" || tier.discount_value < 0) {
        return NextResponse.json(createApiResponse(null, "Discount value must be a positive number", false), {
          status: 400,
        })
      }
    }

    const rule = await db.createDiscountRule(body)

    return NextResponse.json(createApiResponse(rule, "Discount rule created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error, "POST /api/discount-rules")
  }
}
