import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import type { Watchlist, Product } from "@/lib/types"

export async function getUserWatchlist(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("watchlists")
    .select(`
      *,
      product:products(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching watchlist:", error)
    return []
  }

  return data as (Watchlist & { product: Product })[]
}

export async function addToWatchlist(userId: string, productId: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("watchlists")
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single()

  if (error) {
    console.error("Error adding to watchlist:", error)
    throw error
  }

  return data as Watchlist
}

export async function removeFromWatchlist(userId: string, productId: string) {
  const supabase = createBrowserClient()

  const { error } = await supabase.from("watchlists").delete().eq("user_id", userId).eq("product_id", productId)

  if (error) {
    console.error("Error removing from watchlist:", error)
    throw error
  }
}

export async function isInWatchlist(userId: string, productId: string): Promise<boolean> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("watchlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error checking watchlist:", error)
    return false
  }

  return !!data
}
