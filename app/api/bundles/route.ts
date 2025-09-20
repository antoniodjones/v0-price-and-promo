// Bundle deals management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    const bundles = await db.getBundleDeals()

    // Apply filters
    let filteredBundles = bundles
    if (status) {
      filteredBundles = filteredBundles.filter((b) => b.status === status)
    }
    if (type) {
      filteredBundles = filteredBundles.filter((b) => b.type === type)
    }

    return NextResponse.json(createApiResponse(filteredBundles, "Bundle deals retrieved successfully"))
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
      "products",
      "discountType",
      "discountValue",
      "minQuantity",
      "startDate",
      "endDate",
    ])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    // Validate bundle type
    if (!["fixed", "category", "mix_match", "tiered"].includes(body.type)) {
      return NextResponse.json(
        createApiResponse(null, "Type must be 'fixed', 'category', 'mix_match', or 'tiered'", false),
        { status: 400 },
      )
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(body.discountType)) {
      return NextResponse.json(createApiResponse(null, "Discount type must be 'percentage' or 'fixed'", false), {
        status: 400,
      })
    }

    // Validate products array
    if (!Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(createApiResponse(null, "Products array is required and cannot be empty", false), {
        status: 400,
      })
    }

    // Validate discount value
    if (typeof body.discountValue !== "number" || body.discountValue <= 0) {
      return NextResponse.json(createApiResponse(null, "Discount value must be a positive number", false), {
        status: 400,
      })
    }

    if (body.discountType === "percentage" && body.discountValue > 100) {
      return NextResponse.json(createApiResponse(null, "Percentage discount cannot exceed 100%", false), {
        status: 400,
      })
    }

    // Validate minimum quantity
    if (typeof body.minQuantity !== "number" || body.minQuantity <= 0) {
      return NextResponse.json(createApiResponse(null, "Minimum quantity must be a positive number", false), {
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

    const bundle = await db.createBundleDeal({
      name: body.name,
      type: body.type,
      products: body.products,
      discountType: body.discountType,
      discountValue: body.discountValue,
      minQuantity: body.minQuantity,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status || "active",
    })

    return NextResponse.json(createApiResponse(bundle, "Bundle deal created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
