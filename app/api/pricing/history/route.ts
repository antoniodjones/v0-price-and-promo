// Pricing history and audit trail API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"

// Mock pricing history data
const pricingHistory = [
  {
    id: "1",
    customerId: "1",
    productId: "1",
    market: "Illinois",
    originalPrice: 45.0,
    finalPrice: 38.25,
    discountAmount: 6.75,
    appliedDiscounts: [
      {
        type: "customer",
        name: "Tier A Discount",
        value: 6.75,
      },
    ],
    calculatedAt: "2024-01-15T14:30:00Z",
    calculatedBy: "system",
  },
  {
    id: "2",
    customerId: "2",
    productId: "2",
    market: "Pennsylvania",
    originalPrice: 35.0,
    finalPrice: 31.5,
    discountAmount: 3.5,
    appliedDiscounts: [
      {
        type: "customer",
        name: "Tier B Discount",
        value: 3.5,
      },
    ],
    calculatedAt: "2024-01-16T09:15:00Z",
    calculatedBy: "system",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const customerId = searchParams.get("customerId")
    const productId = searchParams.get("productId")
    const market = searchParams.get("market")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredHistory = pricingHistory

    // Apply filters
    if (customerId) {
      filteredHistory = filteredHistory.filter((h) => h.customerId === customerId)
    }

    if (productId) {
      filteredHistory = filteredHistory.filter((h) => h.productId === productId)
    }

    if (market) {
      filteredHistory = filteredHistory.filter((h) => h.market.toLowerCase() === market.toLowerCase())
    }

    if (startDate) {
      filteredHistory = filteredHistory.filter((h) => new Date(h.calculatedAt) >= new Date(startDate))
    }

    if (endDate) {
      filteredHistory = filteredHistory.filter((h) => new Date(h.calculatedAt) <= new Date(endDate))
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedHistory = filteredHistory.slice(start, end)

    return NextResponse.json(
      createApiResponse(
        {
          data: paginatedHistory,
          pagination: {
            page,
            limit,
            total: filteredHistory.length,
            totalPages: Math.ceil(filteredHistory.length / limit),
          },
        },
        "Pricing history retrieved successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
