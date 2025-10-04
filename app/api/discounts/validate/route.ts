import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/api/database"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

interface ValidationRequest {
  customerId: string
  productId?: string
  products?: Array<{ id: string; quantity: number }>
  market: string
  quantity?: number
}

interface DiscountCalculation {
  discountId: string
  discountName: string
  discountType: "customer" | "inventory" | "bogo" | "bundle"
  originalPrice: number
  discountAmount: number
  finalPrice: number
  savings: number
  savingsPercentage: number
  appliedRule: string
  priority: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json()
    const { customerId, productId, products, market, quantity = 1 } = body

    // Validate required fields
    if (!customerId || !market) {
      return NextResponse.json(createApiResponse(null, "Customer ID and Market are required", false), { status: 400 })
    }

    if (!productId && !products) {
      return NextResponse.json(createApiResponse(null, "Either productId or products array is required", false), {
        status: 400,
      })
    }

    // Get customer data with error handling
    const customer = await db.getCustomerById(customerId).catch(() => null)
    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    let calculationResults: DiscountCalculation[] = []

    if (productId) {
      // Single product validation
      const result = await calculateSingleProductDiscount(productId, customer, market, quantity)
      if (result) {
        calculationResults.push(result)
      }
    } else if (products) {
      // Multiple products validation (for basket scenarios)
      calculationResults = await calculateBasketDiscounts(products, customer, market)
    }

    // Calculate totals
    const totalOriginalPrice = calculationResults.reduce((sum, calc) => sum + calc.originalPrice, 0)
    const totalDiscountAmount = calculationResults.reduce((sum, calc) => sum + calc.discountAmount, 0)
    const totalFinalPrice = calculationResults.reduce((sum, calc) => sum + calc.finalPrice, 0)
    const totalSavings = calculationResults.reduce((sum, calc) => sum + calc.savings, 0)

    return NextResponse.json(
      createApiResponse(
        {
          customer,
          calculations: calculationResults,
          summary: {
            totalOriginalPrice,
            totalDiscountAmount,
            totalFinalPrice,
            totalSavings,
            totalSavingsPercentage: totalOriginalPrice > 0 ? (totalSavings / totalOriginalPrice) * 100 : 0,
            discountsApplied: calculationResults.length,
          },
          timestamp: new Date().toISOString(),
        },
        "Discount validation completed successfully",
      ),
    )
  } catch (error) {
    console.error("[v0] Discount validation error:", error)
    return handleApiError(error)
  }
}

async function calculateSingleProductDiscount(
  productId: string,
  customer: any,
  market: string,
  quantity: number,
): Promise<DiscountCalculation | null> {
  try {
    // Get product data with error handling
    const product = await db.getProductById(productId).catch(() => null)
    if (!product) {
      throw new Error(`Product not found: ${productId}`)
    }

    // Get all active discounts with error handling
    const [customerDiscounts, inventoryDiscounts, bogoPromotions] = await Promise.allSettled([
      db.getCustomerDiscounts(),
      db.getInventoryDiscounts(),
      db.getBogoPromotions?.() || Promise.resolve([]),
    ])

    const activeCustomerDiscounts = (customerDiscounts.status === "fulfilled" ? customerDiscounts.value : []).filter(
      (d: any) =>
        d.status === "active" &&
        d.customerTiers?.includes(customer.tier) &&
        d.markets?.includes(market) &&
        new Date(d.startDate) <= new Date() &&
        (!d.endDate || new Date(d.endDate) >= new Date()),
    )

    const activeInventoryDiscounts = (inventoryDiscounts.status === "fulfilled" ? inventoryDiscounts.value : []).filter(
      (d: any) => d.status === "active",
    )

    const activeBogoPromotions = (bogoPromotions.status === "fulfilled" ? bogoPromotions.value : []).filter(
      (p: any) =>
        p.status === "active" &&
        (!p.startDate || new Date(p.startDate) <= new Date()) &&
        (!p.endDate || new Date(p.endDate) >= new Date()),
    )

    // Find applicable discounts
    const applicableDiscounts: any[] = []

    // Check customer discounts
    for (const discount of activeCustomerDiscounts) {
      if (isDiscountApplicable(discount, product)) {
        applicableDiscounts.push({
          ...discount,
          discountType: "customer",
          priority: 1,
        })
      }
    }

    // Check inventory discounts
    for (const discount of activeInventoryDiscounts) {
      if (isInventoryDiscountApplicable(discount, product)) {
        applicableDiscounts.push({
          ...discount,
          discountType: "inventory",
          priority: 2,
        })
      }
    }

    // Check BOGO promotions
    for (const promo of activeBogoPromotions) {
      if (isBogoApplicable(promo, product, quantity)) {
        applicableDiscounts.push({
          ...promo,
          discountType: "bogo",
          priority: 3,
        })
      }
    }

    // Apply best deal logic (highest discount wins, no stacking)
    let bestDiscount = null
    let bestDiscountAmount = 0

    for (const discount of applicableDiscounts) {
      const discountAmount = calculateDiscountAmount(discount, product, quantity)

      if (discountAmount > bestDiscountAmount) {
        bestDiscountAmount = discountAmount
        bestDiscount = discount
      }
    }

    const originalPrice = product.basePrice * quantity
    const finalPrice = Math.max(0, originalPrice - bestDiscountAmount)

    return {
      discountId: bestDiscount?.id || "none",
      discountName: bestDiscount?.name || "No discount applied",
      discountType: bestDiscount?.discountType || "none",
      originalPrice,
      discountAmount: bestDiscountAmount,
      finalPrice,
      savings: bestDiscountAmount,
      savingsPercentage: originalPrice > 0 ? (bestDiscountAmount / originalPrice) * 100 : 0,
      appliedRule: bestDiscount ? `${bestDiscount.discountType}: ${bestDiscount.name}` : "Base pricing",
      priority: bestDiscount?.priority || 0,
    }
  } catch (error) {
    console.error("[v0] Error calculating single product discount:", error)
    return null
  }
}

