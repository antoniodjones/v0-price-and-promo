import { type NextRequest, NextResponse } from "next/server"

// Mock market pricing strategies
const marketStrategies = [
  {
    id: "1",
    market: "Illinois",
    name: "Illinois Volume Strategy",
    strategy: "volume",
    ruleLevel: "global",
    targetSelection: "all-products",
    tiers: [
      { minQuantity: 1, maxQuantity: 10, aTierDiscount: 0, bTierDiscount: 0, cTierDiscount: 0 },
      { minQuantity: 11, maxQuantity: 50, aTierDiscount: 5, bTierDiscount: 4, cTierDiscount: 3 },
      { minQuantity: 51, maxQuantity: 100, aTierDiscount: 10, bTierDiscount: 8, cTierDiscount: 6 },
      { minQuantity: 101, maxQuantity: null, aTierDiscount: 15, bTierDiscount: 12, cTierDiscount: 9 },
    ],
    customerGroups: ["A", "B", "C"],
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    market: "Pennsylvania",
    name: "Pennsylvania Tiered Strategy",
    strategy: "tiered",
    ruleLevel: "global",
    targetSelection: "all-products",
    tiers: [
      { tier: "A", discountPercentage: 15 },
      { tier: "B", discountPercentage: 10 },
      { tier: "C", discountPercentage: 5 },
    ],
    status: "active",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    market: "Massachusetts",
    name: "Total Order Volume - A Tier",
    strategy: "volume",
    ruleLevel: "global",
    targetSelection: "all-products",
    tiers: [
      { minQuantity: 50, maxQuantity: 75, aTierDiscount: 4.0, bTierDiscount: 3.0, cTierDiscount: 2.0 },
      { minQuantity: 76, maxQuantity: 99, aTierDiscount: 5.0, bTierDiscount: 4.0, cTierDiscount: 3.0 },
      { minQuantity: 100, maxQuantity: null, aTierDiscount: 6.0, bTierDiscount: 5.0, cTierDiscount: 4.0 },
    ],
    customerGroups: ["A", "B", "C"],
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]

function createApiResponse<T>(data?: T, message?: string, success = true) {
  return {
    success,
    data,
    message,
    ...(success ? {} : { error: message }),
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Market API GET: Request received")

    const searchParams = request.nextUrl.searchParams
    const market = searchParams.get("market")
    const status = searchParams.get("status")

    console.log("[v0] Market API GET: Query params", { market, status })

    let strategies = marketStrategies

    if (market) {
      strategies = strategies.filter((s) => s.market.toLowerCase() === market.toLowerCase())
      console.log("[v0] Market API GET: Filtered by market", market, "found", strategies.length, "strategies")
    }

    if (status) {
      strategies = strategies.filter((s) => s.status === status)
      console.log("[v0] Market API GET: Filtered by status", status, "found", strategies.length, "strategies")
    }

    console.log("[v0] Market API GET: Returning", strategies.length, "strategies")

    return NextResponse.json(createApiResponse(strategies, "Market pricing strategies retrieved successfully"))
  } catch (error) {
    console.error("[v0] Market API GET: Error", error)
    return NextResponse.json(createApiResponse(null, "Internal server error", false), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Market API POST: Request received")

    const body = await request.json()
    console.log("[v0] Market API POST: Request body", body)

    if (!body.market || !body.strategy || !body.tiers) {
      console.log("[v0] Market API POST: Missing required fields")
      return NextResponse.json(createApiResponse(null, "Missing required fields: market, strategy, tiers", false), {
        status: 400,
      })
    }

    if (!["volume", "tiered"].includes(body.strategy)) {
      console.log("[v0] Market API POST: Invalid strategy", body.strategy)
      return NextResponse.json(createApiResponse(null, "Strategy must be 'volume' or 'tiered'", false), { status: 400 })
    }

    if (!Array.isArray(body.tiers) || body.tiers.length === 0) {
      console.log("[v0] Market API POST: Invalid tiers", body.tiers)
      return NextResponse.json(createApiResponse(null, "Tiers array is required and cannot be empty", false), {
        status: 400,
      })
    }

    const newStrategy = {
      id: Date.now().toString(),
      market: body.market,
      name: body.name || `${body.strategy} Rule`,
      strategy: body.strategy,
      ruleLevel: body.ruleLevel || "global",
      targetSelection: body.targetSelection || "all-products",
      startDate: body.startDate,
      endDate: body.endDate,
      tiers: body.tiers,
      customerGroups: body.customerGroups || [],
      status: body.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real implementation, you would save this to the database
    marketStrategies.push(newStrategy)

    console.log("[v0] Market API POST: Created new strategy", newStrategy)
    console.log("[v0] Market API POST: Total strategies now:", marketStrategies.length)

    return NextResponse.json(createApiResponse(newStrategy, "Market pricing strategy created successfully"), {
      status: 201,
    })
  } catch (error) {
    console.error("[v0] Market API POST: Error", error)
    return NextResponse.json(createApiResponse(null, "Internal server error", false), { status: 500 })
  }
}
