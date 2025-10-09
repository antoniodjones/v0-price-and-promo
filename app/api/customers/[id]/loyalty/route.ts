import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Get customer
    const { data: customer, error: customerError } = await supabase.from("customers").select("*").eq("id", id).single()

    if (customerError) throw customerError

    // Get pricing applications
    const { data: applications, error: appsError } = await supabase
      .from("pricing_applications")
      .select("*")
      .eq("customer_id", id)

    if (appsError) throw appsError

    const totalSavings = applications?.reduce((sum, app) => sum + (app.total_discount || 0), 0) || 0

    const lifetimeValue = customer.total_purchases || 0
    const savingsRate = lifetimeValue > 0 ? (totalSavings / lifetimeValue) * 100 : 0

    // Calculate tier progress (simplified)
    const tierThresholds = {
      Standard: 0,
      Silver: 10000,
      Gold: 50000,
      Platinum: 100000,
    }

    const currentTier = customer.tier || "Standard"
    const tiers = Object.keys(tierThresholds)
    const currentTierIndex = tiers.indexOf(currentTier)
    const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null
    const nextTierThreshold = nextTier ? tierThresholds[nextTier as keyof typeof tierThresholds] : 0

    const tierProgress = nextTierThreshold > 0 ? Math.min((lifetimeValue / nextTierThreshold) * 100, 100) : 100

    // Calculate loyalty score (0-100)
    const purchaseFrequency = applications?.length || 0
    const avgDiscount =
      applications && applications.length > 0
        ? applications.reduce((sum, app) => {
            const discount =
              app.original_price > 0 ? ((app.original_price - app.final_price) / app.original_price) * 100 : 0
            return sum + discount
          }, 0) / applications.length
        : 0

    const loyaltyScore = Math.min(
      Math.round((lifetimeValue / 1000) * 0.4 + purchaseFrequency * 0.3 + savingsRate * 0.3),
      100,
    )

    return NextResponse.json({
      success: true,
      data: {
        lifetimeValue,
        totalSavings,
        savingsRate,
        tierProgress,
        nextTier,
        nextTierThreshold,
        loyaltyScore,
        purchaseFrequency: purchaseFrequency / 12, // per month (assuming 12 months)
        averageDiscount: avgDiscount,
      },
    })
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/loyalty")
  }
}
