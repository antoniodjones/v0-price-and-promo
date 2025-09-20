// Market-specific pricing strategy API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

// Mock market pricing strategies
const marketStrategies = [
  {
    id: "1",
    market: "Illinois",
    strategy: "volume",
    tiers: [
      { minQuantity: 1, maxQuantity: 10, discountPercentage: 0 },
      { minQuantity: 11, maxQuantity: 50, discountPercentage: 5 },
      { minQuantity: 51, maxQuantity: 100, discountPercentage: 10 },
      { minQuantity: 101, maxQuantity: null, discountPercentage: 15 },
    ],
    customerGroups: ["A", "B"],
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    market: "Pennsylvania",
    strategy: "tiered",
    tiers: [
      { tier: "A", discountPercentage: 15 },
      { tier: "B", discountPercentage: 10 },
      { tier: "C", discountPercentage: 5 },
    ],
    status: "active",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = searchParams.get("market")
    const status = searchParams.get("status")

    let strategies = marketStrategies

    if (market) {
      strategies = strategies.filter((s) => s.market.toLowerCase() === market.toLowerCase())
    }

    if (status) {
      strategies = strategies.filter((s) => s.status === status)
    }

    return NextResponse.json(createApiResponse(strategies, "Market pricing strategies retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequiredFields(body, ["market", "strategy", "tiers"])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    if (!["volume", "tiered"].includes(body.strategy)) {
      return NextResponse.json(createApiResponse(null, "Strategy must be 'volume' or 'tiered'", false), {
        status: 400,
      })
    }

    if (!Array.isArray(body.tiers) || body.tiers.length === 0) {
      return NextResponse.json(createApiResponse(null, "Tiers array is required and cannot be empty", false), {
        status: 400,
      })
    }

    // Validate tiers based on strategy
    if (body.strategy === "volume") {
      for (const tier of body.tiers) {
        if (
          typeof tier.minQuantity !== "number" ||
          tier.minQuantity < 0 ||
          typeof tier.discountPercentage !== "number" ||
          tier.discountPercentage < 0 ||
          tier.discountPercentage > 100
        ) {
          return NextResponse.json(
            createApiResponse(null, "Volume tiers must have valid minQuantity and discountPercentage", false),
            { status: 400 },
          )
        }
      }
    } else if (body.strategy === "tiered") {
      const validTiers = ["A", "B", "C"]
      for (const tier of body.tiers) {
        if (
          !validTiers.includes(tier.tier) ||
          typeof tier.discountPercentage !== "number" ||
          tier.discountPercentage < 0 ||
          tier.discountPercentage > 100
        ) {
          return NextResponse.json(
            createApiResponse(null, "Tiered strategy must have valid tier (A/B/C) and discountPercentage", false),
            { status: 400 },
          )
        }
      }
    }

    const newStrategy = {
      id: Date.now().toString(),
      market: body.market,
      strategy: body.strategy,
      tiers: body.tiers,
      customerGroups: body.customerGroups || [],
      status: body.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real implementation, you would save this to the database
    marketStrategies.push(newStrategy)

    return NextResponse.json(createApiResponse(newStrategy, "Market pricing strategy created successfully"), {
      status: 201,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
