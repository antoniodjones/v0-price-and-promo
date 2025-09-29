import type { ProductEntity } from "../entities/product"
import type { CustomerEntity } from "../entities/customer"
import { DiscountRule } from "../value-objects/discount-rule"

export class PricingDomainService {
  calculateBestPrice(
    product: ProductEntity,
    customer: CustomerEntity,
    quantity = 1,
  ): {
    finalPrice: number
    appliedDiscount: DiscountRule | null
    availableDiscounts: DiscountRule[]
    savings: number
    explanation: string
  } {
    const availableDiscounts = this.getApplicableDiscounts(product, customer, quantity)
    const bestDiscount = this.findBestDiscount(availableDiscounts, product.price)
    const finalPrice = this.calculateFinalPrice(product.price, bestDiscount)
    const savings = (product.price - finalPrice) * quantity

    return {
      finalPrice,
      appliedDiscount: bestDiscount,
      availableDiscounts,
      savings,
      explanation: this.generateExplanation(availableDiscounts, bestDiscount),
    }
  }

  private getApplicableDiscounts(product: ProductEntity, customer: CustomerEntity, quantity: number): DiscountRule[] {
    const discounts: DiscountRule[] = []

    // Customer tier discount
    if (customer.canReceiveDiscount(product.brand)) {
      discounts.push(
        new DiscountRule(
          "customer-tier",
          `${product.brand} - Tier ${customer.tier} Customer ${customer.getDiscountPercentage()}%`,
          "customer",
          "percentage",
          customer.getDiscountPercentage(),
          3,
          "Customer tier discount",
          true,
          undefined,
          undefined,
          "active",
        ),
      )
    }

    // Expiration discount
    if (product.canApplyExpirationDiscount()) {
      const daysToExpiration = Math.ceil(
        (new Date(product.expirationDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
      discounts.push(
        new DiscountRule(
          "expiration-30-day",
          "30-Day Expiration Auto Discount",
          "expiration",
          "percentage",
          20,
          1,
          `${daysToExpiration} days to expiration`,
          true,
          undefined,
          undefined,
          "active",
        ),
      )
    }

    // THC discount for flower
    if (product.canApplyLowTHCDiscount()) {
      discounts.push(
        new DiscountRule(
          "low-thc-flower",
          "Low THC Flower Discount",
          "thc",
          "percentage",
          10,
          2,
          `${product.thcPercentage}% THC (below 15% threshold)`,
          true,
          undefined,
          undefined,
          "active",
        ),
      )
    }

    // Volume discount
    if (quantity > 3) {
      discounts.push(
        new DiscountRule(
          "volume-discount",
          "Volume Discount 5%",
          "volume",
          "percentage",
          5,
          4,
          `${quantity} units (over 3 unit threshold)`,
          true,
          undefined,
          undefined,
          "active",
        ),
      )
    }

    return discounts.filter((discount) => discount.isValid())
  }

  private findBestDiscount(discounts: DiscountRule[], basePrice: number): DiscountRule | null {
    if (discounts.length === 0) return null

    const discountsWithSavings = discounts.map((discount) => ({
      discount,
      savings: discount.calculateSavings(basePrice),
    }))

    // Sort by savings (descending), then by priority (ascending)
    discountsWithSavings.sort((a, b) => {
      if (a.savings !== b.savings) {
        return b.savings - a.savings
      }
      return a.discount.comparePriority(b.discount)
    })

    return discountsWithSavings[0]?.discount || null
  }

  private calculateFinalPrice(basePrice: number, bestDiscount: DiscountRule | null): number {
    if (!bestDiscount) return basePrice
    return Math.max(0, basePrice - bestDiscount.calculateSavings(basePrice))
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
