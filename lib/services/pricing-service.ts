import type { Product, Customer, DiscountRule, PricingCalculation } from "../types"

export class PricingService {
  calculateBestPrice(product: Product, customer: Customer, quantity = 1): PricingCalculation {
    const availableDiscounts = this.getApplicableDiscounts(product, customer, quantity)
    const bestDiscount = this.findBestDiscount(availableDiscounts, product.price)
    const finalPrice = this.calculateFinalPrice(product.price, bestDiscount)
    const savings = (product.price - finalPrice) * quantity

    return {
      productId: product.id,
      customerId: customer.id,
      basePrice: product.price,
      finalPrice,
      appliedDiscount: bestDiscount || undefined,
      availableDiscounts,
      savings,
      explanation: this.generateExplanation(availableDiscounts, bestDiscount),
    }
  }

  private getApplicableDiscounts(product: Product, customer: Customer, quantity: number): DiscountRule[] {
    const discounts: DiscountRule[] = []

    // Customer tier discount
    if (customer.tier === "A" && (product.brand === "Premium Buds" || product.brand === "Green Valley")) {
      discounts.push({
        id: "customer-tier-a",
        name: `${product.brand} - Tier A Customer 8%`,
        type: "customer",
        discountType: "percentage",
        discountValue: 8,
        priority: 3,
        reason: "Customer tier discount",
        applicable: true,
        status: "active",
      })
    }

    // Expiration discount
    if (product.expirationDate) {
      const daysToExpiration = Math.ceil(
        (new Date(product.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
      if (daysToExpiration <= 30 && daysToExpiration > 0) {
        discounts.push({
          id: "expiration-30-day",
          name: "30-Day Expiration Auto Discount",
          type: "expiration",
          discountType: "percentage",
          discountValue: 20,
          priority: 1,
          reason: `${daysToExpiration} days to expiration`,
          applicable: true,
          status: "active",
        })
      }
    }

    // THC discount for flower
    if (product.category === "Flower" && product.thcPercentage && product.thcPercentage < 15) {
      discounts.push({
        id: "low-thc-flower",
        name: "Low THC Flower Discount",
        type: "thc",
        discountType: "percentage",
        discountValue: 10,
        priority: 2,
        reason: `${product.thcPercentage}% THC (below 15% threshold)`,
        applicable: true,
        status: "active",
      })
    }

    // Volume discount
    if (quantity > 3) {
      discounts.push({
        id: "volume-discount",
        name: "Volume Discount 5%",
        type: "volume",
        discountType: "percentage",
        discountValue: 5,
        priority: 4,
        reason: `${quantity} units (over 3 unit threshold)`,
        applicable: true,
        status: "active",
      })
    }

    return discounts
  }

  private findBestDiscount(discounts: DiscountRule[], basePrice: number): DiscountRule | null {
    if (discounts.length === 0) return null

    const discountsWithSavings = discounts.map((discount) => ({
      ...discount,
      actualSavings:
        discount.discountType === "percentage"
          ? (basePrice * discount.discountValue) / 100
          : Math.min(discount.discountValue, basePrice),
    }))

    discountsWithSavings.sort((a, b) => {
      if (a.actualSavings !== b.actualSavings) {
        return b.actualSavings - a.actualSavings
      }
      return a.priority - b.priority
    })

    return discountsWithSavings[0]
  }

  private calculateFinalPrice(basePrice: number, bestDiscount: DiscountRule | null): number {
    if (!bestDiscount) return basePrice

    if (bestDiscount.discountType === "percentage") {
      return Math.max(0, basePrice * (1 - bestDiscount.discountValue / 100))
    } else {
      return Math.max(0, basePrice - bestDiscount.discountValue)
    }
  }

  private generateExplanation(availableDiscounts: DiscountRule[], bestDiscount: DiscountRule | null): string {
    if (availableDiscounts.length === 0) {
      return "No discounts available for this item"
    }

    if (availableDiscounts.length === 1) {
      return `Applied: ${bestDiscount?.name || "Unknown discount"} - Only available discount`
    }

    return `Applied: ${bestDiscount?.name || "Unknown discount"} - Best of ${availableDiscounts.length} available discounts`
  }
}

export const pricingService = new PricingService()
