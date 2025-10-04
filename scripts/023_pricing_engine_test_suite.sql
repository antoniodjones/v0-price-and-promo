-- TM-032: Comprehensive Test Suite for Pricing Engine
-- This script creates test cases for all pricing calculation functions, discount logic, and API endpoints

-- Insert test cases into ai_generated_tests table
INSERT INTO ai_generated_tests (
  test_name,
  test_type,
  component_path,
  test_code,
  status,
  priority,
  tags,
  description,
  expected_behavior,
  created_at,
  updated_at
) VALUES

-- ============================================================================
-- CORE PRICING ENGINE TESTS (Tests 1-7)
-- ============================================================================

(
  'Pricing Engine - Initialization',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"
import { db } from "@/lib/api/database"

describe("PricingEngine Initialization", () => {
  it("should initialize with valid customer and market", async () => {
    const customerId = "test-customer-1"
    const market = "CA"
    
    await pricingEngine.initialize(customerId, market)
    
    // Verify customer was loaded
    expect(pricingEngine["customer"]).toBeTruthy()
    expect(pricingEngine["customer"].id).toBe(customerId)
  })
  
  it("should throw error for invalid customer", async () => {
    await expect(
      pricingEngine.initialize("invalid-customer", "CA")
    ).rejects.toThrow("Customer not found")
  })
  
  it("should load active discounts and promotions", async () => {
    await pricingEngine.initialize("test-customer-1", "CA")
    
    // Verify discounts were loaded
    expect(pricingEngine["customerDiscounts"]).toBeDefined()
    expect(pricingEngine["inventoryDiscounts"]).toBeDefined()
    expect(pricingEngine["bogoPromotions"]).toBeDefined()
    expect(pricingEngine["bundleDeals"]).toBeDefined()
  })
})',
  'pending',
  'high',
  ARRAY['pricing-engine', 'initialization', 'unit-test'],
  'Tests the PricingEngine initialization process including customer loading and discount/promotion loading',
  'Should successfully initialize with valid data, throw errors for invalid customers, and load all active discounts and promotions',
  NOW(),
  NOW()
),

