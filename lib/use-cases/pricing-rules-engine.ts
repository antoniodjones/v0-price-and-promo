import type { PricingRule, PricingCondition } from "@/lib/entities/product"

export interface RuleEngineConfig {
  enableNoStackingPolicy: boolean
  maxDiscountPercentage: number
  allowNegativePricing: boolean
  debugMode: boolean
}

export class PricingRulesEngine {
  private config: RuleEngineConfig
  private rules: PricingRule[] = []

  constructor(config: Partial<RuleEngineConfig> = {}) {
    this.config = {
      enableNoStackingPolicy: true,
      maxDiscountPercentage: 50,
      allowNegativePricing: false,
      debugMode: false,
      ...config,
    }
  }

  /**
   * Add a pricing rule to the engine
   */
  addRule(rule: PricingRule): void {
    try {
      if (!rule?.id || !rule?.name || !rule?.action) {
        throw new Error("Invalid rule: missing required fields")
      }

      // Remove existing rule with same ID
      this.rules = this.rules.filter((r) => r.id !== rule.id)

      // Add new rule
      this.rules.push({ ...rule })

      // Sort by priority (lower number = higher priority)
      this.rules.sort((a, b) => (a.priority || 999) - (b.priority || 999))

      if (this.config.debugMode) {
        console.log(`[v0] Added pricing rule: ${rule.name}`)
      }
    } catch (error) {
      console.error("[v0] Error adding pricing rule:", error)
    }
  }

  /**
   * Remove a pricing rule
   */
  removeRule(ruleId: string): void {
    try {
      if (!ruleId || typeof ruleId !== "string") {
        console.warn("[v0] Invalid rule ID provided for removal")
        return
      }

      const initialCount = this.rules.length
      this.rules = this.rules.filter((r) => r.id !== ruleId)

      if (this.config.debugMode && this.rules.length < initialCount) {
        console.log(`[v0] Removed pricing rule: ${ruleId}`)
      }
    } catch (error) {
      console.error("[v0] Error removing pricing rule:", error)
    }
  }

  /**
   * Get all active rules
   */
  getActiveRules(): PricingRule[] {
    try {
      return this.rules.filter((rule) => rule?.isActive === true)
    } catch {
      return []
    }
  }

  /**
   * Validate rule configuration
   */
  validateRule(rule: PricingRule): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    try {
      // Required fields
      if (!rule?.id || typeof rule.id !== "string") {
        errors.push("Rule ID is required and must be a string")
      }

      if (!rule?.name || typeof rule.name !== "string") {
        errors.push("Rule name is required and must be a string")
      }

      if (!rule?.action) {
        errors.push("Rule action is required")
      } else {
        // Validate action
        if (![`percentage_discount`, `fixed_discount`, `fixed_price`].includes(rule.action.type)) {
          errors.push("Invalid action type")
        }

        if (typeof rule.action.value !== "number" || rule.action.value < 0) {
          errors.push("Action value must be a non-negative number")
        }

        if (rule.action.type === "percentage_discount" && rule.action.value > 100) {
          errors.push("Percentage discount cannot exceed 100%")
        }
      }

      // Validate conditions
      if (rule?.conditions && Array.isArray(rule.conditions)) {
        rule.conditions.forEach((condition, index) => {
          if (!condition?.field || typeof condition.field !== "string") {
            errors.push(`Condition ${index + 1}: field is required`)
          }

          if (
            !condition?.operator ||
            !["equals", "greater_than", "less_than", "contains", "in_range"].includes(condition.operator)
          ) {
            errors.push(`Condition ${index + 1}: invalid operator`)
          }

          if (condition?.value === undefined || condition?.value === null) {
            errors.push(`Condition ${index + 1}: value is required`)
          }
        })
      }

      return {
        isValid: errors.length === 0,
        errors,
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ["Error validating rule: " + (error instanceof Error ? error.message : "Unknown error")],
      }
    }
  }

  /**
   * Create a rule builder for easier rule creation
   */
  createRuleBuilder(): RuleBuilder {
    return new RuleBuilder(this)
  }

  /**
   * Export rules configuration
   */
  exportRules(): PricingRule[] {
    try {
      return JSON.parse(JSON.stringify(this.rules))
    } catch {
      return []
    }
  }

  /**
   * Import rules configuration
   */
  importRules(rules: PricingRule[]): { imported: number; errors: string[] } {
    const errors: string[] = []
    let imported = 0

    try {
      if (!Array.isArray(rules)) {
        throw new Error("Rules must be an array")
      }

      for (const rule of rules) {
        try {
          const validation = this.validateRule(rule)
          if (validation.isValid) {
            this.addRule(rule)
            imported++
          } else {
            errors.push(`Rule ${rule?.id || "unknown"}: ${validation.errors.join(", ")}`)
          }
        } catch (ruleError) {
          errors.push(
            `Rule ${rule?.id || "unknown"}: ${ruleError instanceof Error ? ruleError.message : "Unknown error"}`,
          )
        }
      }

      return { imported, errors }
    } catch (error) {
      return {
        imported: 0,
        errors: ["Import failed: " + (error instanceof Error ? error.message : "Unknown error")],
      }
    }
  }
}

