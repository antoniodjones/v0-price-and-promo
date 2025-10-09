import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Get pricing applications for this customer
    const { data: applications, error: appsError } = await supabase
      .from("pricing_applications")
      .select("*")
      .eq("customer_id", id)

    if (appsError) throw appsError

    const totalSavings = applications?.reduce((sum, app) => sum + (app.total_discount || 0), 0) || 0

    const totalSpend = applications?.reduce((sum, app) => sum + (app.final_price || 0) * (app.quantity || 1), 0) || 0

    const orderCount = new Set(applications?.map((app) => app.order_id)).size

    const averageOrderValue = orderCount > 0 ? totalSpend / orderCount : 0

    // Get active promotions count
    const { data: promotions, error: promosError } = await supabase
      .from("customer_discounts")
      .select("id")
      .eq("status", "active")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())

    if (promosError) throw promosError

    const savingsRate = totalSpend > 0 ? (totalSavings / totalSpend) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        totalSpend,
        totalSavings,
        averageOrderValue,
        orderCount,
        activePromotions: promotions?.length || 0,
        savingsRate,
      },
    })
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/overview")
  }
}