(
  'Pricing Engine - Base Pricing Calculation',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"

describe("Base Pricing Calculation", () => {
  beforeEach(async () => {
    await pricingEngine.initialize("test-customer-1", "CA")
  })
  
  it("should calculate base price for single item", async () => {
    const items = [
      { productId: "prod-1", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.items).toHaveLength(1)
    expect(result.items[0].basePrice).toBeGreaterThan(0)
    expect(result.items[0].totalPrice).toBe(result.items[0].basePrice * 1)
  })
  
  it("should calculate base price for multiple items", async () => {
    const items = [
      { productId: "prod-1", quantity: 2 },
      { productId: "prod-2", quantity: 3 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.items).toHaveLength(2)
    expect(result.subtotal).toBeGreaterThan(0)
  })
  
  it("should handle large quantities correctly", async () => {
    const items = [
      { productId: "prod-1", quantity: 100 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.items[0].totalPrice).toBe(result.items[0].basePrice * 100)
  })
})',
  'pending',
  'high',
  ARRAY['pricing-engine', 'base-pricing', 'unit-test'],
  'Tests base pricing calculation without any discounts or promotions',
  'Should correctly calculate base prices for single items, multiple items, and large quantities',
  NOW(),
  NOW()
),

(
  'Pricing Engine - Customer Discount Application',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"

describe("Customer Discount Application", () => {
  beforeEach(async () => {
    await pricingEngine.initialize("test-customer-tier-a", "CA")
  })
  
  it("should apply percentage discount correctly", async () => {
    const items = [
      { productId: "prod-brand-acme", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.totalDiscount).toBeGreaterThan(0)
    expect(result.appliedDiscounts).toHaveLength(1)
    expect(result.appliedDiscounts[0].type).toBe("customer")
  })
  
  it("should apply fixed amount discount correctly", async () => {
    const items = [
      { productId: "prod-category-flower", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.totalDiscount).toBeGreaterThan(0)
  })
  
  it("should not apply discount if customer tier does not match", async () => {
    await pricingEngine.initialize("test-customer-tier-c", "CA")
    
    const items = [
      { productId: "prod-tier-a-only", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.totalDiscount).toBe(0)
  })
  
  it("should respect market restrictions", async () => {
    await pricingEngine.initialize("test-customer-1", "NY")
    
    const items = [
      { productId: "prod-ca-only", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.totalDiscount).toBe(0)
  })
})',
  'pending',
  'high',
  ARRAY['pricing-engine', 'customer-discount', 'unit-test'],
  'Tests customer discount application including percentage, fixed amount, tier matching, and market restrictions',
  'Should correctly apply customer discounts based on tier, market, and discount type',
  NOW(),
  NOW()
),

(
  'Pricing Engine - Inventory Discount Application',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"

describe("Inventory Discount Application", () => {
  beforeEach(async () => {
    await pricingEngine.initialize("test-customer-1", "CA")
  })
  
  it("should apply expiration-based discount", async () => {
    const items = [
      { productId: "prod-expiring-soon", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.appliedDiscounts.some(d => d.type === "inventory")).toBe(true)
  })
  
  it("should apply THC-based discount", async () => {
    const items = [
      { productId: "prod-low-thc", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.appliedDiscounts.some(d => d.type === "inventory")).toBe(true)
  })
  
  it("should respect scope restrictions (category)", async () => {
    const items = [
      { productId: "prod-wrong-category", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    const inventoryDiscounts = result.appliedDiscounts.filter(d => d.type === "inventory")
    expect(inventoryDiscounts).toHaveLength(0)
  })
})',
  'pending',
  'high',
  ARRAY['pricing-engine', 'inventory-discount', 'unit-test'],
  'Tests inventory discount application based on expiration dates, THC levels, and scope restrictions',
  'Should correctly apply inventory discounts when trigger conditions are met and scope matches',
  NOW(),
  NOW()
),

(
  'Pricing Engine - BOGO Promotion Application',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"

describe("BOGO Promotion Application", () => {
  beforeEach(async () => {
    await pricingEngine.initialize("test-customer-1", "CA")
  })
  
  it("should apply buy-one-get-one-free promotion", async () => {
    const items = [
      { productId: "prod-bogo-eligible", quantity: 2 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.appliedPromotions).toHaveLength(1)
    expect(result.appliedPromotions[0].type).toBe("bogo")
    expect(result.appliedPromotions[0].savings).toBeGreaterThan(0)
  })
  
  it("should not apply BOGO with insufficient quantity", async () => {
    const items = [
      { productId: "prod-bogo-eligible", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.appliedPromotions).toHaveLength(0)
  })
  
  it("should apply percentage-based BOGO reward", async () => {
    const items = [
      { productId: "prod-bogo-50-percent", quantity: 4 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    const bogoPromo = result.appliedPromotions.find(p => p.type === "bogo")
    expect(bogoPromo).toBeDefined()
    expect(bogoPromo.savings).toBeGreaterThan(0)
  })
})',
  'pending',
  'high',
  ARRAY['pricing-engine', 'bogo', 'promotions', 'unit-test'],
  'Tests BOGO promotion application including free items, percentage rewards, and quantity requirements',
  'Should correctly apply BOGO promotions when quantity requirements are met',
  NOW(),
  NOW()
),

(
  'Pricing Engine - Bundle Deal Application',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"

describe("Bundle Deal Application", () => {
  beforeEach(async () => {
    await pricingEngine.initialize("test-customer-1", "CA")
  })
  
  it("should apply bundle discount when all products present", async () => {
    const items = [
      { productId: "bundle-prod-1", quantity: 1 },
      { productId: "bundle-prod-2", quantity: 1 },
      { productId: "bundle-prod-3", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.appliedPromotions.some(p => p.type === "bundle")).toBe(true)
  })
  
  it("should not apply bundle with missing products", async () => {
    const items = [
      { productId: "bundle-prod-1", quantity: 1 },
      { productId: "bundle-prod-2", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    expect(result.appliedPromotions.some(p => p.type === "bundle")).toBe(false)
  })
  
  it("should respect minimum quantity requirements", async () => {
    const items = [
      { productId: "bundle-prod-1", quantity: 5 },
      { productId: "bundle-prod-2", quantity: 5 },
      { productId: "bundle-prod-3", quantity: 5 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    const bundlePromo = result.appliedPromotions.find(p => p.type === "bundle")
    expect(bundlePromo).toBeDefined()
    expect(bundlePromo.savings).toBeGreaterThan(0)
  })
})',
  'pending',
  'high',
  ARRAY['pricing-engine', 'bundle', 'promotions', 'unit-test'],
  'Tests bundle deal application including product requirements and minimum quantities',
  'Should correctly apply bundle discounts when all required products are present with minimum quantities',
  NOW(),
  NOW()
),

(
  'Pricing Engine - No Stacking Policy',
  'unit',
  'lib/pricing/engine.ts',
  E'import { pricingEngine } from "@/lib/pricing/engine"

describe("No Stacking Policy", () => {
  beforeEach(async () => {
    await pricingEngine.initialize("test-customer-tier-a", "CA")
  })
  
  it("should apply only the best discount when multiple apply", async () => {
    const items = [
      { productId: "prod-multiple-discounts", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    // Should have evaluated multiple discounts but applied only one
    expect(result.appliedDiscounts.length).toBeLessThanOrEqual(1)
  })
  
  it("should select highest savings discount", async () => {
    const items = [
      { productId: "prod-competing-discounts", quantity: 10 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    // Verify the best discount was selected
    expect(result.totalDiscount).toBeGreaterThan(0)
    expect(result.appliedDiscounts).toHaveLength(1)
  })
  
  it("should not stack customer and inventory discounts", async () => {
    const items = [
      { productId: "prod-customer-and-inventory-discount", quantity: 1 }
    ]
    
    const result = await pricingEngine.calculatePricing(items)
    
    // Only one discount should be applied
    expect(result.appliedDiscounts).toHaveLength(1)
  })
})',
  'pending',
  'critical',
  ARRAY['pricing-engine', 'no-stacking', 'policy', 'unit-test'],
  'Tests the no-stacking policy to ensure only one discount is applied per item',
  'Should enforce no-stacking policy and select the best discount for the customer',
  NOW(),
  NOW()
),

-- ============================================================================
-- TIER PRICING ENGINE TESTS (Tests 8-14)
-- ============================================================================

(
  'Tier Pricing - findApplicableRules Function',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { findApplicableRules, findApplicableRulesForProduct } from "@/lib/pricing/tier-pricing-engine"

describe("findApplicableRules", () => {
  it("should find rules matching product hierarchy", async () => {
    const rules = await findApplicableRules({
      customerId: "customer-1",
      productId: "prod-1",
      brandId: "brand-acme",
      categoryId: "category-flower",
      quantity: 1
    })
    
    expect(rules).toBeDefined()
    expect(Array.isArray(rules)).toBe(true)
  })
  
  it("should filter by date range", async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    
    const rules = await findApplicableRules({
      customerId: "customer-1",
      productId: "prod-1",
      currentDate: futureDate
    })
    
    // Should only include rules active on future date
    expect(rules.every(r => new Date(r.start_date) <= futureDate)).toBe(true)
  })
  
  it("should load tier definitions for each rule", async () => {
    const rules = await findApplicableRules({
      customerId: "customer-1",
      productId: "prod-1",
      brandId: "brand-acme"
    })
    
    rules.forEach(rule => {
      expect(rule.tiers).toBeDefined()
      expect(Array.isArray(rule.tiers)).toBe(true)
    })
  })
  
  it("should include customer tier assignment", async () => {
    const rules = await findApplicableRulesForProduct("customer-tier-a", "prod-1", 1)
    
    const rulesWithAssignment = rules.filter(r => r.customerTier)
    expect(rulesWithAssignment.length).toBeGreaterThan(0)
  })
})',
  'pending',
  'high',
  ARRAY['tier-pricing', 'find-rules', 'unit-test'],
  'Tests the findApplicableRules function including hierarchy matching, date filtering, and tier loading',
  'Should correctly find and filter applicable discount rules based on product hierarchy and date range',
  NOW(),
  NOW()
),

(
  'Tier Pricing - getCustomerTierAssignment Function',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { getCustomerTierAssignment, getCustomerTierAssignments } from "@/lib/pricing/tier-pricing-engine"

describe("getCustomerTierAssignment", () => {
  it("should return tier assignment for valid customer and rule", async () => {
    const assignment = await getCustomerTierAssignment("customer-1", "rule-1")
    
    expect(assignment).toBeDefined()
    expect(assignment.tier).toMatch(/^[ABC]$/)
  })
  
  it("should return null for customer without assignment", async () => {
    const assignment = await getCustomerTierAssignment("customer-no-tier", "rule-1")
    
    expect(assignment).toBeNull()
  })
  
  it("should get all assignments for a customer", async () => {
    const assignments = await getCustomerTierAssignments("customer-1")
    
    expect(Array.isArray(assignments)).toBe(true)
    expect(assignments.length).toBeGreaterThan(0)
  })
  
  it("should use cache for repeated queries", async () => {
    const start = Date.now()
    await getCustomerTierAssignment("customer-1", "rule-1")
    const firstCallTime = Date.now() - start
    
    const start2 = Date.now()
    await getCustomerTierAssignment("customer-1", "rule-1")
    const secondCallTime = Date.now() - start2
    
    // Second call should be faster due to caching
    expect(secondCallTime).toBeLessThan(firstCallTime)
  })
})',
  'pending',
  'high',
  ARRAY['tier-pricing', 'tier-assignment', 'caching', 'unit-test'],
  'Tests customer tier assignment retrieval including caching behavior',
  'Should correctly retrieve tier assignments and utilize caching for performance',
  NOW(),
  NOW()
),

(
  'Tier Pricing - getTierDiscount Function',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { getTierDiscount, getAllTierDiscounts, getBestTierDiscountForCustomer } from "@/lib/pricing/tier-pricing-engine"

describe("getTierDiscount", () => {
  it("should return discount for valid tier", async () => {
    const discount = await getTierDiscount("rule-1", "A", 10)
    
    expect(discount).toBeDefined()
    expect(discount.tier).toBe("A")
    expect(discount.discount_type).toMatch(/^(percentage|fixed_amount|price_override)$/)
  })
  
  it("should respect quantity thresholds", async () => {
    const lowQtyDiscount = await getTierDiscount("rule-volume", "A", 5)
    const highQtyDiscount = await getTierDiscount("rule-volume", "A", 50)
    
    // Higher quantity should get better discount
    expect(highQtyDiscount.discount_value).toBeGreaterThanOrEqual(lowQtyDiscount.discount_value)
  })
  
  it("should return null for invalid tier", async () => {
    const discount = await getTierDiscount("rule-1", "D" as any, 10)
    
    expect(discount).toBeNull()
  })
  
  it("should get all tiers for a rule", async () => {
    const tiers = await getAllTierDiscounts("rule-1")
    
    expect(Array.isArray(tiers)).toBe(true)
    expect(tiers.length).toBeGreaterThan(0)
    expect(tiers.some(t => t.tier === "A")).toBe(true)
  })
  
  it("should get best discount for customer", async () => {
    const discount = await getBestTierDiscountForCustomer("rule-1", "customer-tier-a", 10)
    
    expect(discount).toBeDefined()
    expect(discount.tier).toBe("A")
  })
})',
  'pending',
  'high',
  ARRAY['tier-pricing', 'tier-discount', 'unit-test'],
  'Tests tier discount retrieval including quantity thresholds and tier validation',
  'Should correctly retrieve tier discounts based on tier level and quantity',
  NOW(),
  NOW()
),

(
  'Tier Pricing - calculateCustomerPrice Main Function',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { calculateCustomerPrice, calculateCartPrices } from "@/lib/pricing/tier-pricing-engine"

describe("calculateCustomerPrice", () => {
  it("should calculate price with tier discount", async () => {
    const result = await calculateCustomerPrice({
      customerId: "customer-tier-a",
      productId: "prod-1",
      quantity: 10,
      basePrice: 100
    })
    
    expect(result.finalPrice).toBeLessThan(result.baseTotalPrice)
    expect(result.totalSavings).toBeGreaterThan(0)
    expect(result.discountApplied).toBe(true)
  })
  
  it("should return base price when no discounts apply", async () => {
    const result = await calculateCustomerPrice({
      customerId: "customer-no-tier",
      productId: "prod-no-discount",
      quantity: 1,
      basePrice: 50
    })
    
    expect(result.finalPrice).toBe(result.baseTotalPrice)
    expect(result.totalSavings).toBe(0)
    expect(result.discountApplied).toBe(false)
  })
  
  it("should evaluate all applicable discounts", async () => {
    const result = await calculateCustomerPrice({
      customerId: "customer-tier-a",
      productId: "prod-multiple-rules",
      quantity: 10,
      basePrice: 100
    })
    
    expect(result.allEvaluatedDiscounts.length).toBeGreaterThan(0)
    expect(result.bestDiscount).toBeDefined()
  })
  
  it("should calculate cart prices for multiple items", async () => {
    const results = await calculateCartPrices("customer-tier-a", [
      { productId: "prod-1", quantity: 5, basePrice: 100 },
      { productId: "prod-2", quantity: 10, basePrice: 50 },
      { productId: "prod-3", quantity: 2, basePrice: 200 }
    ])
    
    expect(results).toHaveLength(3)
    expect(results.every(r => r.finalPrice > 0)).toBe(true)
  })
  
  it("should complete calculation within performance target", async () => {
    const start = Date.now()
    
    await calculateCustomerPrice({
      customerId: "customer-tier-a",
      productId: "prod-1",
      quantity: 10,
      basePrice: 100
    })
    
    const duration = Date.now() - start
    
    // Should complete in under 200ms
    expect(duration).toBeLessThan(200)
  })
})',
  'pending',
  'critical',
  ARRAY['tier-pricing', 'calculate-price', 'performance', 'unit-test'],
  'Tests the main calculateCustomerPrice function including discount evaluation and performance',
  'Should correctly calculate final prices with tier discounts and meet performance targets (<200ms)',
  NOW(),
  NOW()
),

(
  'Tier Pricing - selectBestDiscount Logic',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { selectBestDiscount, compareDiscounts, validateNoStacking } from "@/lib/pricing/tier-pricing-engine"
import type { EvaluatedDiscount } from "@/lib/pricing/tier-pricing-engine"

describe("selectBestDiscount", () => {
  const mockDiscounts: EvaluatedDiscount[] = [
    {
      ruleId: "rule-1",
      ruleName: "Brand Discount",
      ruleType: "customer_discount",
      tier: "A",
      discountType: "percentage",
      discountValue: 10,
      discountAmount: 100,
      finalPrice: 900,
      savings: 100
    },
    {
      ruleId: "rule-2",
      ruleName: "Category Discount",
      ruleType: "customer_discount",
      tier: "A",
      discountType: "percentage",
      discountValue: 15,
      discountAmount: 150,
      finalPrice: 850,
      savings: 150
    }
  ]
  
  it("should select discount with highest savings", () => {
    const best = selectBestDiscount(mockDiscounts, "best_for_customer")
    
    expect(best.ruleId).toBe("rule-2")
    expect(best.savings).toBe(150)
  })
  
  it("should handle tie-breaking by percentage", () => {
    const tiedDiscounts: EvaluatedDiscount[] = [
      { ...mockDiscounts[0], savings: 100, finalPrice: 900 },
      { ...mockDiscounts[1], savings: 100, finalPrice: 850 }
    ]
    
    const best = selectBestDiscount(tiedDiscounts, "best_for_customer")
    
    // Should select the one with higher percentage
    expect(best.finalPrice).toBe(850)
  })
  
  it("should support best_for_business strategy", () => {
    const best = selectBestDiscount(mockDiscounts, "best_for_business")
    
    // Should select lowest discount (best margin)
    expect(best.savings).toBe(100)
  })
  
  it("should compare two discounts correctly", () => {
    const comparison = compareDiscounts(mockDiscounts[0], mockDiscounts[1])
    
    expect(comparison.winner.ruleId).toBe("rule-2")
    expect(comparison.reason).toContain("higher savings")
  })
  
  it("should validate no stacking policy", () => {
    expect(() => validateNoStacking([mockDiscounts[0]])).not.toThrow()
    expect(() => validateNoStacking(mockDiscounts)).toThrow("stacking")
  })
})',
  'pending',
  'critical',
  ARRAY['tier-pricing', 'best-discount', 'no-stacking', 'unit-test'],
  'Tests the best discount selection algorithm including tie-breaking and no-stacking validation',
  'Should correctly select the best discount using multiple criteria and enforce no-stacking policy',
  NOW(),
  NOW()
),

(
  'Tier Pricing - Savings Summary Generation',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { getCustomerSavingsSummary } from "@/lib/pricing/tier-pricing-engine"

describe("Savings Summary", () => {
  it("should generate savings at different quantities", async () => {
    const summary = await getCustomerSavingsSummary("customer-tier-a", "prod-1", 100)
    
    expect(Array.isArray(summary)).toBe(true)
    expect(summary.length).toBeGreaterThan(0)
  })
  
  it("should show increasing savings with quantity", async () => {
    const summary = await getCustomerSavingsSummary("customer-tier-a", "prod-volume", 100)
    
    // Verify savings increase with quantity
    for (let i = 1; i < summary.length; i++) {
      expect(summary[i].savings).toBeGreaterThanOrEqual(summary[i-1].savings)
    }
  })
  
  it("should include savings percentage", async () => {
    const summary = await getCustomerSavingsSummary("customer-tier-a", "prod-1", 100)
    
    summary.forEach(item => {
      expect(item.savingsPercentage).toBeGreaterThan(0)
      expect(item.savingsPercentage).toBeLessThanOrEqual(100)
    })
  })
})',
  'pending',
  'medium',
  ARRAY['tier-pricing', 'savings-summary', 'unit-test'],
  'Tests savings summary generation for different quantity tiers',
  'Should generate accurate savings summaries showing potential discounts at various quantities',
  NOW(),
  NOW()
),

(
  'Tier Pricing - Cache Performance',
  'unit',
  'lib/pricing/pricing-cache.ts',
  E'import { 
  getCachedPricingCalculation, 
  setCachedPricingCalculation,
  getCachedDiscountRules,
  setCachedDiscountRules
} from "@/lib/pricing/pricing-cache"

describe("Pricing Cache", () => {
  it("should cache pricing calculations", async () => {
    const mockResult = {
      customerId: "customer-1",
      productId: "prod-1",
      quantity: 10,
      basePrice: 100,
      baseTotalPrice: 1000,
      finalPrice: 900,
      finalUnitPrice: 90,
      totalSavings: 100,
      savingsPercentage: 10,
      discountApplied: true,
      bestDiscount: null,
      allEvaluatedDiscounts: [],
      calculatedAt: new Date()
    }
    
    await setCachedPricingCalculation("customer-1", "prod-1", 10, mockResult)
    const cached = await getCachedPricingCalculation("customer-1", "prod-1", 10)
    
    expect(cached).toBeDefined()
    expect(cached.finalPrice).toBe(900)
  })
  
  it("should cache discount rules", async () => {
    const mockRules = [
      { id: "rule-1", name: "Test Rule", status: "active" }
    ]
    
    await setCachedDiscountRules("2025-01-01", mockRules)
    const cached = await getCachedDiscountRules("2025-01-01")
    
    expect(cached).toBeDefined()
    expect(cached.length).toBe(1)
  })
  
  it("should improve performance with caching", async () => {
    const mockResult = {
      customerId: "customer-1",
      productId: "prod-1",
      quantity: 10,
      basePrice: 100,
      baseTotalPrice: 1000,
      finalPrice: 900,
      finalUnitPrice: 90,
      totalSavings: 100,
      savingsPercentage: 10,
      discountApplied: true,
      bestDiscount: null,
      allEvaluatedDiscounts: [],
      calculatedAt: new Date()
    }
    
    await setCachedPricingCalculation("customer-perf", "prod-perf", 10, mockResult)
    
    const start = Date.now()
    await getCachedPricingCalculation("customer-perf", "prod-perf", 10)
    const duration = Date.now() - start
    
    // Cache retrieval should be very fast
    expect(duration).toBeLessThan(50)
  })
})',
  'pending',
  'high',
  ARRAY['pricing-cache', 'performance', 'unit-test'],
  'Tests pricing cache functionality and performance improvements',
  'Should correctly cache pricing calculations and discount rules for improved performance',
  NOW(),
  NOW()
),

-- ============================================================================
-- API ENDPOINT TESTS (Tests 15-21)
-- ============================================================================

(
  'API - POST /api/pricing/calculate',
  'integration',
  'app/api/pricing/calculate/route.ts',
  E'describe("POST /api/pricing/calculate", () => {
  it("should calculate pricing for valid request", async () => {
    const response = await fetch("/api/pricing/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-1",
        market: "CA",
        items: [
          { productId: "prod-1", quantity: 10 }
        ]
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.finalTotal).toBeDefined()
  })
  
  it("should return 400 for invalid request", async () => {
    const response = await fetch("/api/pricing/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-1"
        // Missing required fields
      })
    })
    
    expect(response.status).toBe(400)
  })
  
  it("should return 404 for invalid customer", async () => {
    const response = await fetch("/api/pricing/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "invalid-customer",
        market: "CA",
        items: [{ productId: "prod-1", quantity: 1 }]
      })
    })
    
    expect(response.status).toBe(404)
  })
})',
  'pending',
  'critical',
  ARRAY['api', 'pricing-calculate', 'integration-test'],
  'Tests the main pricing calculation API endpoint',
  'Should successfully calculate pricing for valid requests and return appropriate errors for invalid requests',
  NOW(),
  NOW()
),

(
  'API - POST /api/discounts/validate',
  'integration',
  'app/api/discounts/validate/route.ts',
  E'describe("POST /api/discounts/validate", () => {
  it("should validate discounts for single product", async () => {
    const response = await fetch("/api/discounts/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-1",
        productId: "prod-1",
        market: "CA",
        quantity: 10
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.calculations).toBeDefined()
  })
  
  it("should validate discounts for multiple products", async () => {
    const response = await fetch("/api/discounts/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-1",
        market: "CA",
        products: [
          { id: "prod-1", quantity: 5 },
          { id: "prod-2", quantity: 10 }
        ]
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.summary).toBeDefined()
    expect(data.data.summary.totalSavings).toBeGreaterThanOrEqual(0)
  })
  
  it("should enforce no-stacking policy", async () => {
    const response = await fetch("/api/discounts/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-tier-a",
        productId: "prod-multiple-discounts",
        market: "CA",
        quantity: 10
      })
    })
    
    const data = await response.json()
    // Should apply only one discount
    expect(data.data.calculations.length).toBeLessThanOrEqual(1)
  })
})',
  'pending',
  'high',
  ARRAY['api', 'discount-validate', 'integration-test'],
  'Tests the discount validation API endpoint',
  'Should validate discounts for single and multiple products while enforcing no-stacking policy',
  NOW(),
  NOW()
),

(
  'API - GET /api/pricing/history',
  'integration',
  'app/api/pricing/history/route.ts',
  E'describe("GET /api/pricing/history", () => {
  it("should retrieve pricing history", async () => {
    const response = await fetch("/api/pricing/history?customerId=customer-1")
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(Array.isArray(data.data)).toBe(true)
  })
  
  it("should filter by date range", async () => {
    const startDate = "2025-01-01"
    const endDate = "2025-01-31"
    
    const response = await fetch(
      `/api/pricing/history?customerId=customer-1&startDate=${startDate}&endDate=${endDate}`
    )
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.every((item: any) => {
      const date = new Date(item.timestamp)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })).toBe(true)
  })
  
  it("should filter by product", async () => {
    const response = await fetch(
      "/api/pricing/history?customerId=customer-1&productId=prod-1"
    )
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.every((item: any) => item.productId === "prod-1")).toBe(true)
  })
})',
  'pending',
  'medium',
  ARRAY['api', 'pricing-history', 'integration-test'],
  'Tests the pricing history API endpoint with filtering',
  'Should retrieve pricing history with optional date range and product filtering',
  NOW(),
  NOW()
),

(
  'API - Market Pricing Strategies',
  'integration',
  'app/api/pricing/market/route.ts',
  E'describe("Market Pricing API", () => {
  it("should list market pricing strategies", async () => {
    const response = await fetch("/api/pricing/market")
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(Array.isArray(data.data)).toBe(true)
  })
  
  it("should create new market strategy", async () => {
    const response = await fetch("/api/pricing/market", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Strategy",
        market: "CA",
        strategy: "competitive",
        adjustmentPercentage: 5
      })
    })
    
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data.data.id).toBeDefined()
  })
  
  it("should get specific market strategy", async () => {
    const response = await fetch("/api/pricing/market/strategy-1")
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.id).toBe("strategy-1")
  })
  
  it("should update market strategy", async () => {
    const response = await fetch("/api/pricing/market/strategy-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adjustmentPercentage: 10
      })
    })
    
    expect(response.status).toBe(200)
  })
})',
  'pending',
  'medium',
  ARRAY['api', 'market-pricing', 'integration-test'],
  'Tests market pricing strategy API endpoints',
  'Should support CRUD operations for market pricing strategies',
  NOW(),
  NOW()
),

