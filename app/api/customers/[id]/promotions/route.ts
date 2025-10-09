import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Get customer to check their tier
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("tier, market")
      .eq("id", params.id)
      .single()

    if (customerError) throw customerError

    // Get active customer discounts that match this customer's tier
    const { data: discounts, error: discountsError } = await supabase
      .from("customer_discounts")
      .select("*")
      .eq("status", "active")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .contains("customer_tiers", [customer.tier])

    if (discountsError) throw discountsError

    // Get active BOGO promotions
    const { data: bogos, error: bogosError } = await supabase
      .from("bogo_promotions")
      .select("*")
      .eq("status", "active")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())

    if (bogosError) throw bogosError

    // Get active bundle deals
    const { data: bundles, error: bundlesError } = await supabase
      .from("bundle_deals")
      .select("*")
      .eq("status", "active")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())

    if (bundlesError) throw bundlesError

    const allPromotions = [
      ...(discounts || []).map((d) => ({ ...d, type: "Customer Discount" })),
      ...(bogos || []).map((b) => ({ ...b, type: "BOGO" })),
      ...(bundles || []).map((b) => ({ ...b, type: "Bundle Deal" })),
    ]

    return NextResponse.json({
      success: true,
      data: allPromotions,
    })
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/promotions")
  }
}
