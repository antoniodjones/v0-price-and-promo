import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { status } = body

    const { data: alert, error } = await supabase
      .from("price_alerts")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating price alert:", error)
      return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
    }

    return NextResponse.json({ alert })
  } catch (error) {
    console.error("Price alert update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
