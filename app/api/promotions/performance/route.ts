// Promotion performance analytics API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"

// Mock performance data
const performanceData = [
  {
    promotionId: "1",
    promotionName: "Summer BOGO - Flower",
    type: "bogo",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    totalUses: 245,
    totalSavings: 12250.0,
    averageOrderValue: 125.5,
    conversionRate: 18.5,
    topProducts: [
      { productId: "1", productName: "Premium OG Kush", uses: 89 },
      { productId: "3", productName: "Blue Dream", uses: 67 },
    ],
    dailyMetrics: [
      { date: "2024-06-01", uses: 12, savings: 600.0 },
      { date: "2024-06-02", uses: 15, savings: 750.0 },
    ],
  },
  {
    promotionId: "2",
    promotionName: "Vape Bundle Deal",
    type: "bundle",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    totalUses: 89,
    totalSavings: 3560.0,
    averageOrderValue: 180.25,
    conversionRate: 12.3,
    topProducts: [{ productId: "2", productName: "Blue Dream Cartridge", uses: 89 }],
    dailyMetrics: [
      { date: "2024-07-01", uses: 3, savings: 120.0 },
      { date: "2024-07-02", uses: 5, savings: 200.0 },
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const promotionId = searchParams.get("promotionId")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredData = performanceData

    // Apply filters
    if (promotionId) {
      filteredData = filteredData.filter((d) => d.promotionId === promotionId)
    }

    if (type) {
      filteredData = filteredData.filter((d) => d.type === type)
    }

    if (startDate) {
      filteredData = filteredData.filter((d) => new Date(d.startDate) >= new Date(startDate))
    }

    if (endDate) {
      filteredData = filteredData.filter((d) => new Date(d.endDate) <= new Date(endDate))
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = filteredData.slice(start, end)

    // Calculate summary metrics
    const summary = {
      totalPromotions: filteredData.length,
      totalUses: filteredData.reduce((sum, d) => sum + d.totalUses, 0),
      totalSavings: filteredData.reduce((sum, d) => sum + d.totalSavings, 0),
      averageConversionRate:
        filteredData.length > 0 ? filteredData.reduce((sum, d) => sum + d.conversionRate, 0) / filteredData.length : 0,
    }

    return NextResponse.json(
      createApiResponse(
        {
          data: paginatedData,
          summary,
          pagination: {
            page,
            limit,
            total: filteredData.length,
            totalPages: Math.ceil(filteredData.length / limit),
          },
        },
        "Promotion performance data retrieved successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
