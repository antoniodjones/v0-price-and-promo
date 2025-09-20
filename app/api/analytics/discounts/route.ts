// Discount performance analytics API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"

// Mock discount analytics data
const discountAnalytics = [
  {
    discountId: "1",
    discountName: "Tier A Volume Discount",
    type: "customer",
    level: "tier",
    totalUsage: 1245,
    totalSavings: 45600.0,
    averageOrderValue: 156.8,
    conversionRate: 23.5,
    customerCount: 234,
    topProducts: [
      { productId: "1", productName: "Premium OG Kush", usage: 456 },
      { productId: "3", productName: "Blue Dream", usage: 289 },
    ],
    performanceByMonth: [
      { month: "Jan", usage: 189, savings: 6890.0 },
      { month: "Feb", usage: 234, savings: 8520.0 },
      { month: "Mar", usage: 198, savings: 7200.0 },
      { month: "Apr", usage: 267, savings: 9720.0 },
      { month: "May", usage: 289, savings: 10520.0 },
      { month: "Jun", usage: 312, savings: 11350.0 },
    ],
    roi: 3.2,
    status: "active",
  },
  {
    discountId: "2",
    discountName: "Expiring Inventory Auto-Discount",
    type: "inventory",
    level: "expiration",
    totalUsage: 892,
    totalSavings: 28900.0,
    averageOrderValue: 89.5,
    conversionRate: 45.2,
    customerCount: 456,
    topProducts: [
      { productId: "4", productName: "Sunset Sherbet", usage: 234 },
      { productId: "5", productName: "Gelato", usage: 189 },
    ],
    performanceByMonth: [
      { month: "Jan", usage: 134, savings: 4350.0 },
      { month: "Feb", usage: 156, savings: 5070.0 },
      { month: "Mar", usage: 142, savings: 4620.0 },
      { month: "Apr", usage: 167, savings: 5430.0 },
      { month: "May", usage: 178, savings: 5790.0 },
      { month: "Jun", usage: 189, savings: 6150.0 },
    ],
    roi: 2.8,
    status: "active",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy") || "totalSavings"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let filteredAnalytics = [...discountAnalytics]

    // Apply filters
    if (type) {
      filteredAnalytics = filteredAnalytics.filter((d) => d.type === type)
    }

    if (status) {
      filteredAnalytics = filteredAnalytics.filter((d) => d.status === status)
    }

    // Apply sorting
    filteredAnalytics.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] as number
      const bValue = b[sortBy as keyof typeof b] as number

      if (sortOrder === "desc") {
        return bValue - aValue
      } else {
        return aValue - bValue
      }
    })

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedAnalytics = filteredAnalytics.slice(start, end)

    // Calculate summary
    const summary = {
      totalDiscounts: filteredAnalytics.length,
      totalUsage: filteredAnalytics.reduce((sum, d) => sum + d.totalUsage, 0),
      totalSavings: filteredAnalytics.reduce((sum, d) => sum + d.totalSavings, 0),
      averageROI:
        filteredAnalytics.length > 0
          ? filteredAnalytics.reduce((sum, d) => sum + d.roi, 0) / filteredAnalytics.length
          : 0,
      averageConversionRate:
        filteredAnalytics.length > 0
          ? filteredAnalytics.reduce((sum, d) => sum + d.conversionRate, 0) / filteredAnalytics.length
          : 0,
    }

    return NextResponse.json(
      createApiResponse(
        {
          data: paginatedAnalytics,
          summary,
          pagination: {
            page,
            limit,
            total: filteredAnalytics.length,
            totalPages: Math.ceil(filteredAnalytics.length / limit),
          },
        },
        "Discount analytics retrieved successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
