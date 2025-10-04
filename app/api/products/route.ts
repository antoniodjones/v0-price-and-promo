import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/actions/products"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Products API: Starting GET request")

    const result = await getProducts()

    console.log("[v0] Products API: getProducts result:", {
      success: result.success,
      dataLength: result.data?.length,
      error: result.error,
    })

    if (!result.success) {
      console.error("[v0] Products API: Failed with error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Failed to fetch products",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Products retrieved successfully",
      data: result.data,
    })
  } catch (error) {
    console.error("[v0] Products API: Error occurred:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Products API: POST request received")

    return NextResponse.json(
      {
        success: false,
        message: "POST endpoint temporarily disabled for debugging",
      },
      { status: 503 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in POST endpoint",
      },
      { status: 500 },
    )
  }
}
