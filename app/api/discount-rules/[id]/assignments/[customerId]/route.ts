// Tier Assignment API - Delete specific customer assignment

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function DELETE(request: NextRequest, { params }: { params: { id: string; customerId: string } }) {
  try {
    const ruleId = params.id
    const customerId = params.customerId

    // Verify rule exists
    const rule = await db.getDiscountRule(ruleId)
    if (!rule) {
      return NextResponse.json(createApiResponse(null, "Discount rule not found", false), { status: 404 })
    }

    // Get deleted_by from query params or body
    const searchParams = request.nextUrl.searchParams
    const deletedBy = searchParams.get("deleted_by") || undefined

    await db.deleteTierAssignment(ruleId, customerId, deletedBy)

    return NextResponse.json(createApiResponse(null, "Tier assignment deleted successfully"))
  } catch (error) {
    return handleApiError(error, "DELETE /api/discount-rules/[id]/assignments/[customerId]")
  }
}
