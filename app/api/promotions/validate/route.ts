// Promotion validation and eligibility API

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequiredFields(body, ["customerId", "items", "market"])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    // Get customer data
    const customer = await db.getCustomerById(body.customerId)
    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    // Get all active promotions and bundles
    const bogoPromotions = await db.getBogoPromotions()
    const bundleDeals = await db.getBundleDeals()

    const activeBogoPromotions = bogoPromotions.filter(
      (p) => p.status === "active" && new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date(),
    )

    const activeBundleDeals = bundleDeals.filter(
      (b) => b.status === "active" && new Date(b.startDate) <= new Date() && new Date(b.endDate) >= new Date(),
    )

    const eligiblePromotions = []
    const eligibleBundles = []

    // Check BOGO promotion eligibility
    for (const promotion of activeBogoPromotions) {
      for (const item of body.items) {
        const product = await db.getProductById(item.productId)
        if (!product) continue

        let eligible = false

        switch (promotion.triggerLevel) {
          case "item":
            eligible = promotion.triggerValue === product.id
            break
          case "brand":
            eligible = promotion.triggerValue === product.brand
            break
          case "category":
            eligible = promotion.triggerValue === product.category
            break
        }

        if (eligible && item.quantity >= 2) {
          // BOGO requires at least 2 items
          let rewardValue = 0

          switch (promotion.rewardType) {
            case "free":
              rewardValue = product.basePrice
              break
            case "percentage":
              rewardValue = product.basePrice * (promotion.rewardValue / 100)
              break
            case "fixed":
              rewardValue = promotion.rewardValue
              break
          }

          eligiblePromotions.push({
            ...promotion,
            productId: item.productId,
            applicableQuantity: Math.floor(item.quantity / 2), // Number of free/discounted items
            rewardValue,
            totalSavings: rewardValue * Math.floor(item.quantity / 2),
          })
        }
      }
    }

    // Check bundle deal eligibility
    for (const bundle of activeBundleDeals) {
      if (bundle.type === "fixed") {
        // Check if all required products are in the cart
        const hasAllProducts = bundle.products.every((productId) =>
          body.items.some((item) => item.productId === productId),
        )

        if (hasAllProducts) {
          const totalQuantity = bundle.products.reduce((sum, productId) => {
            const item = body.items.find((i) => i.productId === productId)
            return sum + (item?.quantity || 0)
          }, 0)

          if (totalQuantity >= bundle.minQuantity) {
            // Calculate bundle savings
            const bundleProducts = await Promise.all(bundle.products.map((id) => db.getProductById(id)))
            const totalBasePrice = bundleProducts.reduce((sum, product) => {
              if (!product) return sum
              const item = body.items.find((i) => i.productId === product.id)
              return sum + product.basePrice * (item?.quantity || 0)
            }, 0)

            let discountAmount = 0
            if (bundle.discountType === "percentage") {
              discountAmount = totalBasePrice * (bundle.discountValue / 100)
            } else {
              discountAmount = bundle.discountValue
            }

            eligibleBundles.push({
              ...bundle,
              totalBasePrice,
              discountAmount,
              finalPrice: totalBasePrice - discountAmount,
            })
          }
        }
      }
    }

    return NextResponse.json(
      createApiResponse(
        {
          customer,
          eligiblePromotions,
          eligibleBundles,
          summary: {
            totalBogoPromotions: eligiblePromotions.length,
            totalBundleDeals: eligibleBundles.length,
            totalPotentialSavings:
              eligiblePromotions.reduce((sum, p) => sum + p.totalSavings, 0) +
              eligibleBundles.reduce((sum, b) => sum + b.discountAmount, 0),
          },
        },
        "Promotion validation completed successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
