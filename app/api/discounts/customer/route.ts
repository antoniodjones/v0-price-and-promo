import { getCustomerDiscounts } from "@/lib/actions/customer-discounts"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const result = await getCustomerDiscounts()
  return Response.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Received discount creation request:", body)

    // Validate required fields
    if (!body.name || !body.level || !body.type || !body.value) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, level, type, value" },
        { status: 400 },
      )
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(body.type)) {
      return NextResponse.json({ success: false, error: "Type must be 'percentage' or 'fixed'" }, { status: 400 })
    }

    // Validate discount value
    if (typeof body.value !== "number" || body.value <= 0) {
      return NextResponse.json({ success: false, error: "Discount value must be a positive number" }, { status: 400 })
    }

    if (body.type === "percentage" && body.value > 100) {
      return NextResponse.json({ success: false, error: "Percentage discount cannot exceed 100%" }, { status: 400 })
    }

    // Validate dates
    if (!body.startDate) {
      return NextResponse.json({ success: false, error: "Start date is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create the customer discount
    const { data: discount, error } = await supabase
      .from("customer_discounts")
      .insert({
        name: body.name,
        type: body.type,
        value: body.value,
        level: body.level,
        target: body.target || null,
        customer_tiers: body.customerTiers || [],
        markets: body.markets || [],
        start_date: body.startDate,
        end_date: body.endDate || null,
        status: body.status || "active",
      })
      .select()
      .single()

    if (error) throw error

    console.log("[v0] Created discount:", discount)

    // If customerIds are provided, create assignments
    if (Array.isArray(body.customerIds) && body.customerIds.length > 0) {
      console.log("[v0] Creating customer assignments for:", body.customerIds)

      const assignmentsToInsert = body.customerIds.map((customerId: string) => ({
        discount_id: discount.id,
        customer_id: customerId,
      }))

      const { error: assignmentError } = await supabase
        .from("customer_discount_assignments")
        .insert(assignmentsToInsert)

      if (assignmentError) {
        console.error("[v0] Error creating assignments:", assignmentError)
      } else {
        console.log("[v0] Customer assignments created successfully")
      }
    }

    return NextResponse.json(
      { success: true, data: discount, message: "Customer discount created successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating customer discount:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create customer discount",
      },
      { status: 500 },
    )
  }
}