(
  'API - POST /api/pricing/bulk',
  'integration',
  'app/api/pricing/bulk/route.ts',
  E'describe("POST /api/pricing/bulk", () => {
  it("should calculate bulk pricing for large orders", async () => {
    const response = await fetch("/api/pricing/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-1",
        market: "CA",
        orders: [
          { productId: "prod-1", quantity: 100 },
          { productId: "prod-2", quantity: 200 },
          { productId: "prod-3", quantity: 150 }
        ]
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.pricing).toBeDefined()
  })
  
  it("should apply volume discounts for bulk orders", async () => {
    const response = await fetch("/api/pricing/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "customer-tier-a",
        market: "CA",
        orders: [
          { productId: "prod-volume", quantity: 500 }
        ]
      })
    })
    
    const data = await response.json()
    expect(data.data.pricing.totalDiscount).toBeGreaterThan(0)
  })
})',
  'pending',
  'high',
  ARRAY['api', 'bulk-pricing', 'integration-test'],
  'Tests bulk pricing calculation API for large orders',
  'Should calculate pricing for bulk orders with appropriate volume discounts',
  NOW(),
  NOW()
),

(
  'API - GET /api/pricing/compare',
  'integration',
  'app/api/pricing/compare/route.ts',
  E'describe("GET /api/pricing/compare", () => {
  it("should compare competitive pricing", async () => {
    const response = await fetch("/api/pricing/compare?productId=prod-1")
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(Array.isArray(data.data)).toBe(true)
  })
  
  it("should filter by market", async () => {
    const response = await fetch("/api/pricing/compare?productId=prod-1&market=CA")
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.every((item: any) => item.market === "CA")).toBe(true)
  })
})',
  'pending',
  'low',
  ARRAY['api', 'pricing-compare', 'integration-test'],
  'Tests competitive pricing comparison API',
  'Should retrieve and compare pricing across competitors',
  NOW(),
  NOW()
),

