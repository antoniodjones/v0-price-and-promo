import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("tier")
      .eq("id", id)
      .single()

    if (customerError) throw customerError

    // Get recent pricing applications for this customer
    const { data: applications, error: appsError } = await supabase
      .from("pricing_applications")
      .select(`
        *,
        products (
          name,
          price
        )
      `)
      .eq("customer_id", id)
      .limit(20)

    if (appsError) throw appsError

    // Create comparison data
    const comparisons =
      applications?.map((app) => {
        const standardPrice = app.products?.price || app.original_price
        const customerPrice = app.final_price
        const savings = standardPrice - customerPrice
        const savingsPercent = standardPrice > 0 ? (savings / standardPrice) * 100 : 0

        return {
          product_name: app.products?.name || "Unknown Product",
          standard_price: standardPrice,
          customer_price: customerPrice,
          savings,
          savings_percent: savingsPercent,
          tier_benefit: `${customer.tier} Tier Pricing`,
        }
      }) || []

    return NextResponse.json({
      success: true,
      data: comparisons,
    })
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/pricing-comparison")
  }
}