/**
 * Rule builder for fluent API
 */
export class RuleBuilder {
  private rule: Partial<PricingRule> = {
    conditions: [],
    isActive: true,
    priority: 5,
  }

  constructor(private engine: PricingRulesEngine) {}

  id(id: string): RuleBuilder {
    try {
      this.rule.id = id || `rule-${Date.now()}`
    } catch {
      this.rule.id = `rule-${Date.now()}`
    }
    return this
  }

  name(name: string): RuleBuilder {
    try {
      this.rule.name = name || "Unnamed Rule"
    } catch {
      this.rule.name = "Unnamed Rule"
    }
    return this
  }

  type(type: PricingRule["type"]): RuleBuilder {
    try {
      this.rule.type = type
    } catch {
      // Keep existing type or default
    }
    return this
  }

  priority(priority: number): RuleBuilder {
    try {
      this.rule.priority = typeof priority === "number" && priority >= 0 ? priority : 5
    } catch {
      this.rule.priority = 5
    }
    return this
  }

  condition(field: string, operator: PricingCondition["operator"], value: any): RuleBuilder {
    try {
      if (!this.rule.conditions) {
        this.rule.conditions = []
      }
      if (field && operator && value !== undefined) {
        this.rule.conditions.push({ field, operator, value })
      }
    } catch {
      // Skip invalid condition
    }
    return this
  }

  percentageDiscount(percentage: number, maxDiscount?: number): RuleBuilder {
    try {
      const safePercentage = typeof percentage === "number" && percentage >= 0 && percentage <= 100 ? percentage : 0
      this.rule.action = {
        type: "percentage_discount",
        value: safePercentage,
        maxDiscount: typeof maxDiscount === "number" && maxDiscount > 0 ? maxDiscount : undefined,
      }
    } catch {
      this.rule.action = {
        type: "percentage_discount",
        value: 0,
      }
    }
    return this
  }

  fixedDiscount(amount: number): RuleBuilder {
    try {
      const safeAmount = typeof amount === "number" && amount >= 0 ? amount : 0
      this.rule.action = {
        type: "fixed_discount",
        value: safeAmount,
      }
    } catch {
      this.rule.action = {
        type: "fixed_discount",
        value: 0,
      }
    }
    return this
  }

  fixedPrice(price: number): RuleBuilder {
    try {
      const safePrice = typeof price === "number" && price >= 0 ? price : 0
      this.rule.action = {
        type: "fixed_price",
        value: safePrice,
      }
    } catch {
      this.rule.action = {
        type: "fixed_price",
        value: 0,
      }
    }
    return this
  }

  active(isActive = true): RuleBuilder {
    try {
      this.rule.isActive = Boolean(isActive)
    } catch {
      this.rule.isActive = true
    }
    return this
  }

  build(): PricingRule {
    if (!this.rule.id || !this.rule.name || !this.rule.action) {
      throw new Error("Rule must have id, name, and action")
    }

    const builtRule = this.rule as PricingRule
    const validation = this.engine.validateRule(builtRule)

    if (!validation.isValid) {
      throw new Error(`Invalid rule: ${validation.errors.join(", ")}`)
    }

    return builtRule
  }

