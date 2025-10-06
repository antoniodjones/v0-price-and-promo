import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

interface TierAssignment {
  customer_id: string
  discount_rule_id: string
  tier: string
  [key: string]: unknown
}

interface ValidationResult {
  row: number
  data: TierAssignment
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface Customer {
  id: string
  [key: string]: unknown
}

interface DiscountRule {
  id: string
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const { assignments } = await request.json()

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid assignments data" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const customerIds = [...new Set(assignments.map((a: TierAssignment) => a.customer_id))]
    const ruleIds = [...new Set(assignments.map((a: TierAssignment) => a.discount_rule_id))]

    const [{ data: customers }, { data: rules }] = await Promise.all([
      supabase.from("customers").select("id").in("id", customerIds),
      supabase.from("discount_rules").select("id").in("id", ruleIds),
    ])

    const validCustomerIds = new Set((customers || []).map((c: Customer) => c.id))
    const validRuleIds = new Set((rules || []).map((r: DiscountRule) => r.id))

    const validations: ValidationResult[] = assignments.map((assignment: TierAssignment, index: number) => {
      const errors: string[] = []
      const warnings: string[] = []

      if (!validCustomerIds.has(assignment.customer_id)) {
        errors.push("Customer ID not found")
      }

      if (!validRuleIds.has(assignment.discount_rule_id)) {
        errors.push("Discount rule ID not found")
      }

      if (!["A", "B", "C"].includes(assignment.tier)) {
        errors.push("Invalid tier (must be A, B, or C)")
      }

      const duplicates = assignments.filter(
        (a: TierAssignment, i: number) =>
          i !== index && a.customer_id === assignment.customer_id && a.discount_rule_id === assignment.discount_rule_id,
      )
      if (duplicates.length > 0) {
        warnings.push("Duplicate assignment in CSV")
      }

      return {
        row: index + 2,
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
          valid: validations.filter((v: ValidationResult) => v.valid).length,
          invalid: validations.filter((v: ValidationResult) => !v.valid).length,
          warnings: validations.filter((v: ValidationResult) => v.warnings.length > 0).length,
        },
      },
    })
  } catch (error) {
    console.error("Error validating bulk assignments:", error)
    return NextResponse.json({ success: false, error: "Failed to validate assignments" }, { status: 500 })
  }
}
