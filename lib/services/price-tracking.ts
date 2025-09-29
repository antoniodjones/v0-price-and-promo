import { createClient } from "@/lib/supabase/server"
import type { PriceHistory, PriceSource, CompetitorAnalysis } from "@/lib/types"

export async function recordPriceHistory(
  productId: string,
  sourceId: string,
  price: number,
  originalPrice?: number,
  availabilityStatus = "available",
  metadata?: any,
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("price_history")
    .insert([
      {
        product_id: productId,
        source_id: sourceId,
        price,
        original_price: originalPrice,
        availability_status: availabilityStatus,
        scraped_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        metadata,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error recording price history:", error)
    throw error
  }

  return data as PriceHistory
}

export async function getPriceHistory(productId: string, days = 30) {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("price_history")
    .select(`
      *,
      source:price_sources(name, website_url)
    `)
    .eq("product_id", productId)
    .gte("scraped_at", startDate.toISOString())
    .order("scraped_at", { ascending: true })

  if (error) {
    console.error("Error fetching price history:", error)
    return []
  }

  return data
}

export async function getPriceSources() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("price_sources").select("*").eq("is_active", true).order("name")

  if (error) {
    console.error("Error fetching price sources:", error)
    return []
  }

  return data as PriceSource[]
}

export async function createPriceSource(source: Omit<PriceSource, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("price_sources").insert([source]).select().single()

  if (error) {
    console.error("Error creating price source:", error)
    throw error
  }

  return data as PriceSource
}

export async function runPriceCheck(productId: string) {
  // This would typically integrate with external APIs or web scraping
  // For demo purposes, we'll simulate price updates
  const supabase = await createClient()

  // Get active price sources
  const sources = await getPriceSources()

  for (const source of sources) {
    // Simulate price fetching with some variation
    const basePrice = Math.random() * 100 + 20
    const variation = (Math.random() - 0.5) * 10
    const simulatedPrice = Math.max(basePrice + variation, 5)

    await recordPriceHistory(
      productId,
      source.id,
      simulatedPrice,
      simulatedPrice * 1.1, // Original price slightly higher
      "available",
      {
        source_url: source.website_url,
        last_check: new Date().toISOString(),
        method: "simulated",
      },
    )
  }
}

export async function getCompetitorAnalysis(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("competitor_analysis")
    .select("*")
    .eq("product_id", productId)
    .order("analysis_date", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching competitor analysis:", error)
    return []
  }

  return data as CompetitorAnalysis[]
}

export async function createCompetitorAnalysis(analysis: Omit<CompetitorAnalysis, "id">) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("competitor_analysis").insert([analysis]).select().single()

  if (error) {
    console.error("Error creating competitor analysis:", error)
    throw error
  }

  return data as CompetitorAnalysis
}

export async function checkPriceAlerts() {
  const supabase = await createClient()

  const { error } = await supabase.rpc("check_price_alerts")

  if (error) {
    console.error("Error checking price alerts:", error)
    throw error
  }
}
