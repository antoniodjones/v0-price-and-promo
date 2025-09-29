import { type NextRequest, NextResponse } from "next/server"
import { pricingCalculatorTests } from "@/tests/pricing-calculator.test"
import { apiIntegrationTests } from "@/tests/api-integration.test"

export async function POST(request: NextRequest) {
  try {
    const { suiteType, filter } = await request.json()

    let runner
    switch (suiteType) {
      case "unit":
        runner = pricingCalculatorTests
        break
      case "integration":
        runner = apiIntegrationTests
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid suite type" }, { status: 400 })
    }

    const results = await runner.run(filter)

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error running tests:", error)
    return NextResponse.json({ success: false, error: "Failed to run tests" }, { status: 500 })
  }
}
