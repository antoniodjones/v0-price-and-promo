import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { handleApiError, createApiResponse } from "@/lib/api/utils"
import { getBundleDeals, createBundleDeal } from "@/lib/api/database"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[v0] API: Getting bundle deals")
    const bundles = await getBundleDeals()
    console.log("[v0] API: Retrieved", bundles.length, "bundle deals")
    return NextResponse.json(createApiResponse(bundles, "Bundle deals retrieved successfully"))
  } catch (error) {
    console.error("[v0] API: Error getting bundle deals:", error)
    return handleApiError(error, "Failed to fetch bundle deals")
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("[v0] API: Creating new bundle deal")
    const body = await request.json()
    console.log("[v0] API: Bundle deal data:", body)

    const bundle = await createBundleDeal(body)
    console.log("[v0] API: Created bundle deal with ID:", bundle.id)

    return NextResponse.json(createApiResponse(bundle, "Bundle deal created successfully"), { status: 201 })
  } catch (error) {
    console.error("[v0] API: Error creating bundle deal:", error)
    return handleApiError(error, "Failed to create bundle deal")
  }
}
