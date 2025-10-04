// Tier Assignment Audit API - Get audit log of tier changes

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters: any = {}

    if (searchParams.get("rule_id")) {
      filters.rule_id = searchParams.get("rule_id")
    }
    if (searchParams.get("customer_id")) {
      filters.customer_id = searchParams.get("customer_id")
    }
    if (searchParams.get("start_date")) {
      filters.startDate = new Date(searchParams.get("start_date")!)
    }
    if (searchParams.get("end_date")) {
      filters.endDate = new Date(searchParams.get("end_date")!)
    }

    const auditLog = await db.getTierAssignmentAudit(filters)

    return NextResponse.json(createApiResponse(auditLog, "Audit log retrieved successfully"))
  } catch (error) {
    return handleApiError(error, "GET /api/tier-assignments/audit")
  }
}