async function calculateBasketDiscounts(
  products: Array<{ id: string; quantity: number }>,
  customer: any,
  market: string,
): Promise<DiscountCalculation[]> {
  const results: DiscountCalculation[] = []

  for (const productItem of products) {
    const result = await calculateSingleProductDiscount(productItem.id, customer, market, productItem.quantity)
    if (result) {
      results.push(result)
    }
  }

  return results
}

function isDiscountApplicable(discount: any, product: any): boolean {
  switch (discount.level) {
    case "item":
      return discount.target === product.id
    case "brand":
      return discount.target === product.brand
    case "category":
      return discount.target === product.category
    case "subcategory":
      return discount.target === product.subCategory
    default:
      return false
  }
}

function isInventoryDiscountApplicable(discount: any, product: any): boolean {
  let triggerMet = false

  if (discount.type === "expiration") {
    const daysUntilExpiration = Math.ceil(
      (new Date(product.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    triggerMet = daysUntilExpiration <= discount.triggerValue
  } else if (discount.type === "thc") {
    triggerMet = product.thcPercentage <= discount.triggerValue
  }

  if (!triggerMet) return false

  // Check scope
  return (
    discount.scope === "all" ||
    (discount.scope === "category" && discount.scopeValue === product.category) ||
    (discount.scope === "brand" && discount.scopeValue === product.brand)
  )
}

function isBogoApplicable(promo: any, product: any, quantity: number): boolean {
  // BOGO requires at least 2 items
  if (quantity < 2) return false

  switch (promo.triggerLevel) {
    case "item":
      return promo.triggerTarget === product.id
    case "brand":
      return promo.triggerTarget === product.brand
    case "category":
      return promo.triggerTarget === product.category
    default:
      return false
  }
}

function calculateDiscountAmount(discount: any, product: any, quantity: number): number {
  const basePrice = product.basePrice * quantity

  if (discount.discountType === "customer") {
    if (discount.type === "percentage") {
      return basePrice * (discount.value / 100)
    } else {
      return discount.value * quantity
    }
  } else if (discount.discountType === "inventory") {
    if (discount.discountType === "percentage") {
      return basePrice * (discount.discountValue / 100)
    } else {
      return discount.discountValue * quantity
    }
  } else if (discount.discountType === "bogo") {
    // BOGO calculation: get discount on every second item
    const discountableItems = Math.floor(quantity / 2)
    if (discount.rewardType === "percentage") {
      return product.basePrice * discountableItems * (discount.rewardValue / 100)
    } else if (discount.rewardType === "free") {
      return product.basePrice * discountableItems
    } else {
      return discount.rewardValue * discountableItems
    }
  }

  return 0
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")
    const market = searchParams.get("market")

    if (!customerId || !market) {
      return NextResponse.json(createApiResponse(null, "Customer ID and Market are required", false), { status: 400 })
    }

    // Get customer's applicable discount summary
    const customer = await db.getCustomerById(customerId).catch(() => null)
    if (!customer) {
      return NextResponse.json(createApiResponse(null, "Customer not found", false), { status: 404 })
    }

    const [customerDiscounts, inventoryDiscounts] = await Promise.allSettled([
      db.getCustomerDiscounts(),
      db.getInventoryDiscounts(),
    ])

    const activeCustomerDiscounts = (customerDiscounts.status === "fulfilled" ? customerDiscounts.value : []).filter(
      (d: any) => d.status === "active" && d.customerTiers?.includes(customer.tier) && d.markets?.includes(market),
    ).length

    const activeInventoryDiscounts = (inventoryDiscounts.status === "fulfilled" ? inventoryDiscounts.value : []).filter(
      (d: any) => d.status === "active",
    ).length

    return NextResponse.json(
      createApiResponse(
        {
          customer: {
            id: customer.id,
            business_legal_name: customer.business_legal_name,
            tier: customer.tier,
          },
          discountSummary: {
            customerDiscounts: activeCustomerDiscounts,
            inventoryDiscounts: activeInventoryDiscounts,
            totalActiveDiscounts: activeCustomerDiscounts + activeInventoryDiscounts,
          },
          market,
          timestamp: new Date().toISOString(),
        },
        "Discount status retrieved successfully",
      ),
    )
  } catch (error) {
    console.error("[v0] Error getting discount status:", error)
    return handleApiError(error)
  }
}
