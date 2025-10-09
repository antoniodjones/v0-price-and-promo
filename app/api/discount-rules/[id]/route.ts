// Discount Rules API - Get, Update, Delete individual rule

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const rule = await db.getDiscountRule(id)

    if (!rule) {
      return NextResponse.json(createApiResponse(null, "Discount rule not found", false), { status: 404 })
    }

    // Get tiers for this rule
    const tiers = await db.getRuleTiers(id)

    return NextResponse.json(createApiResponse({ ...rule, tiers }, "Discount rule retrieved successfully"))
  } catch (error) {
    return handleApiError(error, "GET /api/discount-rules/[id]")
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const rule = await db.getDiscountRule(id)

    if (!rule) {
      return NextResponse.json(createApiResponse(null, "Discount rule not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate tiers if provided
    if (body.tiers) {
      if (!Array.isArray(body.tiers)) {
        return NextResponse.json(createApiResponse(null, "Tiers must be an array", false), { status: 400 })
      }

      for (const tier of body.tiers) {
        if (!["A", "B", "C"].includes(tier.tier)) {
          return NextResponse.json(createApiResponse(null, "Tier must be A, B, or C", false), { status: 400 })
        }
      }
    }

    const updatedRule = await db.updateDiscountRule(id, body)

    return NextResponse.json(createApiResponse(updatedRule, "Discount rule updated successfully"))
  } catch (error) {
    return handleApiError(error, "PUT /api/discount-rules/[id]")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const rule = await db.getDiscountRule(id)

    if (!rule) {
      return NextResponse.json(createApiResponse(null, "Discount rule not found", false), { status: 404 })
    }

    await db.deleteDiscountRule(id)

    return NextResponse.json(createApiResponse(null, "Discount rule deleted successfully"))
  } catch (error) {
    return handleApiError(error, "DELETE /api/discount-rules/[id]")
  }
}
