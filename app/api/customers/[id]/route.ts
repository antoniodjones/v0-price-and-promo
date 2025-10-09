// Individual customer API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const customer = await db.getCustomerById(id)

    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    return NextResponse.json(createApiResponse(customer, "Customer retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const customer = await db.getCustomerById(id)

    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    const body = await request.json()

    // Validate tier if provided
    if (body.tier && !["A", "B", "C"].includes(body.tier)) {
      return NextResponse.json(createApiResponse(null, "Tier must be A, B, or C", false), { status: 400 })
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(createApiResponse(null, "Invalid email format", false), { status: 400 })
      }
    }

    // In a real implementation, you would update the customer in the database
    const updatedCustomer = {
      ...customer,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(updatedCustomer, "Customer updated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const customer = await db.getCustomerById(id)

    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    // In a real implementation, you would delete the customer from the database
    return NextResponse.json(createApiResponse(null, "Customer deleted successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
