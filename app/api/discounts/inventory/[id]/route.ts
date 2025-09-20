// Individual inventory discount API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discounts = await db.getInventoryDiscounts()
    const discount = discounts.find((d) => d.id === params.id)

    if (!discount) {
      return NextResponse.json(createApiResponse(null, "Inventory discount not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(discount, "Inventory discount retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discounts = await db.getInventoryDiscounts()
    const discount = discounts.find((d) => d.id === params.id)

    if (!discount) {
      return NextResponse.json(createApiResponse(null, "Inventory discount not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate fields if provided
    if (body.type && !["expiration", "thc"].includes(body.type)) {
      return NextResponse.json(createApiResponse(null, "Type must be 'expiration' or 'thc'", false), { status: 400 })
    }

    if (body.discountType && !["percentage", "fixed"].includes(body.discountType)) {
      return NextResponse.json(createApiResponse(null, "Discount type must be 'percentage' or 'fixed'", false), {
        status: 400,
      })
    }

    if (body.scope && !["all", "category", "brand"].includes(body.scope)) {
      return NextResponse.json(createApiResponse(null, "Scope must be 'all', 'category', or 'brand'", false), {
        status: 400,
      })
    }

    // In a real implementation, you would update the discount in the database
    const updatedDiscount = {
      ...discount,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedDiscount, "Inventory discount updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discounts = await db.getInventoryDiscounts()
    const discount = discounts.find((d) => d.id === params.id)

    if (!discount) {
      return NextResponse.json(createApiResponse(null, "Inventory discount not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the discount from the database
    return NextResponse.json(createApiResponse(null, "Inventory discount deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
