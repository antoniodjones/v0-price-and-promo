// Pricing calculation engine for volume and tiered pricing

import { createServerClient } from "@/lib/supabase/server"

export type PricingScope = "product" | "category" | "brand" | "global"
export type DiscountType = "percentage" | "fixed_amount" | "fixed_price"

export interface VolumePricingRule {
  id: string
  name: string
  scope: PricingScope
  scope_id?: string
  scope_value?: string
  status: string
  tiers: VolumePricingTier[]
}

export interface VolumePricingTier {
  id: string
  min_quantity: number
  max_quantity: number | null
  discount_type: DiscountType
  discount_value: number
  tier_label?: string
}

export interface TieredPricingRule {
  id: string
  name: string
  customer_tiers: string[]
  scope: PricingScope
  scope_id?: string
  scope_value?: string
  discount_type: DiscountType
  discount_value: number
  priority: number
  status: string
}

export interface PricingContext {
  productId: string
  customerId?: string
  customerTier?: string
  quantity: number
  basePrice: number
  productCategory?: string
  productBrand?: string
}

export interface PricingResult {
  originalPrice: number
  finalPrice: number
  totalDiscount: number
  appliedRules: {
    volumeRule?: VolumePricingRule
    tieredRule?: TieredPricingRule
  }
  breakdown: {
    basePrice: number
    volumeDiscount: number
    tierDiscount: number
    finalPrice: number
  }
}

export class PricingEngine {
  /**
   * Calculate the final price for a product given context
   */
  static async calculatePrice(context: PricingContext): Promise<PricingResult> {
    const supabase = await createServerClient()

    const result: PricingResult = {
      originalPrice: context.basePrice * context.quantity,
      finalPrice: context.basePrice * context.quantity,
      totalDiscount: 0,
      appliedRules: {},
      breakdown: {
        basePrice: context.basePrice * context.quantity,
        volumeDiscount: 0,
        tierDiscount: 0,
        finalPrice: context.basePrice * context.quantity,
      },
    }

    // Step 1: Apply volume pricing
    const volumeRule = await this.findApplicableVolumeRule(supabase, context)
    if (volumeRule) {
      const volumeDiscount = this.calculateVolumeDiscount(context.basePrice, context.quantity, volumeRule)
      result.breakdown.volumeDiscount = volumeDiscount
      result.appliedRules.volumeRule = volumeRule
    }

    // Step 2: Apply tiered pricing (if customer has a tier)
    if (context.customerTier) {
      const tieredRule = await this.findApplicableTieredRule(supabase, context)
      if (tieredRule) {
        const tierDiscount = this.calculateTierDiscount(context.basePrice, context.quantity, tieredRule)
        result.breakdown.tierDiscount = tierDiscount
        result.appliedRules.tieredRule = tieredRule
      }
    }

    // Calculate final price (apply best discount, not stack)
    const bestDiscount = Math.max(result.breakdown.volumeDiscount, result.breakdown.tierDiscount)

    result.breakdown.finalPrice = result.breakdown.basePrice - bestDiscount
    result.finalPrice = result.breakdown.finalPrice
    result.totalDiscount = bestDiscount

    return result
  }

  /**
   * Find the applicable volume pricing rule for the given context
   */
  private static async findApplicableVolumeRule(
    supabase: any,
    context: PricingContext,
  ): Promise<VolumePricingRule | null> {
    const now = new Date().toISOString()

    // Query for active rules that match the product/category/brand
    const { data: rules, error } = await supabase
      .from("volume_pricing_rules")
      .select(`
        *,
        tiers:volume_pricing_tiers(*)
      `)
      .eq("status", "active")
      .or(
        `scope.eq.global,and(scope.eq.product,scope_id.eq.${context.productId}),and(scope.eq.category,scope_value.eq.${context.productCategory}),and(scope.eq.brand,scope_value.eq.${context.productBrand})`,
      )
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)

    if (error || !rules || rules.length === 0) return null

    // Find the rule with the best discount for this quantity
    let bestRule: VolumePricingRule | null = null
    let bestDiscount = 0

    for (const rule of rules) {
      const tier = rule.tiers.find(
        (t: VolumePricingTier) =>
          context.quantity >= t.min_quantity && (t.max_quantity === null || context.quantity <= t.max_quantity),
      )

      if (tier) {
        const discount = this.calculateDiscountAmount(
          context.basePrice * context.quantity,
          tier.discount_type,
          tier.discount_value,
        )

        if (discount > bestDiscount) {
          bestDiscount = discount
          bestRule = { ...rule, tiers: [tier] }
        }
      }
    }

    return bestRule
  }

  /**
   * Find the applicable tiered pricing rule for the given context
   */
  private static async findApplicableTieredRule(
    supabase: any,
    context: PricingContext,
  ): Promise<TieredPricingRule | null> {
    if (!context.customerTier) return null

    const now = new Date().toISOString()

    const { data: rules, error } = await supabase
      .from("tiered_pricing_rules")
      .select("*")
      .eq("status", "active")
      .contains("customer_tiers", [context.customerTier])
      .or(
        `scope.eq.global,and(scope.eq.product,scope_id.eq.${context.productId}),and(scope.eq.category,scope_value.eq.${context.productCategory}),and(scope.eq.brand,scope_value.eq.${context.productBrand})`,
      )
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order("priority", { ascending: false })

    if (error || !rules || rules.length === 0) return null

    // Return the highest priority rule
    return rules[0]
  }

  /**
   * Calculate volume discount amount
   */
  private static calculateVolumeDiscount(basePrice: number, quantity: number, rule: VolumePricingRule): number {
    const tier = rule.tiers[0]
    return this.calculateDiscountAmount(basePrice * quantity, tier.discount_type, tier.discount_value)
  }

  /**
   * Calculate tier discount amount
   */
  private static calculateTierDiscount(basePrice: number, quantity: number, rule: TieredPricingRule): number {
    return this.calculateDiscountAmount(basePrice * quantity, rule.discount_type, rule.discount_value)
  }

  /**
   * Calculate discount amount based on type
   */
  private static calculateDiscountAmount(
    totalPrice: number,
    discountType: DiscountType,
    discountValue: number,
  ): number {
    switch (discountType) {
      case "percentage":
        return totalPrice * (discountValue / 100)
      case "fixed_amount":
        return Math.min(discountValue, totalPrice)
      case "fixed_price":
        return Math.max(0, totalPrice - discountValue)
      default:
        return 0
    }
  }

  /**
   * Log pricing application for audit trail
   */
  static async logPricingApplication(context: PricingContext, result: PricingResult): Promise<void> {
    const supabase = await createServerClient()

    await supabase.from("pricing_applications").insert({
      product_id: context.productId,
      customer_id: context.customerId,
      original_price: result.originalPrice,
      final_price: result.finalPrice,
      quantity: context.quantity,
      total_discount: result.totalDiscount,
      volume_rule_id: result.appliedRules.volumeRule?.id,
      tiered_rule_id: result.appliedRules.tieredRule?.id,
      calculation_details: {
        breakdown: result.breakdown,
        context: {
          customerTier: context.customerTier,
          productCategory: context.productCategory,
          productBrand: context.productBrand,
        },
      },
    })
  }
}
