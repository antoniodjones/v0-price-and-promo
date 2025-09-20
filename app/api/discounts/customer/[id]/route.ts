// Individual customer discount API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discounts = await db.getCustomerDiscounts()
    const discount = discounts.find((d) => d.id === params.id)

    if (!discount) {
      return NextResponse.json(createApiResponse(null, "Customer discount not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(discount, "Customer discount retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discounts = await db.getCustomerDiscounts()
    const discount = discounts.find((d) => d.id === params.id)

    if (!discount) {
      return NextResponse.json(createApiResponse(null, "Customer discount not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate fields if provided
    if (body.type && !["percentage", "fixed"].includes(body.type)) {
      return NextResponse.json(createApiResponse(null, "Type must be 'percentage' or 'fixed'", false), { status: 400 })
    }

    if (body.level && !["item", "brand", "category", "subcategory"].includes(body.level)) {
      return NextResponse.json(
        createApiResponse(null, "Level must be 'item', 'brand', 'category', or 'subcategory'", false),
        { status: 400 },
      )
    }

    if (body.value !== undefined) {
      if (typeof body.value !== "number" || body.value <= 0) {
        return NextResponse.json(createApiResponse(null, "Value must be a positive number", false), { status: 400 })
      }
      if (body.type === "percentage" && body.value > 100) {
        return NextResponse.json(createApiResponse(null, "Percentage discount cannot exceed 100%", false), {
          status: 400,
        })
      }
    }

    // In a real implementation, you would update the discount in the database
    const updatedDiscount = {
      ...discount,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedDiscount, "Customer discount updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discounts = await db.getCustomerDiscounts()
    const discount = discounts.find((d) => d.id === params.id)

    if (!discount) {
      return NextResponse.json(createApiResponse(null, "Customer discount not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the discount from the database
    return NextResponse.json(createApiResponse(null, "Customer discount deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
