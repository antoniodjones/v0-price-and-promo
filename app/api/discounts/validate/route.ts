// Discount validation and conflict detection API

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, productId, market } = body

    if (!customerId || !productId || !market) {
      return NextResponse.json(createApiResponse(null, "Customer ID, Product ID, and Market are required", false), {
        status: 400,
      })
    }

    // Get customer and product data
    const customer = await db.getCustomerById(customerId)
    const product = await db.getProductById(productId)

    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    if (!product) {
      return NextResponse.json(createApiResponse(null, "Product not found", false), { status: 404 })
    }

    // Get all active discounts
    const customerDiscounts = await db.getCustomerDiscounts()
    const inventoryDiscounts = await db.getInventoryDiscounts()

    const activeCustomerDiscounts = customerDiscounts.filter(
      (d) =>
        d.status === "active" &&
        d.customerTiers.includes(customer.tier) &&
        d.markets.includes(market) &&
        new Date(d.startDate) <= new Date() &&
        new Date(d.endDate) >= new Date(),
    )

    const activeInventoryDiscounts = inventoryDiscounts.filter((d) => d.status === "active")

    // Find applicable discounts
    const applicableDiscounts = []

    // Check customer discounts
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
        applicableDiscounts.push({
          ...discount,
          discountType: "customer",
          priority: 1,
        })
      }
    }

    // Check inventory discounts
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
          applicableDiscounts.push({
            ...discount,
            discountType: "inventory",
            priority: 2,
          })
        }
      }
    }

    // Apply best deal logic (highest discount wins, no stacking)
    let bestDiscount = null
    let bestDiscountAmount = 0

    for (const discount of applicableDiscounts) {
      let discountAmount = 0

      if (discount.discountType === "customer") {
        if (discount.type === "percentage") {
          discountAmount = product.basePrice * (discount.value / 100)
        } else {
          discountAmount = discount.value
        }
      } else if (discount.discountType === "inventory") {
        if (discount.discountType === "percentage") {
          discountAmount = product.basePrice * (discount.discountValue / 100)
        } else {
          discountAmount = discount.discountValue
        }
      }

      if (discountAmount > bestDiscountAmount) {
        bestDiscountAmount = discountAmount
        bestDiscount = discount
      }
    }

    const finalPrice = Math.max(0, product.basePrice - bestDiscountAmount)

    return NextResponse.json(
      createApiResponse(
        {
          product,
          customer,
          applicableDiscounts,
          bestDiscount,
          originalPrice: product.basePrice,
          discountAmount: bestDiscountAmount,
          finalPrice,
          savings: bestDiscountAmount,
          savingsPercentage: product.basePrice > 0 ? (bestDiscountAmount / product.basePrice) * 100 : 0,
        },
        "Discount validation completed successfully",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
