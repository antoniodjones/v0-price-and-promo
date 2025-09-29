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
    const productId = searchParams.get("product_id")
    const sourceId = searchParams.get("source_id")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const days = Number.parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let query = supabase
      .from("price_history")
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
      .gte("recorded_at", startDate.toISOString())
      .order("recorded_at", { ascending: false })
      .limit(limit)

    if (productId) {
      query = query.eq("product_id", productId)
    }

    if (sourceId) {
      query = query.eq("source_id", sourceId)
    }

    const { data: history, error } = await query

    if (error) {
      console.error("Error fetching price history:", error)
      return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 })
    }

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Price history API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
