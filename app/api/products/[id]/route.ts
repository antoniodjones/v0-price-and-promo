// Individual product API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"
import { UpdateProductSchema } from "@/lib/schemas"
import { validateRequestBody } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProduct(params.id)

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
    const product = await db.getProduct(params.id)

    if (!product) {
      return NextResponse.json(createApiResponse(null, "Product not found", false), { status: 404 })
    }

    const body = await request.json()
    const validatedData = validateRequestBody(UpdateProductSchema, body)

    const updatedProduct = await db.updateProduct(params.id, validatedData)

    return NextResponse.json(createApiResponse(updatedProduct, "Product updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.getProduct(params.id)

    if (!product) {
      return NextResponse.json(createApiResponse(null, "Product not found", false), { status: 404 })
    }

    await db.deleteProduct(params.id)

    return NextResponse.json(createApiResponse(null, "Product deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
