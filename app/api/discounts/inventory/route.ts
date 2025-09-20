// Inventory discount management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const scope = searchParams.get("scope")

    const discounts = await db.getInventoryDiscounts()

    // Apply filters
    let filteredDiscounts = discounts
    if (type) {
      filteredDiscounts = filteredDiscounts.filter((d) => d.type === type)
    }
    if (status) {
      filteredDiscounts = filteredDiscounts.filter((d) => d.status === status)
    }
    if (scope) {
      filteredDiscounts = filteredDiscounts.filter((d) => d.scope === scope)
    }

    return NextResponse.json(createApiResponse(filteredDiscounts, "Inventory discounts retrieved successfully"))
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
      "triggerValue",
      "discountType",
      "discountValue",
      "scope",
    ])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    // Validate discount type
    if (!["expiration", "thc"].includes(body.type)) {
      return NextResponse.json(createApiResponse(null, "Type must be 'expiration' or 'thc'", false), { status: 400 })
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(body.discountType)) {
      return NextResponse.json(createApiResponse(null, "Discount type must be 'percentage' or 'fixed'", false), {
        status: 400,
      })
    }

    // Validate scope
    if (!["all", "category", "brand"].includes(body.scope)) {
      return NextResponse.json(createApiResponse(null, "Scope must be 'all', 'category', or 'brand'", false), {
        status: 400,
      })
    }

    // Validate trigger value
    if (typeof body.triggerValue !== "number" || body.triggerValue <= 0) {
      return NextResponse.json(createApiResponse(null, "Trigger value must be a positive number", false), {
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

    // Validate scope value if scope is not 'all'
    if (body.scope !== "all" && !body.scopeValue) {
      return NextResponse.json(createApiResponse(null, "Scope value is required when scope is not 'all'", false), {
        status: 400,
      })
    }

    const discount = await db.createInventoryDiscount({
      name: body.name,
      type: body.type,
      triggerValue: body.triggerValue,
      discountType: body.discountType,
      discountValue: body.discountValue,
      scope: body.scope,
      scopeValue: body.scopeValue,
      status: body.status || "active",
    })

    return NextResponse.json(createApiResponse(discount, "Inventory discount created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
