// Product management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, createPaginatedResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"
import { CreateProductSchema } from "@/lib/schemas"
import { validateRequestBody } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    // Get filter parameters
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const status = searchParams.get("status")

    const { data, total } = await db.getProducts(page, limit)

    // Apply filters (in a real implementation, this would be done in the database query)
    let filteredData = data
    if (category) {
      filteredData = filteredData.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }
    if (brand) {
      filteredData = filteredData.filter((p) => p.brand.toLowerCase() === brand.toLowerCase())
    }
    if (status) {
      filteredData = filteredData.filter((p) => p.status === status)
    }

    return NextResponse.json(
      createPaginatedResponse(filteredData, page, limit, filteredData.length, "Products retrieved successfully"),
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = validateRequestBody(CreateProductSchema, body)

    const product = await db.createProduct(validatedData)

    return NextResponse.json(createApiResponse(product, "Product created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
