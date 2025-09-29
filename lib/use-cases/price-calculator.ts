import type { ProductEntity, PricingContext, PricingRule, PricingResult } from "@/lib/entities/product"

/**
 * Pure function to calculate the best price for a product
 * Implements no-stacking policy - only the best discount is applied
 */
export function calculateBestPrice(
  product: ProductEntity,
  context: PricingContext,
  rules: PricingRule[],
): PricingResult {
  try {
    // Validate inputs with null safety
    if (!product || typeof product.basePrice !== "number" || product.basePrice <= 0) {
      return createFallbackResult(product?.basePrice || 0)
    }

    if (!Array.isArray(rules)) {
      return createFallbackResult(product.basePrice)
    }

    // Get applicable rules
    const applicableRules = rules.filter((rule) => rule?.isActive && isRuleApplicable(rule, product, context))

    if (applicableRules.length === 0) {
      return {
        originalPrice: product.basePrice,
        finalPrice: product.basePrice,
        discountAmount: 0,
        discountPercentage: 0,
        appliedRules: [],
        explanation: "No applicable discounts found",
      }
    }

    // Find the best rule (highest savings)
    const bestRule = findBestRule(applicableRules, product.basePrice)

    if (!bestRule) {
      return createFallbackResult(product.basePrice)
    }

    // Calculate final price
    const discountAmount = calculateDiscountAmount(bestRule, product.basePrice)
    const finalPrice = Math.max(0, product.basePrice - discountAmount)
    const discountPercentage = product.basePrice > 0 ? (discountAmount / product.basePrice) * 100 : 0

    return {
      originalPrice: product.basePrice,
      finalPrice,
      discountAmount,
      discountPercentage,
      appliedRules: [bestRule],
      explanation: `Applied ${bestRule.name}: ${discountPercentage.toFixed(1)}% discount (no-stacking policy)`,
    }
  } catch (error) {
    console.error("[v0] Price calculation error:", error)
    return createFallbackResult(product?.basePrice || 0)
  }
}

/**
 * Check if a pricing rule applies to the given product and context
 */
function isRuleApplicable(rule: PricingRule, product: ProductEntity, context: PricingContext): boolean {
  try {
    if (!rule?.conditions || !Array.isArray(rule.conditions)) {
      return false
    }

    return rule.conditions.every((condition) => {
      try {
        return evaluateCondition(condition, product, context)
      } catch {
        return false
      }
    })
  } catch {
    return false
  }
}

/**
 * Evaluate a single pricing condition
 */
function evaluateCondition(condition: any, product: ProductEntity, context: PricingContext): boolean {
  try {
    if (!condition?.field || !condition?.operator) {
      return false
    }

    const fieldValue = getFieldValue(condition.field, product, context)

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value
      case "greater_than":
        return typeof fieldValue === "number" && typeof condition.value === "number" && fieldValue > condition.value
      case "less_than":
        return typeof fieldValue === "number" && typeof condition.value === "number" && fieldValue < condition.value
      case "contains":
        return (
          typeof fieldValue === "string" &&
          typeof condition.value === "string" &&
          (fieldValue || "").toLowerCase().includes((condition.value || "").toLowerCase())
        )
      case "in_range":
        return (
          typeof fieldValue === "number" &&
          Array.isArray(condition.value) &&
          condition.value.length === 2 &&
          fieldValue >= condition.value[0] &&
          fieldValue <= condition.value[1]
        )
      default:
        return false
    }
  } catch {
    return false
  }
}

/**
 * Get field value from product or context with null safety
 */
function getFieldValue(field: string, product: ProductEntity, context: PricingContext): any {
  try {
    // Product fields
    if (field.startsWith("product.")) {
      const productField = field.replace("product.", "")
      return (product as any)?.[productField]
    }

    // Context fields
    if (field.startsWith("context.")) {
      const contextField = field.replace("context.", "")
      return (context as any)?.[contextField]
    }

    // Direct field access
    return (product as any)?.[field] ?? (context as any)?.[field]
  } catch {
    return undefined
  }
}

