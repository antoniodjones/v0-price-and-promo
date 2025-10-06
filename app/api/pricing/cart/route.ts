import type { NextRequest } from "next/server"
import { PricingEngine } from "@/lib/pricing-engine"
import { createClient } from "@/lib/supabase/server"

interface CartItem {
  productId: string
  productName?: string
  quantity: number
  basePrice: number
}

interface Product {
  id: string
  name: string
  price: number
  category?: string
  brand?: string
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerId } = await request.json()

    if (!items || !Array.isArray(items)) {
      return Response.json({ success: false, error: "Invalid items" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get customer tier if customerId provided
    let customerTier: string | undefined
    if (customerId) {
      const { data: customer } = await supabase.from("customers").select("tier").eq("id", customerId).single()
      customerTier = customer?.tier
    }

    const pricingResults = await Promise.all(
      (items as CartItem[]).map(async (item) => {
        const { data: product } = await supabase.from("products").select("*").eq("id", item.productId).single()

        if (!product) {
          return {
            productId: item.productId,
            productName: item.productName || "Unknown",
            quantity: item.quantity,
            basePrice: item.basePrice * item.quantity,
            finalPrice: item.basePrice * item.quantity,
            discount: 0,
            appliedRules: [],
          }
        }

        const typedProduct = product as Product

        const pricingResult = await PricingEngine.calculatePrice({
          productId: item.productId,
          customerId,
          customerTier,
          quantity: item.quantity,
          basePrice: Number(typedProduct.price),
          productCategory: typedProduct.category,
          productBrand: typedProduct.brand,
        })

        const appliedRules: string[] = []
        if (pricingResult.appliedRules.volumeRule) {
          appliedRules.push(`Volume: ${pricingResult.appliedRules.volumeRule.name}`)
        }
        if (pricingResult.appliedRules.tieredRule) {
          appliedRules.push(`Tier: ${pricingResult.appliedRules.tieredRule.name}`)
        }

        return {
          productId: item.productId,
          productName: item.productName || typedProduct.name,
          quantity: item.quantity,
          basePrice: pricingResult.originalPrice,
          finalPrice: pricingResult.finalPrice,
          discount: pricingResult.totalDiscount,
          appliedRules,
        }
      }),
    )

    const subtotal = pricingResults.reduce((sum, item) => sum + item.basePrice, 0)
    const totalDiscount = pricingResults.reduce((sum, item) => sum + item.discount, 0)
    const finalTotal = pricingResults.reduce((sum, item) => sum + item.finalPrice, 0)

    return Response.json({
      success: true,
      data: {
        items: pricingResults,
        subtotal,
        totalDiscount,
        finalTotal,
      },
    })
  } catch (error) {
    console.error("[v0] Error calculating cart pricing:", error)
    return Response.json({ success: false, error: "Failed to calculate cart pricing" }, { status: 500 })
  }
}
