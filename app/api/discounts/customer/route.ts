// Customer discount management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"
import { CreateCustomerDiscountSchema } from "@/lib/schemas"
import { validateRequestBody } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const level = searchParams.get("level")
    const market = searchParams.get("market")

    const discounts = await db.getCustomerDiscounts()

    // Apply filters
    let filteredDiscounts = discounts
    if (status) {
      filteredDiscounts = filteredDiscounts.filter((d) => d.status === status)
    }
    if (level) {
      filteredDiscounts = filteredDiscounts.filter((d) => d.level === level)
    }
    if (market) {
      filteredDiscounts = filteredDiscounts.filter((d) => d.markets.includes(market))
    }

    return NextResponse.json(createApiResponse(filteredDiscounts, "Customer discounts retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = validateRequestBody(CreateCustomerDiscountSchema, body)

    const discount = await db.createCustomerDiscount(validatedData)

    return NextResponse.json(createApiResponse(discount, "Customer discount created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
