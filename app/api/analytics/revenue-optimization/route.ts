// Revenue optimization analytics API

import { type NextRequest, NextResponse } from "next/server"

// Mock revenue optimization data
const revenueOptimizationData = {
  summary: {
    totalRevenue: 12450000,
    optimizedRevenue: 13890000,
    potentialIncrease: 1440000,
    optimizationRate: 11.6,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  opportunities: [
    {
      id: "1",
      type: "price_increase",
      product: "Premium OG Kush",
      currentPrice: 45.0,
      suggestedPrice: 48.0,
      expectedVolumeChange: -5,
      expectedRevenueIncrease: 125000,
      confidence: 0.87,
      market: "Illinois",
      reasoning: "Market analysis shows 15% price elasticity tolerance",
    },
    {
      id: "2",
      type: "bundle_optimization",
      product: "Cartridge Bundle Deal",
      currentDiscount: 15,
      suggestedDiscount: 12,
      expectedVolumeChange: -2,
      expectedRevenueIncrease: 89000,
      confidence: 0.92,
      market: "Pennsylvania",
      reasoning: "Bundle demand remains strong with reduced discount",
    },
    {
      id: "3",
      type: "tier_adjustment",
      product: "Volume Tier Pricing",
      currentTier: "B",
      suggestedTier: "A",
      expectedVolumeChange: 8,
      expectedRevenueIncrease: 156000,
      confidence: 0.78,
      market: "Massachusetts",
      reasoning: "Customer purchase patterns indicate tier upgrade potential",
    },
  ],
  trends: [
    { month: "Jan", revenue: 1200000, optimized: 1320000, savings: 120000 },
    { month: "Feb", revenue: 1150000, optimized: 1295000, savings: 145000 },
    { month: "Mar", revenue: 1300000, optimized: 1456000, savings: 156000 },
    { month: "Apr", revenue: 1250000, optimized: 1400000, savings: 150000 },
    { month: "May", revenue: 1400000, optimized: 1568000, savings: 168000 },
    { month: "Jun", revenue: 1350000, optimized: 1512000, savings: 162000 },
  ],
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Revenue optimization API: Starting")

    const searchParams = request.nextUrl.searchParams
    const market = searchParams.get("market")
    const timeframe = searchParams.get("timeframe") || "6months"

    console.log("[v0] Revenue optimization API: market =", market, "timeframe =", timeframe)

    const filteredData = { ...revenueOptimizationData }

    // Apply market filter
    if (market && market !== "all") {
      console.log("[v0] Revenue optimization API: Filtering by market")
      filteredData.opportunities = filteredData.opportunities.filter(
        (opp) => opp.market.toLowerCase() === market.toLowerCase(),
      )
    }

    // Adjust data based on timeframe
    if (timeframe === "3months") {
      console.log("[v0] Revenue optimization API: Using 3 months timeframe")
      filteredData.trends = filteredData.trends.slice(-3)
    } else if (timeframe === "1year") {
      console.log("[v0] Revenue optimization API: Using 1 year timeframe")
      filteredData.trends = [
        ...Array(6)
          .fill(null)
          .map((_, i) => ({
            month: new Date(2023, 6 + i, 1).toLocaleDateString("en", { month: "short" }),
            revenue: 1000000 + Math.random() * 400000,
            optimized: 1100000 + Math.random() * 500000,
            savings: 100000 + Math.random() * 100000,
          })),
        ...filteredData.trends,
      ]
    }

    console.log("[v0] Revenue optimization API: Returning response")

    return NextResponse.json({
      success: true,
      data: filteredData,
      message: "Revenue optimization data retrieved successfully",
    })
  } catch (error) {
    console.error("[v0] Revenue optimization API: Error caught", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load revenue optimization data",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
