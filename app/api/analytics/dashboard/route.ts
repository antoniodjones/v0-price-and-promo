// Dashboard analytics API with key metrics

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

// Mock analytics data
const dashboardMetrics = {
  overview: {
    totalCustomers: 1247,
    activeDiscounts: 23,
    totalSavings: 125430.5,
    averageDiscountRate: 12.5,
    systemHealth: 99.8,
    responseTime: 145,
  },
  discountDistribution: [
    { type: "Customer Discounts", count: 15, percentage: 65.2 },
    { type: "Inventory Discounts", count: 5, percentage: 21.7 },
    { type: "BOGO Promotions", count: 2, percentage: 8.7 },
    { type: "Bundle Deals", count: 1, percentage: 4.3 },
  ],
  monthlyTrends: [
    { month: "Jan", savings: 18500, orders: 245 },
    { month: "Feb", savings: 22100, orders: 289 },
    { month: "Mar", savings: 19800, orders: 267 },
    { month: "Apr", savings: 25600, orders: 312 },
    { month: "May", savings: 28900, orders: 345 },
    { month: "Jun", savings: 31200, orders: 378 },
  ],
  topPerformingDiscounts: [
    { id: "1", name: "Tier A Volume Discount", usage: 1245, savings: 45600.0 },
    { id: "2", name: "Expiring Inventory Auto-Discount", usage: 892, savings: 28900.0 },
    { id: "3", name: "Summer BOGO - Flower", usage: 567, savings: 18750.0 },
  ],
  customerSegmentation: [
    { tier: "A", count: 234, totalSpend: 125600.0, avgDiscount: 15.2 },
    { tier: "B", count: 456, totalSpend: 189400.0, avgDiscount: 12.8 },
    { tier: "C", count: 557, totalSpend: 167800.0, avgDiscount: 8.5 },
  ],
  alerts: [
    {
      id: "1",
      type: "warning",
      message: "High inventory discount usage detected for Flower category",
      timestamp: "2024-01-20T14:30:00Z",
    },
    {
      id: "2",
      type: "info",
      message: "New customer tier assignments completed",
      timestamp: "2024-01-20T12:15:00Z",
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateRange = searchParams.get("dateRange") || "30d"
    const market = searchParams.get("market")

    // In a real implementation, you would filter data based on dateRange and market
    const filteredMetrics = { ...dashboardMetrics }

    if (market) {
      // Filter metrics by market (mock implementation)
      filteredMetrics.overview.totalCustomers = Math.floor(dashboardMetrics.overview.totalCustomers * 0.6)
      filteredMetrics.overview.totalSavings = dashboardMetrics.overview.totalSavings * 0.6
    }

    return NextResponse.json(createApiResponse(filteredMetrics, "Dashboard analytics retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
