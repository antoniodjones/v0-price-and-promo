// Individual BOGO promotion API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const promotions = await db.getBogoPromotions()
    const promotion = promotions.find((p) => p.id === id)

    if (!promotion) {
      return NextResponse.json(createApiResponse(null, "BOGO promotion not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(promotion, "BOGO promotion retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const promotions = await db.getBogoPromotions()
    const promotion = promotions.find((p) => p.id === id)

    if (!promotion) {
      return NextResponse.json(createApiResponse(null, "BOGO promotion not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate fields if provided
    if (body.type && !["traditional", "percentage", "fixed"].includes(body.type)) {
      return NextResponse.json(createApiResponse(null, "Type must be 'traditional', 'percentage', or 'fixed'", false), {
        status: 400,
      })
    }

    if (body.triggerLevel && !["item", "brand", "category"].includes(body.triggerLevel)) {
      return NextResponse.json(createApiResponse(null, "Trigger level must be 'item', 'brand', or 'category'", false), {
        status: 400,
      })
    }

    if (body.rewardType && !["free", "percentage", "fixed"].includes(body.rewardType)) {
      return NextResponse.json(createApiResponse(null, "Reward type must be 'free', 'percentage', or 'fixed'", false), {
        status: 400,
      })
    }

    // In a real implementation, you would update the promotion in the database
    const updatedPromotion = {
      ...promotion,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedPromotion, "BOGO promotion updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const promotions = await db.getBogoPromotions()
    const promotion = promotions.find((p) => p.id === id)

    if (!promotion) {
      return NextResponse.json(createApiResponse(null, "BOGO promotion not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the promotion from the database
    return NextResponse.json(createApiResponse(null, "BOGO promotion deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
