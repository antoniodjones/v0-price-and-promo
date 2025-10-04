import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { assignments } = await request.json()

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid assignments data" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Fetch all customers and discount rules for validation
    const customerIds = [...new Set(assignments.map((a: any) => a.customer_id))]
    const ruleIds = [...new Set(assignments.map((a: any) => a.discount_rule_id))]

    const [{ data: customers }, { data: rules }] = await Promise.all([
      supabase.from("customers").select("id").in("id", customerIds),
      supabase.from("discount_rules").select("id").in("id", ruleIds),
    ])

    const validCustomerIds = new Set((customers || []).map((c: any) => c.id))
    const validRuleIds = new Set((rules || []).map((r: any) => r.id))

    // Validate each assignment
    const validations = assignments.map((assignment: any, index: number) => {
      const errors: string[] = []
      const warnings: string[] = []

      // Validate customer ID
      if (!validCustomerIds.has(assignment.customer_id)) {
        errors.push("Customer ID not found")
      }

      // Validate discount rule ID
      if (!validRuleIds.has(assignment.discount_rule_id)) {
        errors.push("Discount rule ID not found")
      }

      // Validate tier
      if (!["A", "B", "C"].includes(assignment.tier)) {
        errors.push("Invalid tier (must be A, B, or C)")
      }

      // Check for duplicate assignments (warning)
      const duplicates = assignments.filter(
        (a: any, i: number) =>
          i !== index && a.customer_id === assignment.customer_id && a.discount_rule_id === assignment.discount_rule_id,
      )
      if (duplicates.length > 0) {
        warnings.push("Duplicate assignment in CSV")
      }

      return {
        row: index + 2, // +2 because row 1 is header and array is 0-indexed
        data: assignment,
        valid: errors.length === 0,
        errors,
        warnings,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        validations,
        summary: {
          total: validations.length,
          valid: validations.filter((v: any) => v.valid).length,
          invalid: validations.filter((v: any) => !v.valid).length,
          warnings: validations.filter((v: any) => v.warnings.length > 0).length,
        },
      },
    })
  } catch (error) {
    console.error("Error validating bulk assignments:", error)
    return NextResponse.json({ success: false, error: "Failed to validate assignments" }, { status: 500 })
  }
}