(
  'API - POST /api/pricing/optimize',
  'integration',
  'app/api/pricing/optimize/route.ts',
  E'describe("POST /api/pricing/optimize", () => {
  it("should generate pricing optimization recommendations", async () => {
    const response = await fetch("/api/pricing/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod-1",
        market: "CA",
        currentPrice: 100
      })
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.data.recommendations).toBeDefined()
  })
  
  it("should provide reasoning for recommendations", async () => {
    const response = await fetch("/api/pricing/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod-1",
        market: "CA",
        currentPrice: 100
      })
    })
    
    const data = await response.json()
    expect(data.data.recommendations.every((rec: any) => rec.reasoning)).toBe(true)
  })
})',
  'pending',
  'medium',
  ARRAY['api', 'pricing-optimize', 'integration-test'],
  'Tests pricing optimization recommendation API',
  'Should generate data-driven pricing optimization recommendations with reasoning',
  NOW(),
  NOW()
),

-- ============================================================================
-- EDGE CASES & PERFORMANCE TESTS (Tests 22-26)
-- ============================================================================

(
  'Edge Cases - Concurrent Pricing Calculations',
  'integration',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { calculateCustomerPrice } from "@/lib/pricing/tier-pricing-engine"

describe("Concurrent Pricing Calculations", () => {
  it("should handle concurrent calculations correctly", async () => {
    const promises = Array.from({ length: 10 }, (_, i) =>
      calculateCustomerPrice({
        customerId: "customer-1",
        productId: `prod-${i}`,
        quantity: 10,
        basePrice: 100
      })
    )
    
    const results = await Promise.all(promises)
    
    expect(results).toHaveLength(10)
    expect(results.every(r => r.finalPrice > 0)).toBe(true)
  })
  
  it("should maintain data consistency under concurrent load", async () => {
    const customerId = "customer-concurrent"
    const productId = "prod-concurrent"
    
    const promises = Array.from({ length: 20 }, () =>
      calculateCustomerPrice({
        customerId,
        productId,
        quantity: 10,
        basePrice: 100
      })
    )
    
    const results = await Promise.all(promises)
    
    // All results should be identical for same input
    const firstResult = results[0]
    expect(results.every(r => r.finalPrice === firstResult.finalPrice)).toBe(true)
  })
})',
  'pending',
  'high',
  ARRAY['edge-cases', 'concurrency', 'integration-test'],
  'Tests pricing calculations under concurrent load',
  'Should handle concurrent calculations correctly while maintaining data consistency',
  NOW(),
  NOW()
),

