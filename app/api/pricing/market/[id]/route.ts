// Individual market pricing strategy API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

// Mock market strategies (in real app, this would come from database)
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const strategy = marketStrategies.find((s) => s.id === params.id)

    if (!strategy) {
      return NextResponse.json(createApiResponse(null, "Market pricing strategy not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(strategy, "Market pricing strategy retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const strategy = marketStrategies.find((s) => s.id === params.id)

    if (!strategy) {
      return NextResponse.json(createApiResponse(null, "Market pricing strategy not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate strategy if provided
    if (body.strategy && !["volume", "tiered"].includes(body.strategy)) {
      return NextResponse.json(createApiResponse(null, "Strategy must be 'volume' or 'tiered'", false), {
        status: 400,
      })
    }

    // In a real implementation, you would update the strategy in the database
    const updatedStrategy = {
      ...strategy,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedStrategy, "Market pricing strategy updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const strategy = marketStrategies.find((s) => s.id === params.id)

    if (!strategy) {
      return NextResponse.json(createApiResponse(null, "Market pricing strategy not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the strategy from the database
    return NextResponse.json(createApiResponse(null, "Market pricing strategy deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