  save(): PricingRule {
    const rule = this.build()
    this.engine.addRule(rule)
    return rule
  }
}

/**
 * Pre-built cannabis industry rule templates
 */
export const CannabisRuleTemplates = {
  expirationDiscount: (days: number, discountPercentage: number) => {
    try {
      const safeDays = typeof days === "number" && days > 0 ? days : 30
      const safeDiscount =
        typeof discountPercentage === "number" && discountPercentage > 0 && discountPercentage <= 100
          ? discountPercentage
          : 15

      return new RuleBuilder(new PricingRulesEngine())
        .id(`expiration-${safeDays}-day`)
        .name(`${safeDays}-Day Expiration Discount`)
        .type("expiration")
        .priority(1)
        .condition("product.expirationDate", "less_than", safeDays)
        .percentageDiscount(safeDiscount)
        .build()
    } catch {
      // Return a safe default rule
      return new RuleBuilder(new PricingRulesEngine())
        .id("expiration-default")
        .name("Default Expiration Discount")
        .type("expiration")
        .priority(1)
        .condition("product.expirationDate", "less_than", 30)
        .percentageDiscount(15)
        .build()
    }
  },

  volumeDiscount: (minQuantity: number, discountPercentage: number) => {
    try {
      const safeQuantity = typeof minQuantity === "number" && minQuantity > 0 ? minQuantity : 5
      const safeDiscount =
        typeof discountPercentage === "number" && discountPercentage > 0 && discountPercentage <= 100
          ? discountPercentage
          : 10

      return new RuleBuilder(new PricingRulesEngine())
        .id(`volume-${safeQuantity}`)
        .name(`Volume Discount (${safeQuantity}+ units)`)
        .type("volume")
        .priority(3)
        .condition("context.orderQuantity", "greater_than", safeQuantity)
        .percentageDiscount(safeDiscount)
        .build()
    } catch {
      return new RuleBuilder(new PricingRulesEngine())
        .id("volume-default")
        .name("Default Volume Discount")
        .type("volume")
        .priority(3)
        .condition("context.orderQuantity", "greater_than", 5)
        .percentageDiscount(10)
        .build()
    }
  },

  lowThcDiscount: (thcThreshold: number, discountPercentage: number) => {
    try {
      const safeThreshold =
        typeof thcThreshold === "number" && thcThreshold > 0 && thcThreshold <= 100 ? thcThreshold : 15
      const safeDiscount =
        typeof discountPercentage === "number" && discountPercentage > 0 && discountPercentage <= 100
          ? discountPercentage
          : 10

      return new RuleBuilder(new PricingRulesEngine())
        .id(`low-thc-${safeThreshold}`)
        .name(`Low THC Discount (<${safeThreshold}%)`)
        .type("thc")
        .priority(2)
        .condition("product.category", "equals", "Flower")
        .condition("product.thcPercentage", "less_than", safeThreshold)
        .percentageDiscount(safeDiscount)
        .build()
    } catch {
      return new RuleBuilder(new PricingRulesEngine())
        .id("low-thc-default")
        .name("Default Low THC Discount")
        .type("thc")
        .priority(2)
        .condition("product.category", "equals", "Flower")
        .condition("product.thcPercentage", "less_than", 15)
        .percentageDiscount(10)
        .build()
    }
  },

  customerTierDiscount: (tier: string, discountPercentage: number) => {
    try {
      const safeTier = typeof tier === "string" && tier.trim() ? tier.trim() : "A"
      const safeDiscount =
        typeof discountPercentage === "number" && discountPercentage > 0 && discountPercentage <= 100
          ? discountPercentage
          : 8

      return new RuleBuilder(new PricingRulesEngine())
        .id(`customer-tier-${safeTier.toLowerCase()}`)
        .name(`${safeTier} Customer Discount`)
        .type("customer")
        .priority(2)
        .condition("context.customerTier", "equals", safeTier)
        .percentageDiscount(safeDiscount)
        .build()
    } catch {
      return new RuleBuilder(new PricingRulesEngine())
        .id("customer-tier-default")
        .name("Default Customer Discount")
        .type("customer")
        .priority(2)
        .condition("context.customerTier", "equals", "A")
        .percentageDiscount(8)
        .build()
    }
  },
}
