import { type NextRequest, NextResponse } from "next/server"
import { promotionsService } from "@/lib/services/promotions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let data

    switch (type) {
      case "bogo":
        data = await promotionsService.getBogoPromotions()
        break
      case "deals":
        data = await promotionsService.getActiveDealNotifications()
        break
      case "customer-discounts":
        data = await promotionsService.getCustomerDiscounts()
        break
      case "inventory-discounts":
        data = await promotionsService.getInventoryDiscounts()
        break
      case "bundle-deals":
        data = await promotionsService.getBundleDeals()
        break
      case "stats":
        data = await promotionsService.getPromotionStats()
        break
      case "performance":
        data = await promotionsService.getPromotionPerformanceData()
        break
      default:
        // Return all promotion types summary
        const [bogo, deals, customerDiscounts, inventoryDiscounts, bundleDeals] = await Promise.all([
          promotionsService.getBogoPromotions(),
          promotionsService.getActiveDealNotifications(),
          promotionsService.getCustomerDiscounts(),
          promotionsService.getInventoryDiscounts(),
          promotionsService.getBundleDeals(),
        ])

        data = {
          bogo: bogo.slice(0, 5), // Latest 5
          deals: deals.slice(0, 5),
          customerDiscounts: customerDiscounts.slice(0, 5),
          inventoryDiscounts: inventoryDiscounts.slice(0, 5),
          bundleDeals: bundleDeals.slice(0, 5),
        }
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Promotions retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch promotions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...promotionData } = body

    let data

    switch (type) {
      case "bogo":
        data = await promotionsService.createBogoPromotion(promotionData)
        break
      case "deal":
        data = await promotionsService.createDealNotification(promotionData)
        break
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid promotion type",
            message: "Supported types: bogo, deal",
          },
          { status: 400 },
        )
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Promotion created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating promotion:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create promotion",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
