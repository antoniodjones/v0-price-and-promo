import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { assignments } = await request.json()

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid assignments data" }, { status: 400 })
    }

    const supabase = await createClient()
    const results = []

    for (const assignment of assignments) {
      try {
        // Check if assignment already exists
        const { data: existing } = await supabase
          .from("customer_tier_assignments")
          .select("id")
          .eq("customer_id", assignment.customer_id)
          .eq("rule_id", assignment.discount_rule_id)
          .single()

        if (existing) {
          // Update existing assignment
          await supabase
            .from("customer_tier_assignments")
            .update({
              tier: assignment.tier,
              notes: assignment.notes || null,
              assigned_at: new Date().toISOString(),
            })
            .eq("id", existing.id)
        } else {
          // Create new assignment
          await supabase.from("customer_tier_assignments").insert({
            rule_id: assignment.discount_rule_id,
            customer_id: assignment.customer_id,
            tier: assignment.tier,
            notes: assignment.notes || null,
            assigned_at: new Date().toISOString(),
          })
        }

        results.push({
          success: true,
          customer_id: assignment.customer_id,
          discount_rule_id: assignment.discount_rule_id,
          tier: assignment.tier,
        })
      } catch (error) {
        console.error("Error processing assignment:", error)
        results.push({
          success: false,
          customer_id: assignment.customer_id,
          discount_rule_id: assignment.discount_rule_id,
          tier: assignment.tier,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          successful: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success).length,
        },
      },
    })
  } catch (error) {
    console.error("Error processing bulk assignments:", error)
    return NextResponse.json({ success: false, error: "Failed to process assignments" }, { status: 500 })
  }
}
