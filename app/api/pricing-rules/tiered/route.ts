import { createServerClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: rules, error } = await supabase
      .from("tiered_pricing_rules")
      .select("*")
      .order("priority", { ascending: false })

    if (error) throw error

    return Response.json({ success: true, data: rules })
  } catch (error) {
    console.error("[v0] Error fetching tiered pricing rules:", error)
    return Response.json({ success: false, error: "Failed to fetch rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const { data: rule, error } = await supabase
      .from("tiered_pricing_rules")
      .insert({
        name: body.name,
        description: body.description,
        customer_tiers: body.customer_tiers,
        scope: body.scope,
        scope_id: body.scope_id,
        scope_value: body.scope_value,
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        priority: body.priority,
        status: body.status,
        start_date: body.start_date,
        end_date: body.end_date,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, data: rule })
  } catch (error) {
    console.error("[v0] Error creating tiered pricing rule:", error)
    return Response.json({ success: false, error: "Failed to create rule" }, { status: 500 })
  }
}