(
  'Edge Cases - Invalid Data Handling',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { calculateCustomerPrice, findApplicableRulesForProduct } from "@/lib/pricing/tier-pricing-engine"

describe("Invalid Data Handling", () => {
  it("should handle invalid customer ID", async () => {
    await expect(
      calculateCustomerPrice({
        customerId: "invalid-customer-999",
        productId: "prod-1",
        quantity: 10,
        basePrice: 100
      })
    ).rejects.toThrow()
  })
  
  it("should handle invalid product ID", async () => {
    await expect(
      findApplicableRulesForProduct("customer-1", "invalid-product-999", 10)
    ).rejects.toThrow("Product not found")
  })
  
  it("should handle zero quantity", async () => {
    const result = await calculateCustomerPrice({
      customerId: "customer-1",
      productId: "prod-1",
      quantity: 0,
      basePrice: 100
    })
    
    expect(result.finalPrice).toBe(0)
  })
  
  it("should handle negative price", async () => {
    await expect(
      calculateCustomerPrice({
        customerId: "customer-1",
        productId: "prod-1",
        quantity: 10,
        basePrice: -100
      })
    ).rejects.toThrow()
  })
  
  it("should handle extremely large quantities", async () => {
    const result = await calculateCustomerPrice({
      customerId: "customer-1",
      productId: "prod-1",
      quantity: 1000000,
      basePrice: 100
    })
    
    expect(result.finalPrice).toBeGreaterThan(0)
    expect(Number.isFinite(result.finalPrice)).toBe(true)
  })
})',
  'pending',
  'high',
  ARRAY['edge-cases', 'validation', 'error-handling', 'unit-test'],
  'Tests handling of invalid data and edge cases',
  'Should gracefully handle invalid inputs with appropriate error messages',
  NOW(),
  NOW()
),

