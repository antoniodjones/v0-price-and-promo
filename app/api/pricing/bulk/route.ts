// Bulk pricing calculation API for large orders

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError, validateRequiredFields } from "@/lib/api/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequiredFields(body, ["orders"])
    if (validationError) {
      return NextResponse.json(createApiResponse(null, validationError, false), { status: 400 })
    }

    if (!Array.isArray(body.orders) || body.orders.length === 0) {
      return NextResponse.json(createApiResponse(null, "Orders array is required and cannot be empty", false), {
        status: 400,
      })
    }

    const results = []

    // Process each order
    for (const order of body.orders) {
      if (!order.customerId || !order.items || !order.market) {
        results.push({
          orderId: order.orderId || "unknown",
          success: false,
          error: "Missing required fields: customerId, items, market",
        })
        continue
      }

      try {
        // Get customer data
        const customer = await db.getCustomerById(order.customerId)
        if (!customer) {
          results.push({
            orderId: order.orderId || "unknown",
            success: false,
            error: "Customer not found",
          })
          continue
        }

        // Calculate pricing for this order (simplified version)
        let subtotal = 0
        let totalDiscount = 0
        const orderItems = []

        for (const item of order.items) {
          const product = await db.getProductById(item.productId)
          if (!product) {
            continue // Skip invalid products
          }

          const itemBasePrice = product.basePrice * item.quantity
          // Apply basic customer tier discount
          let discountPercentage = 0
          switch (customer.tier) {
            case "A":
              discountPercentage = 15
              break
            case "B":
              discountPercentage = 10
              break
            case "C":
              discountPercentage = 5
              break
          }

          const discountAmount = itemBasePrice * (discountPercentage / 100)
          const discountedPrice = itemBasePrice - discountAmount

          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            basePrice: itemBasePrice,
            discountedPrice,
            appliedDiscounts: [
              {
                type: "customer_tier",
                name: `Tier ${customer.tier} Discount`,
                value: discountAmount,
              },
            ],
          })

          subtotal += itemBasePrice
          totalDiscount += discountAmount
        }

        results.push({
          orderId: order.orderId || Date.now().toString(),
          success: true,
          pricing: {
            items: orderItems,
            subtotal,
            totalDiscount,
            finalTotal: subtotal - totalDiscount,
          },
        })
      } catch (error) {
        results.push({
          orderId: order.orderId || "unknown",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json(
      createApiResponse(
        {
          results,
          summary: {
            total: results.length,
            successful: successCount,
            failed: failureCount,
          },
        },
        `Bulk pricing calculation completed: ${successCount} successful, ${failureCount} failed`,
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