/**
 * Find the rule that provides the highest discount
 */
function findBestRule(rules: PricingRule[], basePrice: number): PricingRule | null {
  try {
    if (!Array.isArray(rules) || rules.length === 0 || typeof basePrice !== "number" || basePrice <= 0) {
      return null
    }

    let bestRule: PricingRule | null = null
    let bestSavings = 0

    for (const rule of rules) {
      try {
        const savings = calculateDiscountAmount(rule, basePrice)
        if (savings > bestSavings) {
          bestSavings = savings
          bestRule = rule
        }
      } catch {
        // Skip invalid rules
        continue
      }
    }

    return bestRule
  } catch {
    return null
  }
}

/**
 * Calculate discount amount for a rule
 */
function calculateDiscountAmount(rule: PricingRule, basePrice: number): number {
  try {
    if (!rule?.action || typeof basePrice !== "number" || basePrice <= 0) {
      return 0
    }

    const { type, value, maxDiscount } = rule.action

    let discountAmount = 0

    switch (type) {
      case "percentage_discount":
        if (typeof value === "number" && value >= 0 && value <= 100) {
          discountAmount = basePrice * (value / 100)
        }
        break
      case "fixed_discount":
        if (typeof value === "number" && value >= 0) {
          discountAmount = Math.min(value, basePrice)
        }
        break
      case "fixed_price":
        if (typeof value === "number" && value >= 0 && value < basePrice) {
          discountAmount = basePrice - value
        }
        break
    }

    // Apply max discount limit if specified
    if (typeof maxDiscount === "number" && maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, maxDiscount)
    }

    return Math.max(0, discountAmount)
  } catch {
    return 0
  }
}

/**
 * Create a safe fallback result
 */
function createFallbackResult(basePrice: number): PricingResult {
  const safePrice = typeof basePrice === "number" && basePrice >= 0 ? basePrice : 0

  return {
    originalPrice: safePrice,
    finalPrice: safePrice,
    discountAmount: 0,
    discountPercentage: 0,
    appliedRules: [],
    explanation: "Error calculating price - using base price",
  }
}

/**
 * Cannabis industry specific pricing rules
 */
export function createCannabisIndustryRules(): PricingRule[] {
  return [
    // Expiration discount rule
    {
      id: "expiration-30-day",
      name: "30-Day Expiration Discount",
      type: "expiration",
      priority: 1,
      conditions: [
        {
          field: "product.expirationDate",
          operator: "less_than",
          value: 30, // days from now
        },
      ],
      action: {
        type: "percentage_discount",
        value: 20,
        maxDiscount: 50,
      },
      isActive: true,
    },

    // Volume discount for wholesale
    {
      id: "wholesale-volume",
      name: "Wholesale Volume Discount",
      type: "volume",
      priority: 3,
      conditions: [
        {
          field: "context.orderQuantity",
          operator: "greater_than",
          value: 100,
        },
      ],
      action: {
        type: "percentage_discount",
        value: 15,
      },
      isActive: true,
    },

    // Low THC discount
    {
      id: "low-thc-discount",
      name: "Low THC Flower Discount",
      type: "thc",
      priority: 2,
      conditions: [
        {
          field: "product.category",
          operator: "equals",
          value: "Flower",
        },
        {
          field: "product.thcPercentage",
          operator: "less_than",
          value: 15,
        },
      ],
      action: {
        type: "percentage_discount",
        value: 10,
      },
      isActive: true,
    },

    // Internal dispensary discount
    {
      id: "internal-dispensary",
      name: "Internal Dispensary Discount",
      type: "customer",
      priority: 2,
      conditions: [
        {
          field: "context.isInternalDispensary",
          operator: "equals",
          value: true,
        },
      ],
      action: {
        type: "percentage_discount",
        value: 12,
      },
      isActive: true,
    },
  ]
}
