// Tier Assignments API - Assign customers to tiers for a specific rule

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: ruleId } = await params

    // Verify rule exists
    const rule = await db.getDiscountRule(ruleId)
    if (!rule) {
      return NextResponse.json(createApiResponse(null, "Discount rule not found", false), { status: 404 })
    }

    // Get all assignments for this rule
    const assignments = await db.getCustomerTierAssignments({ rule_id: ruleId })

    // Get customer details for each assignment
    const assignmentsWithCustomers = await Promise.all(
      assignments.map(async (assignment) => {
        const customer = await db.getCustomer(assignment.customer_id)
        return {
          ...assignment,
          customer,
        }
      }),
    )

    return NextResponse.json(createApiResponse(assignmentsWithCustomers, "Tier assignments retrieved successfully"))
  } catch (error) {
    return handleApiError(error, "GET /api/discount-rules/[id]/assignments")
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: ruleId } = await params
    const body = await request.json()

    // Verify rule exists
    const rule = await db.getDiscountRule(ruleId)
    if (!rule) {
      return NextResponse.json(createApiResponse(null, "Discount rule not found", false), { status: 404 })
    }

    // Validate required fields
    const validationError = validateRequiredFields(body, ["customer_id", "tier"])

    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    // Validate tier value
    if (!["A", "B", "C"].includes(body.tier)) {
      return NextResponse.json(createApiResponse(null, "Tier must be A, B, or C", false), { status: 400 })
    }

    // Verify customer exists
    const customer = await db.getCustomer(body.customer_id)
    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    // Create or update assignment
    const assignment = await db.createTierAssignment({
      rule_id: ruleId,
      customer_id: body.customer_id,
      tier: body.tier,
      assigned_by: body.assigned_by,
      notes: body.notes,
    })

    return NextResponse.json(createApiResponse(assignment, "Tier assignment created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error, "POST /api/discount-rules/[id]/assignments")
  }
}
