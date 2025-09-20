// Customer management API endpoints

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, createPaginatedResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"
import { CreateCustomerSchema } from "@/lib/schemas"
import { validateRequestBody } from "@/lib/api/utils"

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const { data, total } = await db.getCustomers(page, limit)

    return NextResponse.json(createPaginatedResponse(data, page, limit, total, "Customers retrieved successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = validateRequestBody(CreateCustomerSchema, body)

    const customer = await db.createCustomer(validatedData)

    return NextResponse.json(createApiResponse(customer, "Customer created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
