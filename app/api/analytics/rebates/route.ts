// Rebate calculation and reporting API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"

// Mock rebate data
const rebateData = [
  {
    id: "1",
    vendorName: "Rythm",
    period: "2024-Q2",
    totalPurchases: 125600.0,
    totalDiscounts: 18840.0,
    rebateRate: 0.15,
    calculatedRebate: 2826.0,
    status: "pending",
    products: [
      { productId: "1", productName: "Premium OG Kush", purchases: 45600.0, discounts: 6840.0 },
      { productId: "3", productName: "Blue Dream", purchases: 38900.0, discounts: 5835.0 },
      { productId: "7", productName: "Sour Diesel", purchases: 41100.0, discounts: 6165.0 },
    ],
    breakdown: {
      customerDiscounts: 12560.0,
      inventoryDiscounts: 4280.0,
      promotionalDiscounts: 2000.0,
    },
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-07-01T00:00:00Z",
  },
  {
    id: "2",
    vendorName: "Dogwalkers",
    period: "2024-Q2",
    totalPurchases: 89400.0,
    totalDiscounts: 10728.0,
    rebateRate: 0.12,
    calculatedRebate: 1287.36,
    status: "approved",
    products: [
      { productId: "2", productName: "Blue Dream Cartridge", purchases: 56700.0, discounts: 6804.0 },
      { productId: "8", productName: "OG Kush Cartridge", purchases: 32700.0, discounts: 3924.0 },
    ],
    breakdown: {
      customerDiscounts: 7509.6,
      inventoryDiscounts: 2145.6,
      promotionalDiscounts: 1072.8,
    },
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-07-15T10:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const vendor = searchParams.get("vendor")
    const period = searchParams.get("period")
    const status = searchParams.get("status")

    let filteredRebates = [...rebateData]

    // Apply filters
    if (vendor) {
      filteredRebates = filteredRebates.filter((r) => r.vendorName.toLowerCase().includes(vendor.toLowerCase()))
    }

    if (period) {
      filteredRebates = filteredRebates.filter((r) => r.period === period)
    }

    if (status) {
      filteredRebates = filteredRebates.filter((r) => r.status === status)
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedRebates = filteredRebates.slice(start, end)

    // Calculate summary
    const summary = {
      totalVendors: new Set(filteredRebates.map((r) => r.vendorName)).size,
      totalPurchases: filteredRebates.reduce((sum, r) => sum + r.totalPurchases, 0),
      totalDiscounts: filteredRebates.reduce((sum, r) => sum + r.totalDiscounts, 0),
      totalRebates: filteredRebates.reduce((sum, r) => sum + r.calculatedRebate, 0),
      averageRebateRate:
        filteredRebates.length > 0
          ? filteredRebates.reduce((sum, r) => sum + r.rebateRate, 0) / filteredRebates.length
          : 0,
    }

    return NextResponse.json(
      createApiResponse(
        {
          data: paginatedRebates,
          summary,
          pagination: {
            page,
            limit,
            total: filteredRebates.length,
            totalPages: Math.ceil(filteredRebates.length / limit),
          },
        },
        "Rebate data retrieved successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.vendorName || !body.period || !body.rebateRate) {
      return NextResponse.json(createApiResponse(null, "Vendor name, period, and rebate rate are required", false), {
        status: 400,
      })
    }

    // In a real implementation, you would calculate rebates based on actual transaction data
    const mockRebate = {
      id: Date.now().toString(),
      vendorName: body.vendorName,
      period: body.period,
      totalPurchases: 75000.0, // Mock calculation
      totalDiscounts: 9000.0,
      rebateRate: body.rebateRate,
      calculatedRebate: 9000.0 * body.rebateRate,
      status: "pending",
      products: [], // Would be populated from actual data
      breakdown: {
        customerDiscounts: 6300.0,
        inventoryDiscounts: 1800.0,
        promotionalDiscounts: 900.0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(createApiResponse(mockRebate, "Rebate calculation created successfully"), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
