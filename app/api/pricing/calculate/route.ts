// Pricing calculation API with comprehensive discount logic

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"
import type { PricingRequest, PricingResponse } from "@/lib/api/types"

export async function POST(request: NextRequest) {
  try {
    const body: PricingRequest = await request.json()

    const validationError = validateRequiredFields(body, ["customerId", "items", "market"])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(createApiResponse(null, "Items array is required and cannot be empty", false), {
        status: 400,
      })
    }

    // Validate each item
    for (const item of body.items) {
      if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json(
          createApiResponse(null, "Each item must have productId and positive quantity", false),
          { status: 400 },
        )
      }
    }

    // Get customer data
    const customer = await db.getCustomerById(body.customerId)
    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    // Get all discounts
    const customerDiscounts = await db.getCustomerDiscounts()
    const inventoryDiscounts = await db.getInventoryDiscounts()
    const bogoPromotions = await db.getBogoPromotions()
    const bundleDeals = await db.getBundleDeals()

    const pricingResponse: PricingResponse = {
      items: [],
      subtotal: 0,
      totalDiscount: 0,
      finalTotal: 0,
    }

    // Calculate pricing for each item
    for (const item of body.items) {
      const product = await db.getProductById(item.productId)
      if (!product) {
        return NextResponse.json(createApiResponse(null, `Product ${item.productId} not found`, false), {
          status: 404,
        })
      }

      const itemBasePrice = product.basePrice * item.quantity
      let bestDiscount = null
      let bestDiscountAmount = 0
      const appliedDiscounts = []

      // Check customer discounts
      const activeCustomerDiscounts = customerDiscounts.filter(
        (d) =>
          d.status === "active" &&
          d.customerTiers.includes(customer.tier) &&
          d.markets.includes(body.market) &&
          new Date(d.startDate) <= new Date() &&
          new Date(d.endDate) >= new Date(),
      )

      for (const discount of activeCustomerDiscounts) {
        let applies = false

        switch (discount.level) {
          case "item":
            applies = discount.target === product.id
            break
          case "brand":
            applies = discount.target === product.brand
            break
          case "category":
            applies = discount.target === product.category
            break
          case "subcategory":
            applies = discount.target === product.subCategory
            break
        }

        if (applies) {
          let discountAmount = 0
          if (discount.type === "percentage") {
            discountAmount = itemBasePrice * (discount.value / 100)
          } else {
            discountAmount = discount.value * item.quantity
          }

          appliedDiscounts.push({
            type: "customer",
            name: discount.name,
            value: discountAmount,
          })

          if (discountAmount > bestDiscountAmount) {
            bestDiscountAmount = discountAmount
            bestDiscount = discount
          }
        }
      }

      // Check inventory discounts
      const activeInventoryDiscounts = inventoryDiscounts.filter((d) => d.status === "active")

      for (const discount of activeInventoryDiscounts) {
        let applies = false

        if (discount.type === "expiration") {
          const daysUntilExpiration = Math.ceil(
            (new Date(product.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )
          applies = daysUntilExpiration <= discount.triggerValue
        } else if (discount.type === "thc") {
          applies = product.thcPercentage >= discount.triggerValue
        }

        if (applies) {
          // Check scope
          if (
            discount.scope === "all" ||
            (discount.scope === "category" && discount.scopeValue === product.category) ||
            (discount.scope === "brand" && discount.scopeValue === product.brand)
          ) {
            let discountAmount = 0
            if (discount.discountType === "percentage") {
              discountAmount = itemBasePrice * (discount.discountValue / 100)
            } else {
              discountAmount = discount.discountValue * item.quantity
            }

            appliedDiscounts.push({
              type: "inventory",
              name: discount.name,
              value: discountAmount,
            })

            if (discountAmount > bestDiscountAmount) {
              bestDiscountAmount = discountAmount
              bestDiscount = discount
            }
          }
        }
      }

      const discountedPrice = Math.max(0, itemBasePrice - bestDiscountAmount)

      pricingResponse.items.push({
        productId: item.productId,
        quantity: item.quantity,
        basePrice: itemBasePrice,
        discountedPrice,
        appliedDiscounts: appliedDiscounts.filter((d) => d.value > 0),
      })

      pricingResponse.subtotal += itemBasePrice
      pricingResponse.totalDiscount += bestDiscountAmount
    }

    pricingResponse.finalTotal = pricingResponse.subtotal - pricingResponse.totalDiscount

    return NextResponse.json(createApiResponse(pricingResponse, "Pricing calculated successfully"))
  } catch (error) {
    return handleApiError(error)
  }
}
