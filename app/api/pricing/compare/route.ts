// Price comparison API for competitive analysis and optimization

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

// Mock competitive pricing data
const competitivePricing = [
  {
    productId: "1",
    productName: "Premium OG Kush",
    ourPrice: 45.0,
    competitors: [
      { name: "Competitor A", price: 48.0, market: "Illinois" },
      { name: "Competitor B", price: 42.0, market: "Illinois" },
      { name: "Competitor C", price: 46.5, market: "Illinois" },
    ],
    marketAverage: 45.5,
    pricePosition: "competitive",
    recommendedPrice: 44.0,
    potentialRevenue: 2400.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    productId: "2",
    productName: "Blue Dream Cartridge",
    ourPrice: 35.0,
    competitors: [
      { name: "Competitor A", price: 38.0, market: "Pennsylvania" },
      { name: "Competitor B", price: 36.0, market: "Pennsylvania" },
      { name: "Competitor C", price: 34.0, market: "Pennsylvania" },
    ],
    marketAverage: 36.0,
    pricePosition: "below_market",
    recommendedPrice: 36.5,
    potentialRevenue: 1800.0,
    lastUpdated: "2024-01-16T09:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Pricing compare API: Starting GET request")

    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")
    const market = searchParams.get("market")
    const category = searchParams.get("category")

    console.log("[v0] Pricing compare API: Query params", { productId, market, category })

    let comparisons = competitivePricing

    // Apply filters
    if (productId) {
      comparisons = comparisons.filter((c) => c.productId === productId)
    }

    if (market) {
      comparisons = comparisons.filter((c) =>
        c.competitors.some((comp) => comp.market.toLowerCase() === market.toLowerCase()),
      )
    }

    if (category) {
      // In a real implementation, you would filter by product category
      // For now, we'll return all comparisons
    }

    // Calculate summary metrics
    const summary = {
      totalProducts: comparisons.length,
      averageMarketPosition:
        comparisons.reduce((sum, c) => {
          const position = c.pricePosition === "above_market" ? 1 : c.pricePosition === "competitive" ? 0 : -1
          return sum + position
        }, 0) / comparisons.length,
      totalPotentialRevenue: comparisons.reduce((sum, c) => sum + c.potentialRevenue, 0),
      priceOptimizationOpportunities: comparisons.filter((c) => c.recommendedPrice !== c.ourPrice).length,
    }

    console.log("[v0] Pricing compare API: Returning", {
      comparisonsCount: comparisons.length,
      summary,
    })

    return NextResponse.json(
      createApiResponse(
        {
          comparisons,
          summary,
        },
        "Price comparison data retrieved successfully",
      ),
    )
  } catch (error) {
    console.error("[v0] Pricing compare API: Error", error)
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequiredFields(body, ["productIds", "market"])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    if (!Array.isArray(body.productIds) || body.productIds.length === 0) {
      return NextResponse.json(createApiResponse(null, "Product IDs array is required and cannot be empty", false), {
        status: 400,
      })
    }

    const results = []

    // Generate price comparison for each product
    for (const productId of body.productIds) {
      const product = await db.getProductById(productId)
      if (!product) {
        continue
      }

      // Mock competitive analysis
      const mockCompetitors = [
        { name: "Competitor A", price: product.price * (0.95 + Math.random() * 0.1) },
        { name: "Competitor B", price: product.price * (0.9 + Math.random() * 0.2) },
        { name: "Competitor C", price: product.price * (0.85 + Math.random() * 0.3) },
      ].map((comp) => ({ ...comp, market: body.market, price: Math.round(comp.price * 100) / 100 }))

      const marketAverage = mockCompetitors.reduce((sum, c) => sum + c.price, 0) / mockCompetitors.length
      const pricePosition =
        product.price > marketAverage * 1.05
          ? "above_market"
          : product.price < marketAverage * 0.95
            ? "below_market"
            : "competitive"

      const recommendedPrice = Math.round(marketAverage * 0.98 * 100) / 100
      const potentialRevenue = Math.abs(recommendedPrice - product.price) * 100 // Mock calculation

      results.push({
        productId: product.id,
        productName: product.name,
        ourPrice: product.price,
        competitors: mockCompetitors,
        marketAverage: Math.round(marketAverage * 100) / 100,
        pricePosition,
        recommendedPrice,
        potentialRevenue,
        lastUpdated: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      createApiResponse(
        {
          comparisons: results,
          generatedAt: new Date().toISOString(),
        },
        "Price comparison analysis generated successfully",
      ),
      { status: 201 },
    )
  } catch (error) {
    return handleApiError(error)
  }
}
