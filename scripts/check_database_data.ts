import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabaseData() {
  console.log("[v0] Checking database data status...")

  const tables = [
    "products",
    "customers",
    "customer_discounts",
    "inventory_discounts",
    "bogo_promotions",
    "bundle_deals",
    "promotion_tracking",
  ]

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

    if (error) {
      console.log(`[v0] ❌ Error checking ${table}:`, error.message)
    } else {
      console.log(`[v0] ${table}: ${count} records`)
    }
  }

  console.log("[v0] Database check complete!")
}

checkDatabaseData()
