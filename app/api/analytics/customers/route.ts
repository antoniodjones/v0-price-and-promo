// Customer analytics and insights API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"

// Mock customer analytics data
const customerAnalytics = [
  {
    customerId: "1",
    customerName: "Green Valley Dispensary",
    tier: "A",
    market: "Illinois",
    totalOrders: 45,
    totalSpend: 12560.0,
    totalSavings: 1884.0,
    averageOrderValue: 279.11,
    averageDiscount: 15.0,
    loyaltyScore: 92,
    lastOrderDate: "2024-01-18T14:30:00Z",
    topCategories: [
      { category: "Flower", spend: 7536.0, orders: 28 },
      { category: "Vape", spend: 3768.0, orders: 12 },
      { category: "Edibles", spend: 1256.0, orders: 5 },
    ],
    monthlyTrends: [
      { month: "Jan", orders: 8, spend: 2240.0, savings: 336.0 },
      { month: "Feb", orders: 9, spend: 2511.0, savings: 376.65 },
      { month: "Mar", orders: 7, spend: 1953.0, savings: 292.95 },
      { month: "Apr", orders: 10, spend: 2791.0, savings: 418.65 },
      { month: "May", orders: 11, spend: 3065.0, savings: 459.75 },
    ],
    riskFactors: [],
    recommendations: [
      "Consider volume-based pricing for increased order frequency",
      "Introduce category-specific promotions for Edibles",
    ],
  },
  {
    customerId: "2",
    customerName: "Urban Leaf Co",
    tier: "B",
    market: "Pennsylvania",
    totalOrders: 32,
    totalSpend: 8960.0,
    totalSavings: 896.0,
    averageOrderValue: 280.0,
    averageDiscount: 10.0,
    loyaltyScore: 78,
    lastOrderDate: "2024-01-19T11:15:00Z",
    topCategories: [
      { category: "Vape", spend: 5376.0, orders: 19 },
      { category: "Flower", spend: 2688.0, orders: 10 },
      { category: "Concentrates", spend: 896.0, orders: 3 },
    ],
    monthlyTrends: [
      { month: "Jan", orders: 6, spend: 1680.0, savings: 168.0 },
      { month: "Feb", orders: 7, spend: 1960.0, savings: 196.0 },
      { month: "Mar", orders: 5, spend: 1400.0, savings: 140.0 },
      { month: "Apr", orders: 7, spend: 1960.0, savings: 196.0 },
      { month: "May", orders: 7, spend: 1960.0, savings: 196.0 },
    ],
    riskFactors: ["Declining order frequency", "Below-average loyalty score"],
    recommendations: [
      "Implement retention campaign",
      "Offer tier upgrade incentives",
      "Increase engagement with personalized offers",
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const tier = searchParams.get("tier")
    const market = searchParams.get("market")
    const riskLevel = searchParams.get("riskLevel")
    const sortBy = searchParams.get("sortBy") || "totalSpend"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let filteredAnalytics = [...customerAnalytics]

    // Apply filters
    if (tier) {
      filteredAnalytics = filteredAnalytics.filter((c) => c.tier === tier)
    }

    if (market) {
      filteredAnalytics = filteredAnalytics.filter((c) => c.market.toLowerCase() === market.toLowerCase())
    }

    if (riskLevel) {
      if (riskLevel === "high") {
        filteredAnalytics = filteredAnalytics.filter((c) => c.riskFactors.length > 0)
      } else if (riskLevel === "low") {
        filteredAnalytics = filteredAnalytics.filter((c) => c.riskFactors.length === 0)
      }
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
      totalCustomers: filteredAnalytics.length,
      totalSpend: filteredAnalytics.reduce((sum, c) => sum + c.totalSpend, 0),
      totalSavings: filteredAnalytics.reduce((sum, c) => sum + c.totalSavings, 0),
      averageLoyaltyScore:
        filteredAnalytics.length > 0
          ? filteredAnalytics.reduce((sum, c) => sum + c.loyaltyScore, 0) / filteredAnalytics.length
          : 0,
      averageOrderValue:
        filteredAnalytics.length > 0
          ? filteredAnalytics.reduce((sum, c) => sum + c.averageOrderValue, 0) / filteredAnalytics.length
          : 0,
      highRiskCustomers: filteredAnalytics.filter((c) => c.riskFactors.length > 0).length,
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
        "Customer analytics retrieved successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
