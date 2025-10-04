// Customer Tiers API - Get all tier assignments for a customer

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id

    // Verify customer exists
    const customer = await db.getCustomer(customerId)
    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    // Get all tier assignments for this customer
    const tiers = await db.getCustomerTiers(customerId)

    return NextResponse.json(
      createApiResponse(
        {
          customer,
          tiers,
        },
        "Customer tiers retrieved successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/tiers")
  }
}
