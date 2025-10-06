import { type NextRequest, NextResponse } from "next/server"
import { getCustomerDiscount, updateCustomerDiscount, deleteCustomerDiscount } from "@/lib/actions/customer-discounts"

interface CustomerAssignment {
  customer_id: string
  [key: string]: unknown
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Fetching discount with ID:", params.id)
    const result = await getCustomerDiscount(params.id)
    console.log("[v0] getCustomerDiscount result:", result)

    if (!result.success) {
      console.log("[v0] Discount not found:", result.error)
      return NextResponse.json(
        { success: false, error: result.error || "Customer discount not found" },
        { status: 404 },
      )
    }

    const customerIds = (result.data.assignments as CustomerAssignment[] | undefined)?.map((a) => a.customer_id) || []
    console.log("[v0] Extracted customer IDs:", customerIds)

    const responseData = {
      ...result.data,
      customer_ids: customerIds,
    }
    console.log("[v0] Returning discount data:", responseData)

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("[v0] Error fetching customer discount:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch customer discount" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    console.log("[v0] Updating discount:", params.id, body)

    // Validate fields if provided
    if (body.type && !["percentage", "fixed"].includes(body.type)) {
      return NextResponse.json({ success: false, error: "Type must be 'percentage' or 'fixed'" }, { status: 400 })
    }

    if (body.value !== undefined) {
      if (typeof body.value !== "number" || body.value <= 0) {
        return NextResponse.json({ success: false, error: "Value must be a positive number" }, { status: 400 })
      }
      if (body.type === "percentage" && body.value > 100) {
        return NextResponse.json({ success: false, error: "Percentage discount cannot exceed 100%" }, { status: 400 })
      }
    }

    const result = await updateCustomerDiscount(params.id, {
      name: body.name,
      value: body.value,
      start_date: body.startDate,
      end_date: body.endDate,
      status: body.status,
      customer_ids: body.customerIds,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data, message: "Customer discount updated successfully" })
  } catch (error) {
    console.error("[v0] Error updating customer discount:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update customer discount" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteCustomerDiscount(params.id)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Customer discount deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting customer discount:", error)
    return NextResponse.json({ success: false, error: "Failed to delete customer discount" }, { status: 500 })
  }
}