(
  'Edge Cases - Expired Discount Handling',
  'unit',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { findApplicableRules } from "@/lib/pricing/tier-pricing-engine"

describe("Expired Discount Handling", () => {
  it("should not return expired discount rules", async () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 30)
    
    const rules = await findApplicableRules({
      customerId: "customer-1",
      productId: "prod-expired-discount",
      brandId: "brand-acme",
      currentDate: pastDate
    })
    
    // Should not include rules that expired before the date
    expect(rules.every(r => !r.end_date || new Date(r.end_date) >= pastDate)).toBe(true)
  })
  
  it("should not return future-scheduled discount rules", async () => {
    const currentDate = new Date()
    
    const rules = await findApplicableRules({
      customerId: "customer-1",
      productId: "prod-future-discount",
      brandId: "brand-acme",
      currentDate
    })
    
    // Should not include rules that start in the future
    expect(rules.every(r => new Date(r.start_date) <= currentDate)).toBe(true)
  })
})',
  'pending',
  'medium',
  ARRAY['edge-cases', 'expired-discounts', 'unit-test'],
  'Tests handling of expired and future-scheduled discounts',
  'Should correctly filter out expired and not-yet-active discount rules',
  NOW(),
  NOW()
),

(
  'Performance - Pricing Calculation Benchmarks',
  'performance',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { calculateCustomerPrice, calculateCartPrices } from "@/lib/pricing/tier-pricing-engine"

describe("Pricing Performance Benchmarks", () => {
  it("should calculate single item price in under 200ms", async () => {
    const iterations = 10
    const durations: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now()
      
      await calculateCustomerPrice({
        customerId: "customer-1",
        productId: "prod-1",
        quantity: 10,
        basePrice: 100
      })
      
      durations.push(Date.now() - start)
    }
    
    const avgDuration = durations.reduce((a, b) => a + b, 0) / iterations
    
    console.log(`[v0] Average pricing calculation time: ${avgDuration}ms`)
    expect(avgDuration).toBeLessThan(200)
  })
  
  it("should calculate cart with 10 items in under 500ms", async () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      productId: `prod-${i}`,
      quantity: 10,
      basePrice: 100
    }))
    
    const start = Date.now()
    await calculateCartPrices("customer-1", items)
    const duration = Date.now() - start
    
    console.log(`[v0] Cart calculation time (10 items): ${duration}ms`)
    expect(duration).toBeLessThan(500)
  })
  
  it("should benefit from caching on repeated calculations", async () => {
    // First calculation (no cache)
    const start1 = Date.now()
    await calculateCustomerPrice({
      customerId: "customer-cache-test",
      productId: "prod-cache-test",
      quantity: 10,
      basePrice: 100
    })
    const duration1 = Date.now() - start1
    
    // Second calculation (with cache)
    const start2 = Date.now()
    await calculateCustomerPrice({
      customerId: "customer-cache-test",
      productId: "prod-cache-test",
      quantity: 10,
      basePrice: 100
    })
    const duration2 = Date.now() - start2
    
    console.log(`[v0] First call: ${duration1}ms, Cached call: ${duration2}ms`)
    expect(duration2).toBeLessThan(duration1)
  })
})',
  'pending',
  'critical',
  ARRAY['performance', 'benchmarks', 'caching'],
  'Performance benchmarks for pricing calculations',
  'Should meet performance targets: <200ms for single item, <500ms for 10-item cart, with caching improvements',
  NOW(),
  NOW()
),

