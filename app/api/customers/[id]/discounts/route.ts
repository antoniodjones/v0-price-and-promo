import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get customer discount assignments
    const { data: assignments, error: assignError } = await supabase
      .from("customer_discount_assignments")
      .select(`
        *,
        customer_discounts (
          id,
          name,
          type,
          value,
          status,
          start_date,
          end_date
        )
      `)
      .eq("customer_id", id)

    if (assignError) throw assignError

    // Get pricing applications to calculate usage
    const { data: applications, error: appsError } = await supabase
      .from("pricing_applications")
      .select("*")
      .eq("customer_id", id)

    if (appsError) throw appsError

    // Aggregate discount usage
    const discountMap = new Map()

    assignments?.forEach((assignment) => {
      const discount = assignment.customer_discounts
      if (discount) {
        discountMap.set(discount.id, {
          id: discount.id,
          name: discount.name,
          type: discount.type,
          discount_value: discount.value,
          times_used: 0,
          total_savings: 0,
          last_used: null,
          status: discount.status,
        })
      }
    })

    applications?.forEach((app) => {
      // This is simplified - you'd need to track which discount was applied
      const discountId = app.volume_rule_id || app.tiered_rule_id
      if (discountId && discountMap.has(discountId)) {
        const discount = discountMap.get(discountId)
        discount.times_used++
        discount.total_savings += app.total_discount || 0
        if (!discount.last_used || app.applied_at > discount.last_used) {
          discount.last_used = app.applied_at
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: Array.from(discountMap.values()),
    })
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/discounts")
  }
}
