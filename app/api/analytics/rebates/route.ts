// Rebate calculation and reporting API

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError, getPaginationParams } from "@/lib/api/utils"
import { getVendorRebates, calculateRebateData } from "@/lib/api/database"

// Mock rebate data
// const rebateData = [
//   {
//     id: "1",
//     vendorName: "Rythm",
//     period: "2024-Q2",
//     totalPurchases: 125600.0,
//     totalDiscounts: 18840.0,
//     rebateRate: 0.15,
//     calculatedRebate: 2826.0,
//     status: "pending",
//     products: [
//       { productId: "1", productName: "Premium OG Kush", purchases: 45600.0, discounts: 6840.0 },
//       { productId: "3", productName: "Blue Dream", purchases: 38900.0, discounts: 5835.0 },
//       { productId: "7", productName: "Sour Diesel", purchases: 41100.0, discounts: 6165.0 },
//     ],
//     breakdown: {
//       customerDiscounts: 12560.0,
//       inventoryDiscounts: 4280.0,
//       promotionalDiscounts: 2000.0,
//     },
//     createdAt: "2024-07-01T00:00:00Z",
//     updatedAt: "2024-07-01T00:00:00Z",
//   },
//   {
//     id: "2",
//     vendorName: "Dogwalkers",
//     period: "2024-Q2",
//     totalPurchases: 89400.0,
//     totalDiscounts: 10728.0,
//     rebateRate: 0.12,
//     calculatedRebate: 1287.36,
//     status: "approved",
//     products: [
//       { productId: "2", productName: "Blue Dream Cartridge", purchases: 56700.0, discounts: 6804.0 },
//       { productId: "8", productName: "OG Kush Cartridge", purchases: 32700.0, discounts: 3924.0 },
//     ],
//     breakdown: {
//       customerDiscounts: 7509.6,
//       inventoryDiscounts: 2145.6,
//       promotionalDiscounts: 1072.8,
//     },
//     createdAt: "2024-07-01T00:00:00Z",
//     updatedAt: "2024-07-15T10:30:00Z",
//   },
// ]

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(request)
    const searchParams = request.nextUrl.searchParams

    const vendor = searchParams.get("vendor")
    const period = searchParams.get("period")
    const status = searchParams.get("status")

    const rebateData = await getVendorRebates({
      vendor,
      period,
      status,
      page,
      limit,
    })

    return NextResponse.json(createApiResponse(rebateData, "Rebate data retrieved successfully"))
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

    const rebateCalculation = await calculateRebateData({
      vendorName: body.vendorName,
      period: body.period,
      rebateRate: body.rebateRate,
    })

    return NextResponse.json(createApiResponse(rebateCalculation, "Rebate calculation created successfully"), {
      status: 201,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