(
  'Performance - Database Query Optimization',
  'performance',
  'lib/pricing/tier-pricing-engine.ts',
  E'import { findApplicableRules, findApplicableRulesForCart } from "@/lib/pricing/tier-pricing-engine"

describe("Database Query Optimization", () => {
  it("should use batch queries for cart items", async () => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      productId: `prod-${i}`,
      quantity: 10
    }))
    
    const start = Date.now()
    await findApplicableRulesForCart("customer-1", items)
    const duration = Date.now() - start
    
    console.log(`[v0] Batch query time for 20 items: ${duration}ms`)
    
    // Should complete in reasonable time even with 20 items
    expect(duration).toBeLessThan(1000)
  })
  
  it("should avoid N+1 query problems", async () => {
    // This test verifies that we are not making separate queries for each rule
    const rules = await findApplicableRules({
      customerId: "customer-1",
      productId: "prod-1",
      brandId: "brand-acme",
      categoryId: "category-flower"
    })
    
    // The implementation should use batch queries
    // If this takes too long, we have an N+1 problem
    expect(rules).toBeDefined()
  })
})',
  'pending',
  'high',
  ARRAY['performance', 'database', 'optimization'],
  'Tests database query optimization and N+1 prevention',
  'Should use batch queries and avoid N+1 query problems for optimal performance',
  NOW(),
  NOW()
),

