import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const {
      code,
      description,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      usage_limit,
      per_customer_limit,
      start_date,
      end_date,
      status,
    } = body

    // Validation
    if (discount_value && discount_value <= 0) {
      return NextResponse.json({ success: false, error: "Discount value must be greater than 0" }, { status: 400 })
    }

    if (discount_type === "percentage" && discount_value > 100) {
      return NextResponse.json({ success: false, error: "Percentage discount cannot exceed 100%" }, { status: 400 })
    }

    if (start_date && end_date && new Date(end_date) <= new Date(start_date)) {
      return NextResponse.json({ success: false, error: "End date must be after start date" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .update({
        code: code?.toUpperCase(),
        description,
        discount_type,
        discount_value,
        min_purchase_amount,
        max_discount_amount,
        usage_limit,
        per_customer_limit,
        start_date,
        end_date,
        status,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating promo code:", error)
      if (error.code === "23505") {
        return NextResponse.json({ success: false, error: "Promo code already exists" }, { status: 409 })
      }
      return NextResponse.json({ success: false, error: "Failed to update promo code" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in PUT /api/promo-codes/[id]:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("promo_codes").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting promo code:", error)
      return NextResponse.json({ success: false, error: "Failed to delete promo code" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/promo-codes/[id]:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
