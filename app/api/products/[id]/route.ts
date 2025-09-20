// Individual product API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProductById(params.id)

    if (!product) {
      return NextResponse.json(createApiResponse(null, "Product not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(product, "Product retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProductById(params.id)

    if (!product) {
      return NextResponse.json(createApiResponse(null, "Product not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate numeric fields if provided
    if (body.thcPercentage !== undefined) {
      if (typeof body.thcPercentage !== "number" || body.thcPercentage < 0 || body.thcPercentage > 100) {
        return NextResponse.json(createApiResponse(null, "THC percentage must be between 0 and 100", false), {
          status: 400,
        })
      }
    }

    if (body.basePrice !== undefined) {
      if (typeof body.basePrice !== "number" || body.basePrice <= 0) {
        return NextResponse.json(createApiResponse(null, "Base price must be a positive number", false), {
          status: 400,
        })
      }
    }

    // Validate date format if provided
    if (body.expirationDate) {
      const expirationDate = new Date(body.expirationDate)
      if (isNaN(expirationDate.getTime())) {
        return NextResponse.json(createApiResponse(null, "Invalid expiration date format", false), { status: 400 })
      }
    }

    // In a real implementation, you would update the product in the database
    const updatedProduct = {
      ...product,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedProduct, "Product updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProductById(params.id)

    if (!product) {
      return NextResponse.json(createApiResponse(null, "Product not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the product from the database
    return NextResponse.json(createApiResponse(null, "Product deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
