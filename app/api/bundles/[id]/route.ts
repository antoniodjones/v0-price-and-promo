// Individual bundle deal API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bundles = await db.getBundleDeals()
    const bundle = bundles.find((b) => b.id === id)

    if (!bundle) {
      return NextResponse.json(createApiResponse(null, "Bundle deal not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(bundle, "Bundle deal retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bundles = await db.getBundleDeals()
    const bundle = bundles.find((b) => b.id === id)

    if (!bundle) {
      return NextResponse.json(createApiResponse(null, "Bundle deal not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate fields if provided
    if (body.type && !["fixed", "category", "mix_match", "tiered"].includes(body.type)) {
      return NextResponse.json(
        createApiResponse(null, "Type must be 'fixed', 'category', 'mix_match', or 'tiered'", false),
        { status: 400 },
      )
    }

    if (body.discountType && !["percentage", "fixed"].includes(body.discountType)) {
      return NextResponse.json(createApiResponse(null, "Discount type must be 'percentage' or 'fixed'", false), {
        status: 400,
      })
    }

    if (body.discountValue !== undefined) {
      if (typeof body.discountValue !== "number" || body.discountValue <= 0) {
        return NextResponse.json(createApiResponse(null, "Discount value must be a positive number", false), {
          status: 400,
        })
      }
      if (body.discountType === "percentage" && body.discountValue > 100) {
        return NextResponse.json(createApiResponse(null, "Percentage discount cannot exceed 100%", false), {
          status: 400,
        })
      }
    }

    // In a real implementation, you would update the bundle in the database
    const updatedBundle = {
      ...bundle,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedBundle, "Bundle deal updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bundles = await db.getBundleDeals()
    const bundle = bundles.find((b) => b.id === id)

    if (!bundle) {
      return NextResponse.json(createApiResponse(null, "Bundle deal not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the bundle from the database
    return NextResponse.json(createApiResponse(null, "Bundle deal deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
