// Product management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, createPaginatedResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"
import { CreateProductSchema } from "@/lib/schemas"
import { validateRequestBody } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Products API: Starting GET request")

    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    console.log("[v0] Products API: Pagination params - page:", page, "limit:", limit)

    // Get filter parameters
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const status = searchParams.get("status")

    console.log("[v0] Products API: Filters - category:", category, "brand:", brand, "status:", status)

    console.log("[v0] Products API: About to call db.getProducts")
    const { data, total } = await db.getProducts(page, limit)
    console.log("[v0] Products API: db.getProducts completed - data length:", data?.length, "total:", total)

    if (!data || data.length === 0) {
      console.log("[v0] Products API: No products found in database - returning empty array")
      return NextResponse.json(
        createPaginatedResponse(
          [],
          page,
          limit,
          0,
          "No products found. Database may be empty - please run seed script.",
        ),
        { status: 200 },
      )
    }

    // Apply filters (in a real implementation, this would be done in the database query)
    let filteredData = data
    if (category) {
      filteredData = filteredData.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase())
    }
    if (brand) {
      filteredData = filteredData.filter((p) => (p.brand || "").toLowerCase() === brand.toLowerCase())
    }

    console.log("[v0] Products API: After filtering:", filteredData.length, "products")

    return NextResponse.json(
      createPaginatedResponse(filteredData, page, limit, filteredData.length, "Products retrieved successfully"),
    )
  } catch (error) {
    console.error("[v0] Products API: Error occurred:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    console.error("[v0] Products API: Error details:", errorMessage)

    if (error instanceof Error) {
      console.error("[v0] Products API: Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch products: ${errorMessage}`,
        data: [],
        error:
          process.env.NODE_ENV === "development"
            ? {
                message: errorMessage,
                stack: error instanceof Error ? error.stack : undefined,
                details: error,
              }
            : undefined,
      },
      { status: 500 },
    )
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
