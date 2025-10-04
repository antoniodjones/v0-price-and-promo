import { type NextRequest, NextResponse } from "next/server"
import { getCustomers } from "@/lib/actions/customers"

export async function GET(request: NextRequest) {
  try {
    const result = await getCustomers()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Failed to fetch customers",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Customers retrieved successfully",
      data: result.data,
    })
  } catch (error) {
    console.error("[v0] Error in customers API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
