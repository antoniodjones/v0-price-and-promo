import { kv } from "@vercel/kv"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return Response.json({ success: false, error: "Key is required" }, { status: 400 })
    }

    const data = await kv.get(key)

    return Response.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("[v0] Error getting KV data:", error)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
