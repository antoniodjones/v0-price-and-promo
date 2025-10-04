import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { PricingEngine } from "@/lib/pricing-engine"

export async function POST(request: NextRequest) {
  try {
    const { productId, customerId, quantity = 1 } = await request.json()

    if (!productId) {
      return Response.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Get customer details if provided
    let customerTier: string | undefined
    if (customerId) {
      const { data: customer } = await supabase.from("customers").select("tier").eq("id", customerId).single()

      customerTier = customer?.tier
    }

    const pricingResult = await PricingEngine.calculatePrice({
      productId,
      customerId,
      customerTier,
      quantity,
      basePrice: Number(product.price),
      productCategory: product.category,
      productBrand: product.brand,
    })

    // Log the pricing application for audit
    if (customerId) {
      await PricingEngine.logPricingApplication(
        {
          productId,
          customerId,
          customerTier,
          quantity,
          basePrice: Number(product.price),
          productCategory: product.category,
          productBrand: product.brand,
        },
        pricingResult,
      )
    }

    return Response.json({
      success: true,
      data: {
        basePrice: pricingResult.originalPrice,
        finalPrice: pricingResult.finalPrice,
        totalDiscount: pricingResult.totalDiscount,
        discountPercentage: (pricingResult.totalDiscount / pricingResult.originalPrice) * 100,
        breakdown: pricingResult.breakdown,
        appliedRules: {
          volumeRule: pricingResult.appliedRules.volumeRule?.name,
          tieredRule: pricingResult.appliedRules.tieredRule?.name,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Error calculating price:", error)
    return Response.json({ success: false, error: "Failed to calculate price" }, { status: 500 })
  }
}
