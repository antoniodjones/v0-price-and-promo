// Tier-based Pricing Engine - Integrates discount rules with customer tier assignments
// Task TM-022: Implement findApplicableRules() function

import { db } from "@/lib/api/database"
import { logInfo, logError } from "@/lib/logger"
import { logSuccessfulPricing, logPricingError, logDiscountEvaluation } from "@/lib/pricing/pricing-audit-logger"

import {
  getCachedDiscountRules,
  setCachedDiscountRules,
  getCachedCustomerTierAssignment,
  setCachedCustomerTierAssignment,
  getCachedRuleTiers,
  setCachedRuleTiers,
  getCachedProductDetails,
  setCachedProductDetails,
  getCachedPricingCalculation,
  setCachedPricingCalculation,
} from "@/lib/pricing/pricing-cache"

export interface DiscountRule {
  id: string
  name: string
  description: string | null
  rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
  level: "brand" | "category" | "subcategory" | "product"
  target_id: string | null
  target_name: string | null
  start_date: string
  end_date: string | null
  status: "active" | "inactive" | "scheduled" | "expired"
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface DiscountRuleTier {
  id: string
  rule_id: string
  tier: "A" | "B" | "C"
  discount_type: "percentage" | "fixed_amount" | "price_override"
  discount_value: number
  min_quantity: number
  max_quantity: number | null
  created_at: string
}

export interface CustomerTierAssignment {
  id: string
  rule_id: string
  customer_id: string
  tier: "A" | "B" | "C"
  assigned_date: string
  assigned_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ApplicableRuleContext {
  customerId: string
  productId?: string
  brandId?: string
  categoryId?: string
  subcategoryId?: string
  quantity?: number
  currentDate?: Date
}

export interface ApplicableRule extends DiscountRule {
  tiers: DiscountRuleTier[]
  customerTier?: "A" | "B" | "C"
  applicableDiscount?: DiscountRuleTier
}

/**
 * Find all discount rules that apply to a given context
 *
 * This function:
 * 1. Queries active discount rules from the database
 * 2. Filters rules based on date range (start_date <= current_date <= end_date)
 * 3. Filters rules based on level and target (brand, category, subcategory, product)
 * 4. Loads tier definitions for each applicable rule
 * 5. Checks customer tier assignments to determine which tier applies
 *
 * @param context - The context for finding applicable rules (customer, product, etc.)
 * @returns Array of applicable rules with tier information
 */
export async function findApplicableRules(context: ApplicableRuleContext): Promise<ApplicableRule[]> {
  const startTime = Date.now()

  try {
    const {
      customerId,
      productId,
      brandId,
      categoryId,
      subcategoryId,
      quantity = 1,
      currentDate = new Date(),
    } = context

    logInfo(`[TM-022] Finding applicable rules for customer: ${customerId}`)

    const dateString = currentDate.toISOString().split("T")[0]

    let allRules = await getCachedDiscountRules(dateString)

    if (!allRules) {
      // Step 1: Query all active discount rules
      allRules = await db.query<DiscountRule>(
        `
        SELECT * FROM discount_rules
        WHERE status = 'active'
        AND start_date <= $1
        AND (end_date IS NULL OR end_date >= $1)
        ORDER BY level DESC, created_at DESC
      `,
        [dateString],
      )

      await setCachedDiscountRules(dateString, allRules)
    }

    logInfo(`[TM-022] Found ${allRules.length} active rules in date range`)

    // Step 2: Filter rules based on level and target
    const matchingRules = allRules.filter((rule) => {
      // Match based on hierarchy level
      switch (rule.level) {
        case "product":
          return rule.target_id === productId
        case "subcategory":
          return rule.target_id === subcategoryId
        case "category":
          return rule.target_id === categoryId
        case "brand":
          return rule.target_id === brandId
        default:
          return false
      }
    })

    logInfo(`[TM-022] ${matchingRules.length} rules match the context`)

    if (matchingRules.length === 0) {
      logInfo(`[TM-022] No matching rules found, returning early`)
      logInfo(`[TM-028] findApplicableRules completed in ${Date.now() - startTime}ms`)
      return []
    }

    // This replaces the N+1 query problem with 2 batch queries
    const ruleIds = matchingRules.map((r) => r.id)

    // Batch query 1: Load all tier definitions for matching rules
    const allTiersQuery = db.query<DiscountRuleTier>(
      `
      SELECT * FROM discount_rule_tiers
      WHERE rule_id = ANY($1)
      ORDER BY rule_id, tier ASC
    `,
      [ruleIds],
    )

    // Batch query 2: Load all customer tier assignments for matching rules
    const allAssignmentsQuery = db.query<CustomerTierAssignment>(
      `
      SELECT * FROM customer_tier_assignments
      WHERE rule_id = ANY($1) AND customer_id = $2
    `,
      [ruleIds, customerId],
    )

    const [allTiers, allAssignments] = await Promise.all([allTiersQuery, allAssignmentsQuery])

    const tiersByRuleId = new Map<string, DiscountRuleTier[]>()
    for (const tier of allTiers) {
      if (!tiersByRuleId.has(tier.rule_id)) {
        tiersByRuleId.set(tier.rule_id, [])
      }
      tiersByRuleId.get(tier.rule_id)!.push(tier)
    }

    const assignmentsByRuleId = new Map<string, CustomerTierAssignment>()
    for (const assignment of allAssignments) {
      assignmentsByRuleId.set(assignment.rule_id, assignment)
    }

    const applicableRules: ApplicableRule[] = []

    for (const rule of matchingRules) {
      const tiers = tiersByRuleId.get(rule.id) || []
      const assignment = assignmentsByRuleId.get(rule.id)
      const customerTier = assignment?.tier

      // Find the applicable discount tier based on customer assignment and quantity
      let applicableDiscount: DiscountRuleTier | undefined

      if (customerTier) {
        // Find the tier that matches the customer's assigned tier and quantity
        applicableDiscount = tiers.find(
          (tier) =>
            tier.tier === customerTier &&
            quantity >= tier.min_quantity &&
            (tier.max_quantity === null || quantity <= tier.max_quantity),
        )
      }

      applicableRules.push({
        ...rule,
        tiers,
        customerTier,
        applicableDiscount,
      })
    }

    logInfo(`[TM-022] Returning ${applicableRules.length} applicable rules`)
    logInfo(`[TM-028] findApplicableRules completed in ${Date.now() - startTime}ms`)

    return applicableRules
  } catch (error) {
    logError("[TM-022] Error finding applicable rules", error)
    throw error
  }
}

/**
 * Find applicable rules for a specific product
 * Convenience function that looks up product details and calls findApplicableRules
 *
 * @param customerId - The customer ID
 * @param productId - The product ID
 * @param quantity - The quantity being purchased
 * @returns Array of applicable rules
 */
export async function findApplicableRulesForProduct(
  customerId: string,
  productId: string,
  quantity = 1,
): Promise<ApplicableRule[]> {
  const startTime = Date.now()

  try {
    let product = await getCachedProductDetails(productId)

    if (!product) {
      // Load product details to get brand, category, subcategory
      const productResult = await db.query(
        `
        SELECT id, brand, category, subcategory
        FROM products
        WHERE id = $1
        LIMIT 1
      `,
        [productId],
      )

      if (productResult.length === 0) {
        throw new Error(`Product not found: ${productId}`)
      }

      product = productResult[0]

      await setCachedProductDetails(productId, product)
    }

    const { brand, category, subcategory } = product

    // Find applicable rules with full context
    const rules = await findApplicableRules({
      customerId,
      productId,
      brandId: brand,
      categoryId: category,
      subcategoryId: subcategory,
      quantity,
    })

    logInfo(`[TM-028] findApplicableRulesForProduct completed in ${Date.now() - startTime}ms`)

    return rules
  } catch (error) {
    logError("[TM-022] Error finding applicable rules for product", error)
    throw error
  }
}

/**
 * Find applicable rules for multiple products (batch processing)
 *
 * @param customerId - The customer ID
 * @param items - Array of {productId, quantity} objects
 * @returns Map of productId to applicable rules
 */
export async function findApplicableRulesForCart(
  customerId: string,
  items: Array<{ productId: string; quantity: number }>,
): Promise<Map<string, ApplicableRule[]>> {
  try {
    logInfo(`[TM-022] Finding applicable rules for cart with ${items.length} items`)

    const rulesMap = new Map<string, ApplicableRule[]>()

    // Process each item in parallel
    const promises = items.map(async (item) => {
      const rules = await findApplicableRulesForProduct(customerId, item.productId, item.quantity)
      return { productId: item.productId, rules }
    })

    const results = await Promise.all(promises)

    // Build the map
    for (const result of results) {
      rulesMap.set(result.productId, result.rules)
    }

    logInfo(`[TM-022] Found rules for ${rulesMap.size} products`)

    return rulesMap
  } catch (error) {
    logError("[TM-022] Error finding applicable rules for cart", error)
    throw error
  }
}

/**
 * Get the tier assignment for a specific customer and discount rule
 * Task TM-023: Implement getCustomerTierAssignment() function
 *
 * This function retrieves the customer's tier assignment (A, B, or C) for a given discount rule.
 * Returns null if the customer has no tier assignment for the specified rule.
 *
 * @param customerId - The customer ID to look up
 * @param ruleId - The discount rule ID to check
 * @returns The customer's tier assignment or null if not assigned
 */
export async function getCustomerTierAssignment(
  customerId: string,
  ruleId: string,
): Promise<CustomerTierAssignment | null> {
  try {
    logInfo(`[TM-023] Getting tier assignment for customer: ${customerId}, rule: ${ruleId}`)

    const cached = await getCachedCustomerTierAssignment(customerId, ruleId)

    if (cached !== undefined) {
      return cached as CustomerTierAssignment | null
    }

    const assignments = await db.query<CustomerTierAssignment>(
      `
      SELECT * FROM customer_tier_assignments
      WHERE customer_id = $1 AND rule_id = $2
      LIMIT 1
    `,
      [customerId, ruleId],
    )

    const assignment = assignments.length > 0 ? assignments[0] : null

    await setCachedCustomerTierAssignment(customerId, ruleId, assignment)

    if (assignment) {
      logInfo(`[TM-023] Found tier assignment: ${assignment.tier} for customer: ${customerId}, rule: ${ruleId}`)
    } else {
      logInfo(`[TM-023] No tier assignment found for customer: ${customerId}, rule: ${ruleId}`)
    }

    return assignment
  } catch (error) {
    logError("[TM-023] Error getting customer tier assignment", error)
    throw error
  }
}

/**
 * Get all tier assignments for a specific customer across all rules
 *
 * @param customerId - The customer ID to look up
 * @returns Array of all tier assignments for the customer
 */
export async function getCustomerTierAssignments(customerId: string): Promise<CustomerTierAssignment[]> {
  try {
    logInfo(`[TM-023] Getting all tier assignments for customer: ${customerId}`)

    const assignments = await db.query<CustomerTierAssignment>(
      `
      SELECT cta.*, dr.name as rule_name, dr.description as rule_description
      FROM customer_tier_assignments cta
      JOIN discount_rules dr ON cta.rule_id = dr.id
      WHERE cta.customer_id = $1
      ORDER BY cta.assigned_date DESC
    `,
      [customerId],
    )

    logInfo(`[TM-023] Found ${assignments.length} tier assignments for customer: ${customerId}`)

    return assignments
  } catch (error) {
    logError("[TM-023] Error getting customer tier assignments", error)
    throw error
  }
}

/**
 * Get all customers assigned to a specific tier for a discount rule
 *
 * @param ruleId - The discount rule ID
 * @param tier - Optional tier filter (A, B, or C)
 * @returns Array of customer tier assignments for the rule
 */
export async function getCustomersForRuleTier(
  ruleId: string,
  tier?: "A" | "B" | "C",
): Promise<CustomerTierAssignment[]> {
  try {
    logInfo(`[TM-023] Getting customers for rule: ${ruleId}, tier: ${tier || "all"}`)

    let query = `
      SELECT cta.*, c.name as customer_name, c.email as customer_email
      FROM customer_tier_assignments cta
      LEFT JOIN customers c ON cta.customer_id = c.id
      WHERE cta.rule_id = $1
    `
    const params: any[] = [ruleId]

    if (tier) {
      query += ` AND cta.tier = $2`
      params.push(tier)
    }

    query += ` ORDER BY cta.tier ASC, cta.assigned_date DESC`

    const assignments = await db.query<CustomerTierAssignment>(query, params)

    logInfo(`[TM-023] Found ${assignments.length} customer assignments for rule: ${ruleId}`)

    return assignments
  } catch (error) {
    logError("[TM-023] Error getting customers for rule tier", error)
    throw error
  }
}

/**
 * Check if a customer has any tier assignments
 *
 * @param customerId - The customer ID to check
 * @returns True if the customer has at least one tier assignment
 */
export async function hasCustomerTierAssignments(customerId: string): Promise<boolean> {
  try {
    const assignments = await db.query<{ count: number }>(
      `
      SELECT COUNT(*) as count
      FROM customer_tier_assignments
      WHERE customer_id = $1
    `,
      [customerId],
    )

    const hasAssignments = assignments[0].count > 0
    logInfo(`[TM-023] Customer ${customerId} has tier assignments: ${hasAssignments}`)

    return hasAssignments
  } catch (error) {
    logError("[TM-023] Error checking customer tier assignments", error)
    throw error
  }
}

/**
 * Get the discount information for a specific tier within a discount rule
 * Task TM-024: Implement getTierDiscount() function
 *
 * This function retrieves the discount details (type, value, quantity thresholds) for a specific
 * tier (A, B, or C) within a discount rule. This is used by the pricing engine to determine
 * what discount to apply based on the customer's tier assignment.
 *
 * @param ruleId - The discount rule ID
 * @param tier - The tier name (A, B, or C)
 * @param quantity - Optional quantity to filter by min/max quantity thresholds
 * @returns The discount tier information or null if not found
 */
export async function getTierDiscount(
  ruleId: string,
  tier: "A" | "B" | "C",
  quantity?: number,
): Promise<DiscountRuleTier | null> {
  try {
    logInfo(`[TM-024] Getting tier discount for rule: ${ruleId}, tier: ${tier}, quantity: ${quantity || "any"}`)

    let allTiers = await getCachedRuleTiers(ruleId)

    if (!allTiers) {
      allTiers = await db.query<DiscountRuleTier>(
        `
        SELECT * FROM discount_rule_tiers
        WHERE rule_id = $1
        ORDER BY tier ASC, min_quantity DESC
      `,
        [ruleId],
      )

      await setCachedRuleTiers(ruleId, allTiers)
    }

    let matchingTiers = allTiers.filter((t) => t.tier === tier)

    if (quantity !== undefined) {
      matchingTiers = matchingTiers.filter(
        (t) => t.min_quantity <= quantity && (t.max_quantity === null || t.max_quantity >= quantity),
      )
    }

    // Sort by min_quantity DESC and take the first one
    matchingTiers.sort((a, b) => b.min_quantity - a.min_quantity)

    const tierDiscount = matchingTiers.length > 0 ? matchingTiers[0] : null

    if (tierDiscount) {
      logInfo(
        `[TM-024] Found discount tier: ${tierDiscount.discount_type} ${tierDiscount.discount_value} for rule: ${ruleId}, tier: ${tier}`,
      )
    } else {
      logInfo(`[TM-024] No discount tier found for rule: ${ruleId}, tier: ${tier}`)
    }

    return tierDiscount
  } catch (error) {
    logError("[TM-024] Error getting tier discount", error)
    throw error
  }
}

/**
 * Get all discount tiers for a specific rule
 *
 * @param ruleId - The discount rule ID
 * @returns Array of all discount tiers for the rule, ordered by tier (A, B, C)
 */
export async function getAllTierDiscounts(ruleId: string): Promise<DiscountRuleTier[]> {
  try {
    logInfo(`[TM-024] Getting all tier discounts for rule: ${ruleId}`)

    const tiers = await db.query<DiscountRuleTier>(
      `
      SELECT * FROM discount_rule_tiers
      WHERE rule_id = $1
      ORDER BY tier ASC, min_quantity ASC
    `,
      [ruleId],
    )

    logInfo(`[TM-024] Found ${tiers.length} tier discounts for rule: ${ruleId}`)

    return tiers
  } catch (error) {
    logError("[TM-024] Error getting all tier discounts", error)
    throw error
  }
}

/**
 * Get the best discount tier for a customer based on their assignment and quantity
 *
 * @param ruleId - The discount rule ID
 * @param customerId - The customer ID
 * @param quantity - The quantity being purchased
 * @returns The best applicable discount tier or null if none applies
 */
export async function getBestTierDiscountForCustomer(
  ruleId: string,
  customerId: string,
  quantity: number,
): Promise<DiscountRuleTier | null> {
  try {
    logInfo(`[TM-024] Getting best tier discount for customer: ${customerId}, rule: ${ruleId}, quantity: ${quantity}`)

    // Get the customer's tier assignment
    const assignment = await getCustomerTierAssignment(customerId, ruleId)

    if (!assignment) {
      logInfo(`[TM-024] Customer ${customerId} has no tier assignment for rule: ${ruleId}`)
      return null
    }

    // Get the discount for the customer's assigned tier and quantity
    const tierDiscount = await getTierDiscount(ruleId, assignment.tier, quantity)

    if (tierDiscount) {
      logInfo(
        `[TM-024] Best discount for customer ${customerId}: ${tierDiscount.discount_type} ${tierDiscount.discount_value}`,
      )
    } else {
      logInfo(`[TM-024] No applicable discount found for customer ${customerId} at quantity ${quantity}`)
    }

    return tierDiscount
  } catch (error) {
    logError("[TM-024] Error getting best tier discount for customer", error)
    throw error
  }
}

/**
 * Calculate the discount amount based on tier discount information
 *
 * @param tierDiscount - The discount tier information
 * @param basePrice - The base price before discount
 * @param quantity - The quantity being purchased
 * @returns The discount amount to subtract from the total
 */
export function calculateDiscountAmount(tierDiscount: DiscountRuleTier, basePrice: number, quantity: number): number {
  const total = basePrice * quantity

  switch (tierDiscount.discount_type) {
    case "percentage":
      return total * (tierDiscount.discount_value / 100)
    case "fixed_amount":
      return tierDiscount.discount_value * quantity
    case "price_override":
      return total - tierDiscount.discount_value * quantity
    default:
      return 0
  }
}

/**
 * Input parameters for customer price calculation
 */
export interface PriceCalculationInput {
  customerId: string
  productId: string
  quantity: number
  basePrice: number
  currentDate?: Date
}

/**
 * Detailed information about a discount that was evaluated
 */
export interface EvaluatedDiscount {
  ruleId: string
  ruleName: string
  ruleType: string
  tier: "A" | "B" | "C"
  discountType: "percentage" | "fixed_amount" | "price_override"
  discountValue: number
  discountAmount: number
  finalPrice: number
  savings: number
}

/**
 * Result of customer price calculation
 */
export interface PriceCalculationResult {
  customerId: string
  productId: string
  quantity: number
  basePrice: number
  baseTotalPrice: number
  finalPrice: number
  finalUnitPrice: number
  totalSavings: number
  savingsPercentage: number
  discountApplied: boolean
  bestDiscount: EvaluatedDiscount | null
  allEvaluatedDiscounts: EvaluatedDiscount[]
  calculatedAt: Date
}

/**
 * Calculate the final price for a customer purchasing a product
 * Task TM-025: Implement calculateCustomerPrice() main function
 *
 * This is the main pricing calculation function that:
 * 1. Finds all applicable discount rules for the customer and product
 * 2. Evaluates each rule to calculate potential discounts
 * 3. Selects the best discount (highest savings) - no stacking
 * 4. Returns detailed pricing information including all evaluated discounts
 *
 * @param input - The pricing calculation input parameters
 * @returns Detailed pricing calculation result
 */
export async function calculateCustomerPrice(input: PriceCalculationInput): Promise<PriceCalculationResult> {
  const startTime = Date.now()

  try {
    const { customerId, productId, quantity, basePrice, currentDate = new Date() } = input

    logInfo(
      `[TM-025] Calculating price for customer: ${customerId}, product: ${productId}, quantity: ${quantity}, base price: ${basePrice}`,
    )

    const cached = await getCachedPricingCalculation(customerId, productId, quantity)
    if (cached) {
      logInfo(`[TM-028] Using cached pricing calculation (${Date.now() - startTime}ms)`)
      return cached as PriceCalculationResult
    }

    // Calculate base total price
    const baseTotalPrice = basePrice * quantity

    // Step 1: Find all applicable discount rules
    const applicableRules = await findApplicableRulesForProduct(customerId, productId, quantity)

    logInfo(`[TM-025] Found ${applicableRules.length} applicable rules`)

    if (applicableRules.length === 0) {
      const result: PriceCalculationResult = {
        customerId,
        productId,
        quantity,
        basePrice,
        baseTotalPrice,
        finalPrice: baseTotalPrice,
        finalUnitPrice: basePrice,
        totalSavings: 0,
        savingsPercentage: 0,
        discountApplied: false,
        bestDiscount: null,
        allEvaluatedDiscounts: [],
        calculatedAt: currentDate,
      }

      const calculationDurationMs = Date.now() - startTime
      logInfo(`[TM-025] No applicable rules, returning base price (${calculationDurationMs}ms)`)
      logInfo(`[TM-028] Performance: ${calculationDurationMs}ms ${calculationDurationMs < 200 ? "✓" : "✗ SLOW"}`)

      await setCachedPricingCalculation(customerId, productId, quantity, result)

      return result
    }

    // Step 2: Evaluate each rule to calculate potential discounts
    const evaluatedDiscounts: EvaluatedDiscount[] = []
    const ruleMetadata = new Map<string, { level: string; createdAt: string }>()

    for (const rule of applicableRules) {
      // Store rule metadata for tie-breaking
      ruleMetadata.set(rule.id, {
        level: rule.level,
        createdAt: rule.created_at,
      })

      // Skip rules where customer has no tier assignment
      if (!rule.customerTier) {
        logInfo(`[TM-025] Skipping rule ${rule.id} - customer has no tier assignment`)
        continue
      }

      // This avoids an extra database query
      const tierDiscount = rule.applicableDiscount

      if (!tierDiscount) {
        logInfo(`[TM-025] Skipping rule ${rule.id} - no applicable tier discount for quantity ${quantity}`)
        continue
      }

      // Calculate the discount amount
      const discountAmount = calculateDiscountAmount(tierDiscount, basePrice, quantity)
      const finalPrice = baseTotalPrice - discountAmount
      const savings = discountAmount

      evaluatedDiscounts.push({
        ruleId: rule.id,
        ruleName: rule.name,
        ruleType: rule.rule_type,
        tier: rule.customerTier,
        discountType: tierDiscount.discount_type,
        discountValue: tierDiscount.discount_value,
        discountAmount,
        finalPrice,
        savings,
      })

      logInfo(
        `[TM-025] Evaluated rule ${rule.name}: ${tierDiscount.discount_type} ${tierDiscount.discount_value}, savings: ${savings}`,
      )
    }

    if (evaluatedDiscounts.length > 1) {
      await logDiscountEvaluation({
        customerId,
        productId,
        quantity,
        evaluatedDiscounts: evaluatedDiscounts.map((d) => ({
          ruleId: d.ruleId,
          ruleName: d.ruleName,
          tierName: d.tier,
          discountAmount: d.discountAmount,
          savings: d.savings,
        })),
      })
    }

    const bestDiscount = selectBestDiscount(evaluatedDiscounts, "best_for_customer", ruleMetadata)

    if (bestDiscount) {
      validateNoStacking([bestDiscount])
      logInfo(`[TM-025] Best discount selected: ${bestDiscount.ruleName} with savings of ${bestDiscount.savings}`)
      logInfo(`[TM-026] ${explainDiscountSelection(bestDiscount, evaluatedDiscounts)}`)
    } else {
      logInfo(`[TM-025] No applicable discounts found`)
    }

    // Step 4: Calculate final pricing
    const finalPrice = bestDiscount ? bestDiscount.finalPrice : baseTotalPrice
    const finalUnitPrice = finalPrice / quantity
    const totalSavings = bestDiscount ? bestDiscount.savings : 0
    const savingsPercentage = baseTotalPrice > 0 ? (totalSavings / baseTotalPrice) * 100 : 0

    const result: PriceCalculationResult = {
      customerId,
      productId,
      quantity,
      basePrice,
      baseTotalPrice,
      finalPrice,
      finalUnitPrice,
      totalSavings,
      savingsPercentage,
      discountApplied: bestDiscount !== null,
      bestDiscount,
      allEvaluatedDiscounts: evaluatedDiscounts,
      calculatedAt: currentDate,
    }

    const calculationDurationMs = Date.now() - startTime

    logInfo(
      `[TM-025] Price calculation complete: base ${baseTotalPrice}, final ${finalPrice}, savings ${totalSavings} (${savingsPercentage.toFixed(2)}%)`,
    )
    logInfo(`[TM-028] Performance: ${calculationDurationMs}ms ${calculationDurationMs < 200 ? "✓" : "✗ SLOW"}`)

    await logSuccessfulPricing({
      customerId,
      productId,
      quantity,
      basePrice,
      finalPrice,
      discountAmount: totalSavings,
      discountPercentage: savingsPercentage,
      ruleId: bestDiscount?.ruleId,
      ruleName: bestDiscount?.ruleName,
      tierName: bestDiscount?.tier,
      evaluatedDiscounts: evaluatedDiscounts.map((d) => ({
        ruleId: d.ruleId,
        ruleName: d.ruleName,
        tierName: d.tier,
        discountAmount: d.discountAmount,
        savings: d.savings,
      })),
      selectionReason: bestDiscount ? explainDiscountSelection(bestDiscount, evaluatedDiscounts) : undefined,
      calculationDurationMs,
    })

    await setCachedPricingCalculation(customerId, productId, quantity, result)

    return result
  } catch (error) {
    const calculationDurationMs = Date.now() - startTime

    logError("[TM-025] Error calculating customer price", error)

    await logPricingError({
      customerId: input.customerId,
      productId: input.productId,
      quantity: input.quantity,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorDetails: {
        error: String(error),
        calculationDurationMs,
      },
    })

    throw error
  }
}

/**
 * Calculate prices for multiple products in a shopping cart
 *
 * @param customerId - The customer ID
 * @param items - Array of cart items with productId, quantity, and basePrice
 * @returns Array of price calculation results for each item
 */
export async function calculateCartPrices(
  customerId: string,
  items: Array<{ productId: string; quantity: number; basePrice: number }>,
): Promise<PriceCalculationResult[]> {
  try {
    logInfo(`[TM-025] Calculating prices for cart with ${items.length} items`)

    // Process each item in parallel
    const promises = items.map((item) =>
      calculateCustomerPrice({
        customerId,
        productId: item.productId,
        quantity: item.quantity,
        basePrice: item.basePrice,
      }),
    )

    const results = await Promise.all(promises)

    const totalSavings = results.reduce((sum, result) => sum + result.totalSavings, 0)
    const totalBasePrice = results.reduce((sum, result) => sum + result.baseTotalPrice, 0)
    const totalFinalPrice = results.reduce((sum, result) => sum + result.finalPrice, 0)

    logInfo(
      `[TM-025] Cart calculation complete: base ${totalBasePrice}, final ${totalFinalPrice}, total savings ${totalSavings}`,
    )

    return results
  } catch (error) {
    logError("[TM-025] Error calculating cart prices", error)
    throw error
  }
}

/**
 * Get a summary of potential savings for a customer on a product
 * Useful for showing "You could save X%" messaging
 *
 * @param customerId - The customer ID
 * @param productId - The product ID
 * @param basePrice - The base price of the product
 * @returns Summary of potential savings at different quantities
 */
export async function getCustomerSavingsSummary(
  customerId: string,
  productId: string,
  basePrice: number,
): Promise<
  Array<{
    quantity: number
    savings: number
    savingsPercentage: number
    finalPrice: number
  }>
> {
  try {
    logInfo(`[TM-025] Getting savings summary for customer: ${customerId}, product: ${productId}`)

    // Calculate prices at different quantity tiers (1, 5, 10, 25, 50, 100)
    const quantities = [1, 5, 10, 25, 50, 100]
    const summaries = []

    for (const quantity of quantities) {
      const result = await calculateCustomerPrice({
        customerId,
        productId,
        quantity,
        basePrice,
      })

      if (result.discountApplied) {
        summaries.push({
          quantity,
          savings: result.totalSavings,
          savingsPercentage: result.savingsPercentage,
          finalPrice: result.finalPrice,
        })
      }
    }

    logInfo(`[TM-025] Found ${summaries.length} quantity tiers with savings`)

    return summaries
  } catch (error) {
    logError("[TM-025] Error getting customer savings summary", error)
    throw error
  }
}

/**
 * Strategy for selecting the best discount when multiple discounts apply
 */
export type DiscountSelectionStrategy = "best_for_customer" | "best_for_business" | "highest_percentage"

/**
 * Comparison result for two discounts
 */
interface DiscountComparison {
  winner: EvaluatedDiscount
  reason: string
}

/**
 * Select the best discount from multiple evaluated discounts
 * Task TM-026: Implement best discount selection logic (no stacking)
 *
 * This function implements a sophisticated algorithm to select the single best discount
 * when multiple discounts could apply. The key principle is NO STACKING - only one
 * discount can be applied at a time.
 *
 * Selection algorithm (in priority order):
 * 1. Primary: Highest savings amount (best for customer)
 * 2. Tie-breaker 1: Highest savings percentage
 * 3. Tie-breaker 2: Rule hierarchy level (product > subcategory > category > brand)
 * 4. Tie-breaker 3: Better tier assignment (A > B > C)
 * 5. Tie-breaker 4: Most recently created rule
 *
 * @param evaluatedDiscounts - Array of evaluated discounts to compare
 * @param strategy - Selection strategy (default: best_for_customer)
 * @param ruleMetadata - Optional metadata about rules for tie-breaking
 * @returns The best discount or null if no discounts provided
 */
export function selectBestDiscount(
  evaluatedDiscounts: EvaluatedDiscount[],
  strategy: DiscountSelectionStrategy = "best_for_customer",
  ruleMetadata?: Map<string, { level: string; createdAt: string }>,
): EvaluatedDiscount | null {
  try {
    logInfo(`[TM-026] Selecting best discount from ${evaluatedDiscounts.length} options using strategy: ${strategy}`)

    // Validation: No discounts to select from
    if (evaluatedDiscounts.length === 0) {
      logInfo(`[TM-026] No discounts to select from`)
      return null
    }

    // Validation: Only one discount - return it
    if (evaluatedDiscounts.length === 1) {
      logInfo(`[TM-026] Only one discount available: ${evaluatedDiscounts[0].ruleName}`)
      return evaluatedDiscounts[0]
    }

    // Apply selection strategy
    let bestDiscount: EvaluatedDiscount

    switch (strategy) {
      case "best_for_customer":
        bestDiscount = selectBestForCustomer(evaluatedDiscounts, ruleMetadata)
        break
      case "best_for_business":
        bestDiscount = selectBestForBusiness(evaluatedDiscounts, ruleMetadata)
        break
      case "highest_percentage":
        bestDiscount = selectHighestPercentage(evaluatedDiscounts, ruleMetadata)
        break
      default:
        bestDiscount = selectBestForCustomer(evaluatedDiscounts, ruleMetadata)
    }

    logInfo(
      `[TM-026] Selected best discount: ${bestDiscount.ruleName} (${bestDiscount.discountType} ${bestDiscount.discountValue}, savings: ${bestDiscount.savings})`,
    )

    return bestDiscount
  } catch (error) {
    logError("[TM-026] Error selecting best discount", error)
    throw error
  }
}

/**
 * Select the best discount for the customer (highest savings)
 * This is the default strategy that maximizes customer value
 */
function selectBestForCustomer(
  discounts: EvaluatedDiscount[],
  ruleMetadata?: Map<string, { level: string; createdAt: string }>,
): EvaluatedDiscount {
  logInfo(`[TM-026] Applying best_for_customer strategy`)

  // Sort by multiple criteria
  const sorted = [...discounts].sort((a, b) => {
    // 1. Primary: Highest savings amount
    if (a.savings !== b.savings) {
      const result = b.savings - a.savings
      logInfo(`[TM-026] Comparing ${a.ruleName} vs ${b.ruleName}: savings ${a.savings} vs ${b.savings}`)
      return result
    }

    // 2. Tie-breaker 1: Highest savings percentage
    const aPercentage = (a.savings / (a.finalPrice + a.savings)) * 100
    const bPercentage = (b.savings / (b.finalPrice + b.savings)) * 100
    if (Math.abs(aPercentage - bPercentage) > 0.01) {
      logInfo(`[TM-026] Tie-breaker 1: savings percentage ${aPercentage.toFixed(2)}% vs ${bPercentage.toFixed(2)}%`)
      return bPercentage - aPercentage
    }

    // 3. Tie-breaker 2: Rule hierarchy level (product > subcategory > category > brand)
    if (ruleMetadata) {
      const aLevel = ruleMetadata.get(a.ruleId)?.level || "brand"
      const bLevel = ruleMetadata.get(b.ruleId)?.level || "brand"
      const levelPriority = { product: 4, subcategory: 3, category: 2, brand: 1 }
      const aLevelPriority = levelPriority[aLevel as keyof typeof levelPriority] || 0
      const bLevelPriority = levelPriority[bLevel as keyof typeof levelPriority] || 0

      if (aLevelPriority !== bLevelPriority) {
        logInfo(`[TM-026] Tie-breaker 2: rule level ${aLevel} vs ${bLevel}`)
        return bLevelPriority - aLevelPriority
      }
    }

    // 4. Tie-breaker 3: Better tier assignment (A > B > C)
    const tierPriority = { A: 3, B: 2, C: 1 }
    const aTierPriority = tierPriority[a.tier]
    const bTierPriority = tierPriority[b.tier]
    if (aTierPriority !== bTierPriority) {
      logInfo(`[TM-026] Tie-breaker 3: tier ${a.tier} vs ${b.tier}`)
      return bTierPriority - aTierPriority
    }

    // 5. Tie-breaker 4: Most recently created rule
    if (ruleMetadata) {
      const aCreatedAt = ruleMetadata.get(a.ruleId)?.createdAt || ""
      const bCreatedAt = ruleMetadata.get(b.ruleId)?.createdAt || ""
      if (aCreatedAt !== bCreatedAt) {
        logInfo(`[TM-026] Tie-breaker 4: created at ${aCreatedAt} vs ${bCreatedAt}`)
        return bCreatedAt.localeCompare(aCreatedAt)
      }
    }

    // If all else is equal, maintain original order
    return 0
  })

  return sorted[0]
}

/**
 * Select the best discount for the business (lowest discount amount)
 * This strategy minimizes the discount given while still providing value
 */
function selectBestForBusiness(
  discounts: EvaluatedDiscount[],
  ruleMetadata?: Map<string, { level: string; createdAt: string }>,
): EvaluatedDiscount {
  logInfo(`[TM-026] Applying best_for_business strategy`)

  // Sort by lowest savings (best margin for business)
  const sorted = [...discounts].sort((a, b) => {
    // 1. Primary: Lowest savings amount (best margin for business)
    if (a.savings !== b.savings) {
      return a.savings - b.savings
    }

    // 2. Tie-breaker: Use same logic as best_for_customer for consistency
    return 0
  })

  return sorted[0]
}

/**
 * Select the discount with the highest percentage
 * This strategy is useful for marketing purposes ("Save up to X%!")
 */
function selectHighestPercentage(
  discounts: EvaluatedDiscount[],
  ruleMetadata?: Map<string, { level: string; createdAt: string }>,
): EvaluatedDiscount {
  logInfo(`[TM-026] Applying highest_percentage strategy`)

  // Sort by highest percentage
  const sorted = [...discounts].sort((a, b) => {
    const aPercentage = (a.savings / (a.finalPrice + a.savings)) * 100
    const bPercentage = (b.savings / (b.finalPrice + b.savings)) * 100

    if (Math.abs(aPercentage - bPercentage) > 0.01) {
      return bPercentage - aPercentage
    }

    // Tie-breaker: Highest absolute savings
    return b.savings - a.savings
  })

  return sorted[0]
}

/**
 * Compare two discounts and explain which is better
 * Useful for debugging and customer communication
 *
 * @param discountA - First discount to compare
 * @param discountB - Second discount to compare
 * @returns Comparison result with winner and explanation
 */
export function compareDiscounts(discountA: EvaluatedDiscount, discountB: EvaluatedDiscount): DiscountComparison {
  // Compare savings amount
  if (discountA.savings > discountB.savings) {
    return {
      winner: discountA,
      reason: `${discountA.ruleName} provides higher savings ($${discountA.savings.toFixed(2)} vs $${discountB.savings.toFixed(2)})`,
    }
  } else if (discountB.savings > discountA.savings) {
    return {
      winner: discountB,
      reason: `${discountB.ruleName} provides higher savings ($${discountB.savings.toFixed(2)} vs $${discountA.savings.toFixed(2)})`,
    }
  }

  // Compare savings percentage
  const aPercentage = (discountA.savings / (discountA.finalPrice + discountA.savings)) * 100
  const bPercentage = (discountB.savings / (discountB.finalPrice + discountB.savings)) * 100

  if (Math.abs(aPercentage - bPercentage) > 0.01) {
    if (aPercentage > bPercentage) {
      return {
        winner: discountA,
        reason: `${discountA.ruleName} provides higher percentage savings (${aPercentage.toFixed(2)}% vs ${bPercentage.toFixed(2)}%)`,
      }
    } else {
      return {
        winner: discountB,
        reason: `${discountB.ruleName} provides higher percentage savings (${bPercentage.toFixed(2)}% vs ${aPercentage.toFixed(2)}%)`,
      }
    }
  }

  // Compare tier priority
  const tierPriority = { A: 3, B: 2, C: 1 }
  const aTierPriority = tierPriority[discountA.tier]
  const bTierPriority = tierPriority[discountB.tier]

  if (aTierPriority > bTierPriority) {
    return {
      winner: discountA,
      reason: `${discountA.ruleName} has better tier assignment (${discountA.tier} vs ${discountB.tier})`,
    }
  } else if (bTierPriority > aTierPriority) {
    return {
      winner: discountB,
      reason: `${discountB.ruleName} has better tier assignment (${discountB.tier} vs ${discountA.tier})`,
    }
  }

  // If all else is equal, return the first one
  return {
    winner: discountA,
    reason: `Both discounts are equivalent, selecting ${discountA.ruleName} by default`,
  }
}

/**
 * Validate that no discount stacking is occurring
 * This function ensures the "no stacking" policy is enforced
 *
 * @param appliedDiscounts - Array of discounts that are being applied
 * @throws Error if multiple discounts are being applied (stacking detected)
 */
export function validateNoStacking(appliedDiscounts: EvaluatedDiscount[]): void {
  if (appliedDiscounts.length > 1) {
    const discountNames = appliedDiscounts.map((d) => d.ruleName).join(", ")
    const errorMessage = `[TM-026] POLICY VIOLATION: Discount stacking detected! Multiple discounts cannot be applied: ${discountNames}`
    logError(errorMessage)
    throw new Error(`Discount stacking is not allowed. Only one discount can be applied at a time.`)
  }

  logInfo(`[TM-026] No stacking validation passed: ${appliedDiscounts.length} discount(s) applied`)
}

/**
 * Get a detailed explanation of why a specific discount was selected
 *
 * @param selectedDiscount - The discount that was selected
 * @param allDiscounts - All discounts that were evaluated
 * @returns Human-readable explanation of the selection
 */
export function explainDiscountSelection(
  selectedDiscount: EvaluatedDiscount,
  allDiscounts: EvaluatedDiscount[],
): string {
  if (allDiscounts.length === 1) {
    return `${selectedDiscount.ruleName} was the only applicable discount.`
  }

  const otherDiscounts = allDiscounts.filter((d) => d.ruleId !== selectedDiscount.ruleId)
  const comparisons = otherDiscounts.map((other) => {
    const comparison = compareDiscounts(selectedDiscount, other)
    return `- vs ${other.ruleName}: ${comparison.reason}`
  })

  return `${selectedDiscount.ruleName} was selected because it provides the best value:\n${comparisons.join("\n")}`
}
