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
      (p) =>
        p.status === "active" &&
        p.start_date &&
        p.end_date &&
        new Date(p.start_date) <= new Date() &&
        new Date(p.end_date) >= new Date(),
    )

    const activeBundleDeals = bundleDeals.filter(
      (b) =>
        b.status === "active" &&
        b.start_date &&
        b.end_date &&
        new Date(b.start_date) <= new Date() &&
        new Date(b.end_date) >= new Date(),
    )

    const eligiblePromotions = []
    const eligibleBundles = []

    // BOGO promotions use buy_product_id, get_product_id, buy_quantity, get_quantity, discount_percentage
    for (const promotion of activeBogoPromotions) {
      // Check if customer tier is eligible (if customer_tiers is specified)
      if (promotion.customer_tiers && promotion.customer_tiers.length > 0) {
        if (!promotion.customer_tiers.includes(customer.tier)) {
          continue
        }
      }

      // Check if market is eligible (if markets is specified)
      if (promotion.markets && promotion.markets.length > 0) {
        if (!promotion.markets.includes(body.market)) {
          continue
        }
      }

      // Check if the buy product is in the cart
      const buyItem = body.items.find((item: any) => item.productId === promotion.buy_product_id)
      if (!buyItem || buyItem.quantity < promotion.buy_quantity) {
        continue
      }

      // Check if the get product is in the cart
      const getItem = body.items.find((item: any) => item.productId === promotion.get_product_id)
      if (!getItem) {
        continue
      }

      // Calculate how many times this promotion can be applied
      const applicableSets = Math.floor(buyItem.quantity / promotion.buy_quantity)
      const discountedItems = Math.min(applicableSets * promotion.get_quantity, getItem.quantity)

      if (discountedItems > 0) {
        const getProduct = await db.getProductById(promotion.get_product_id)
        if (getProduct) {
          const discountPerItem = getProduct.basePrice * (promotion.discount_percentage / 100)
          const totalSavings = discountPerItem * discountedItems

          eligiblePromotions.push({
            ...promotion,
            buyProductId: promotion.buy_product_id,
            getProductId: promotion.get_product_id,
            applicableQuantity: discountedItems,
            discountPerItem,
            totalSavings,
          })
        }
      }
    }

    // Check bundle deal eligibility
    for (const bundle of activeBundleDeals) {
      if (bundle.type === "fixed") {
        // Check if all required products are in the cart
        const hasAllProducts = bundle.products.every((productId: string) =>
          body.items.some((item: any) => item.productId === productId),
        )

        if (hasAllProducts) {
          const totalQuantity = bundle.products.reduce((sum: number, productId: string) => {
            const item = body.items.find((i: any) => i.productId === productId)
            return sum + (item?.quantity || 0)
          }, 0)

          if (bundle.min_quantity !== undefined && totalQuantity >= bundle.min_quantity) {
            // Calculate bundle savings
            const bundleProducts = await Promise.all(bundle.products.map((id: string) => db.getProductById(id)))
            const totalBasePrice = bundleProducts.reduce((sum: number, product) => {
              if (!product) return sum
              const item = body.items.find((i: any) => i.productId === product.id)
              return sum + product.basePrice * (item?.quantity || 0)
            }, 0)

            let discountAmount = 0
            if (bundle.discount_type && bundle.discount_value !== undefined) {
              if (bundle.discount_type === "percentage") {
                discountAmount = totalBasePrice * (bundle.discount_value / 100)
              } else {
                discountAmount = bundle.discount_value
              }
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
