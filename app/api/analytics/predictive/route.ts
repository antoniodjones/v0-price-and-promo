// Predictive analytics API for demand forecasting and price sensitivity

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

// Mock predictive analytics data
const predictiveData = {
  demandForecast: {
    nextMonth: {
      totalDemand: 15600,
      confidence: 0.89,
      trend: "increasing",
      factors: [
        { factor: "Seasonal patterns", impact: 0.15, direction: "positive" },
        { factor: "Market expansion", impact: 0.08, direction: "positive" },
        { factor: "Competitor activity", impact: -0.05, direction: "negative" },
      ],
    },
    byProduct: [
      {
        productId: "1",
        productName: "Premium OG Kush",
        currentDemand: 1200,
        forecastedDemand: 1380,
        confidence: 0.92,
        priceElasticity: -0.8,
        optimalPriceRange: { min: 42, max: 48 },
      },
      {
        productId: "2",
        productName: "Blue Dream Cartridge",
        currentDemand: 950,
        forecastedDemand: 1050,
        confidence: 0.85,
        priceElasticity: -1.2,
        optimalPriceRange: { min: 32, max: 38 },
      },
    ],
  },
  priceSensitivity: {
    overall: {
      elasticity: -0.95,
      sensitivity: "moderate",
      optimalPriceIncrease: 0.03,
      revenueImpact: 0.12,
    },
    bySegment: [
      {
        segment: "Tier A Customers",
        elasticity: -0.6,
        sensitivity: "low",
        volumeShare: 0.35,
        revenueShare: 0.52,
      },
      {
        segment: "Tier B Customers",
        elasticity: -1.1,
        sensitivity: "moderate",
        volumeShare: 0.45,
        revenueShare: 0.38,
      },
      {
        segment: "Tier C Customers",
        elasticity: -1.8,
        sensitivity: "high",
        volumeShare: 0.2,
        revenueShare: 0.1,
      },
    ],
  },
  marketTrends: [
    {
      trend: "Premium Product Demand",
      direction: "increasing",
      strength: 0.78,
      timeframe: "next_quarter",
      description: "Growing demand for premium cannabis products across all markets",
    },
    {
      trend: "Volume Purchasing",
      direction: "stable",
      strength: 0.65,
      timeframe: "next_month",
      description: "Bulk purchasing patterns remain consistent with seasonal variations",
    },
    {
      trend: "Price Competition",
      direction: "intensifying",
      strength: 0.82,
      timeframe: "next_quarter",
      description: "Increased competitive pressure in Pennsylvania and Illinois markets",
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = searchParams.get("market")
    const analysisType = searchParams.get("type") || "all"

    let responseData = { ...predictiveData }

    // Filter by analysis type
    if (analysisType === "demand") {
      responseData = { demandForecast: responseData.demandForecast }
    } else if (analysisType === "sensitivity") {
      responseData = { priceSensitivity: responseData.priceSensitivity }
    } else if (analysisType === "trends") {
      responseData = { marketTrends: responseData.marketTrends }
    }

    return NextResponse.json(createApiResponse(responseData, "Predictive analytics data retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mock scenario analysis
    const scenario = {
      scenarioId: Date.now().toString(),
      parameters: body,
      results: {
        demandChange: Math.random() * 0.2 - 0.1, // -10% to +10%
        revenueChange: Math.random() * 0.15 - 0.05, // -5% to +10%
        marginChange: Math.random() * 0.1 - 0.02, // -2% to +8%
        confidence: 0.75 + Math.random() * 0.2, // 75% to 95%
      },
      recommendations: [
        "Monitor competitor response closely",
        "Consider gradual implementation over 2-3 weeks",
        "Focus on high-value customer segments first",
      ],
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(scenario, "Scenario analysis completed successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
