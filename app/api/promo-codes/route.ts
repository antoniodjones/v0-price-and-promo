import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching promo codes:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch promo codes" }, { status: 500 })
    }

    // Update expired status based on end_date
    const now = new Date()
    const updatedData = data.map((code) => ({
      ...code,
      status: new Date(code.end_date) < now ? "expired" : code.status,
    }))

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error("[v0] Error in GET /api/promo-codes:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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
    if (!code || !discount_type || !discount_value || !start_date || !end_date) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (discount_value <= 0) {
      return NextResponse.json({ success: false, error: "Discount value must be greater than 0" }, { status: 400 })
    }

    if (discount_type === "percentage" && discount_value > 100) {
      return NextResponse.json({ success: false, error: "Percentage discount cannot exceed 100%" }, { status: 400 })
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return NextResponse.json({ success: false, error: "End date must be after start date" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .insert({
        code: code.toUpperCase(),
        description,
        discount_type,
        discount_value,
        min_purchase_amount: min_purchase_amount || 0,
        max_discount_amount,
        usage_limit,
        per_customer_limit: per_customer_limit || 1,
        start_date,
        end_date,
        status: status || "active",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating promo code:", error)
      if (error.code === "23505") {
        return NextResponse.json({ success: false, error: "Promo code already exists" }, { status: 409 })
      }
      return NextResponse.json({ success: false, error: "Failed to create promo code" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/promo-codes:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
