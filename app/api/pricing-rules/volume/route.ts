import { createServerClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: rules, error } = await supabase
      .from("volume_pricing_rules")
      .select(
        `
        *,
        tiers:volume_pricing_tiers(*)
      `,
      )
      .order("created_at", { ascending: false })

    if (error) throw error

    return Response.json({ success: true, data: rules })
  } catch (error) {
    console.error("[v0] Error fetching volume pricing rules:", error)
    return Response.json({ success: false, error: "Failed to fetch rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const { data: rule, error: ruleError } = await supabase
      .from("volume_pricing_rules")
      .insert({
        name: body.name,
        description: body.description,
        scope: body.scope,
        scope_value: body.scope_value,
        status: body.status,
        start_date: body.start_date,
        end_date: body.end_date,
      })
      .select()
      .single()

    if (ruleError) throw ruleError

    if (body.tiers && body.tiers.length > 0) {
      const tiersToInsert = body.tiers.map((tier: any) => ({
        rule_id: rule.id,
        min_quantity: tier.min_quantity,
        max_quantity: tier.max_quantity,
        discount_type: tier.discount_type,
        discount_value: tier.discount_value,
        tier_label: tier.tier_label,
      }))

      const { error: tiersError } = await supabase.from("volume_pricing_tiers").insert(tiersToInsert)

      if (tiersError) throw tiersError
    }

    return Response.json({ success: true, data: rule })
  } catch (error) {
    console.error("[v0] Error creating volume pricing rule:", error)
    return Response.json({ success: false, error: "Failed to create rule" }, { status: 500 })
  }
}
