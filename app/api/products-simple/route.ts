import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("[v0] Simple products API: Starting")

  try {
    // Create Supabase client directly
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    console.log("[v0] Simple products API: Environment variables exist:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    })

    if (!supabaseUrl || !supabaseKey) {
      console.log("[v0] Simple products API: Missing environment variables")
      return NextResponse.json({ error: "Missing environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("[v0] Simple products API: Supabase client created")

    // Simple query to get products
    const { data, error } = await supabase.from("products").select("*").limit(10)

    console.log("[v0] Simple products API: Query result:", {
      dataCount: data?.length,
      error: error?.message,
    })

    if (error) {
      console.log("[v0] Simple products API: Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Simple products API: Success, returning products")
    return NextResponse.json({ products: data || [] })
  } catch (error) {
    console.log("[v0] Simple products API: Caught error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
