import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json(createApiResponse({ products: [], customers: [] }, "Search query too short"))
    }

    const [products, customers] = await Promise.all([db.searchProducts(query.trim()), db.searchCustomers(query.trim())])

    return NextResponse.json(
      createApiResponse(
        {
          products: products.slice(0, 5),
          customers: customers.slice(0, 5),
          query: query,
        },
        "Search completed successfully",
      ),
    )
  } catch (error) {
    console.error("Search API error:", error)
    return handleApiError(error)
  }
}
