import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: purchases, error } = await supabase
      .from("pricing_applications")
      .select(`
        *,
        products (
          name
        )
      `)
      .eq("customer_id", id)
      .order("applied_at", { ascending: false })
      .limit(100)

    if (error) throw error

    const formattedPurchases = purchases?.map((p) => ({
      ...p,
      product_name: p.products?.name || "Unknown Product",
    }))

    return NextResponse.json({
      success: true,
      data: formattedPurchases || [],
    })
  } catch (error) {
    return handleApiError(error, "GET /api/customers/[id]/purchases")
  }
}
