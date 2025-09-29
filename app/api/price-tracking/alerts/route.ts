import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase
      .from("price_alerts")
      .select(`
        *,
        products (
          name,
          sku,
          category
        ),
        price_sources (
          name
        )
      `)
      .order("triggered_at", { ascending: false })
      .limit(limit)

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: alerts, error } = await query

    if (error) {
      console.error("Error fetching price alerts:", error)
      return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
    }

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Price alerts API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, alert_type, threshold_value, threshold_type } = body

    const { data: alert, error } = await supabase
      .from("price_alerts")
      .insert({
        product_id,
        alert_type,
        threshold_value,
        threshold_type,
        status: "active",
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating price alert:", error)
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
    }

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    console.error("Price alerts creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