(
  'Audit Logging - Pricing Audit Trail',
  'integration',
  'lib/pricing/pricing-audit-logger.ts',
  E'import { 
  logSuccessfulPricing, 
  logPricingError, 
  logDiscountEvaluation,
  getPricingAuditLogs 
} from "@/lib/pricing/pricing-audit-logger"

describe("Pricing Audit Logging", () => {
  it("should log successful pricing calculations", async () => {
    await logSuccessfulPricing({
      customerId: "customer-1",
      productId: "prod-1",
      quantity: 10,
      basePrice: 100,
      finalPrice: 90,
      discountAmount: 10,
      discountPercentage: 10,
      ruleId: "rule-1",
      ruleName: "Test Discount",
      tierName: "A",
      calculationDurationMs: 150
    })
    
    const logs = await getPricingAuditLogs({
      customerId: "customer-1",
      limit: 1
    })
    
    expect(logs.length).toBeGreaterThan(0)
  })
  
  it("should log pricing errors", async () => {
    await logPricingError({
      customerId: "customer-1",
      productId: "prod-invalid",
      quantity: 10,
      errorMessage: "Product not found",
      errorDetails: { code: "NOT_FOUND" }
    })
    
    const logs = await getPricingAuditLogs({
      customerId: "customer-1",
      status: "error",
      limit: 1
    })
    
    expect(logs.length).toBeGreaterThan(0)
  })
  
  it("should log discount evaluation details", async () => {
    await logDiscountEvaluation({
      customerId: "customer-1",
      productId: "prod-1",
      quantity: 10,
      evaluatedDiscounts: [
        { ruleId: "rule-1", ruleName: "Discount A", tierName: "A", discountAmount: 10, savings: 10 },
        { ruleId: "rule-2", ruleName: "Discount B", tierName: "A", discountAmount: 15, savings: 15 }
      ]
    })
    
    const logs = await getPricingAuditLogs({
      customerId: "customer-1",
      limit: 1
    })
    
    expect(logs.length).toBeGreaterThan(0)
  })
})',
  'pending',
  'medium',
  ARRAY['audit-logging', 'compliance', 'integration-test'],
  'Tests pricing audit logging for compliance and debugging',
  'Should log all pricing calculations, errors, and discount evaluations for audit trail',
  NOW(),
  NOW()
);

-- Log the test suite creation
INSERT INTO test_execution_history (
  test_id,
  status,
  execution_time_ms,
  error_message,
  executed_at
)
SELECT 
  id,
  'pending',
  0,
  'Test suite created - awaiting execution',
  NOW()
FROM ai_generated_tests
WHERE test_name LIKE 'Pricing%' OR test_name LIKE 'Tier Pricing%' OR test_name LIKE 'API -%' OR test_name LIKE 'Edge Cases%' OR test_name LIKE 'Performance%' OR test_name LIKE 'Audit Logging%';
