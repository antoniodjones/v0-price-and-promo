// Pricing calculation API endpoint

import { type NextRequest, NextResponse } from "next/server"
import { pricingEngine } from "@/lib/pricing/engine"
import { createApiResponse, handleApiError, validateRequestBody } from "@/lib/api/utils"
import { PricingRequestSchema } from "@/lib/schemas"
import { logInfo, logError } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    logInfo("Pricing calculation API called")

    const body = await request.json()
    const validatedData = validateRequestBody(PricingRequestSchema, body)

    // Initialize pricing engine for this customer and market
    await pricingEngine.initialize(validatedData.customerId, validatedData.market)

    // Calculate pricing
    const result = await pricingEngine.calculatePricing(validatedData.items)

    logInfo(`Pricing calculated successfully for ${validatedData.items.length} items`)

    return NextResponse.json(createApiResponse(result, "Pricing calculated successfully"), { status: 200 })
  } catch (error) {
    logError("Pricing calculation failed", error)
    return handleApiError(error, "pricing calculation")
  }
}
