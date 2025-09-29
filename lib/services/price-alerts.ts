import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import type { PriceAlert } from "@/lib/types"

export async function getUserPriceAlerts(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("price_alerts")
    .select(`
      *,
      product:products(*)
    `)
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching price alerts:", error)
    return []
  }

  return data
}

export async function createPriceAlert(
  userId: string,
  productId: string,
  targetPrice: number,
  alertType = "price_drop",
) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("price_alerts")
    .insert([
      {
        user_id: userId,
        product_id: productId,
        target_price: targetPrice,
        alert_type: alertType,
        is_active: true,
        notification_sent: false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating price alert:", error)
    throw error
  }

  return data as PriceAlert
}

export async function updatePriceAlert(id: string, updates: Partial<PriceAlert>) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("price_alerts").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating price alert:", error)
    throw error
  }

  return data as PriceAlert
}

export async function deletePriceAlert(id: string) {
  const supabase = createBrowserClient()

  const { error } = await supabase.from("price_alerts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting price alert:", error)
    throw error
  }
}
