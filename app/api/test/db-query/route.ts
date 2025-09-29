import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const startTime = Date.now()

    // Execute the test query (with safety checks)
    const allowedQueries = [
      "SELECT * FROM products LIMIT 100",
      "SELECT * FROM pricing_rules WHERE active = true",
      "SELECT COUNT(*) FROM audit_logs WHERE created_at > NOW() - INTERVAL '1 day'",
    ]

    if (!allowedQueries.includes(query)) {
      return NextResponse.json({ error: "Query not allowed for testing" }, { status: 400 })
    }

    const { data, error } = await supabase.rpc("execute_test_query", {
      query_text: query,
    })

    const endTime = Date.now()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      executionTime: endTime - startTime,
      rowCount: data?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Database test failed" }, { status: 500 })
  }
}
