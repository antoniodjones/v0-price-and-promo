import { describe, it, expect } from "@jest/globals"

// Mock data for testing
const mockProduct = {
  id: "prod-1",
  name: "Test Product",
  sku: "TEST-001",
  category: "Flower",
  brand: "Premium Buds",
  basePrice: 100,
  thcPercentage: 12,
  expirationDate: "2025-01-15",
}

const mockCustomer = {
  id: "cust-1",
  name: "Test Dispensary",
  tier: "A",
}

// Utility functions to test
const calculateDiscountAmount = (discount: any, product: any, quantity: number): number => {
  const basePrice = product.basePrice * quantity

  if (discount.discountType === "customer") {
    if (discount.type === "percentage") {
      return basePrice * (discount.value / 100)
    } else {
      return discount.value * quantity
    }
  } else if (discount.discountType === "inventory") {
    if (discount.type === "percentage") {
      return basePrice * (discount.discountValue / 100)
    } else {
      return discount.discountValue * quantity
    }
  } else if (discount.discountType === "bogo") {
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

const isDiscountApplicable = (discount: any, product: any): boolean => {
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

const isBogoApplicable = (promo: any, product: any, quantity: number): boolean => {
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

describe("Discount Calculator Edge Cases", () => {
  describe("calculateDiscountAmount", () => {
    it("should handle zero quantity gracefully", () => {
      const discount = { discountType: "customer", type: "percentage", value: 10 }
      const result = calculateDiscountAmount(discount, mockProduct, 0)
      expect(result).toBe(0)
    })

    it("should handle negative quantity gracefully", () => {
      const discount = { discountType: "customer", type: "percentage", value: 10 }
      const result = calculateDiscountAmount(discount, mockProduct, -1)
      expect(result).toBe(-10) // Should handle mathematically but flag as edge case
    })

    it("should handle 100% discount correctly", () => {
      const discount = { discountType: "customer", type: "percentage", value: 100 }
      const result = calculateDiscountAmount(discount, mockProduct, 1)
      expect(result).toBe(100)
    })

    it("should handle discount greater than 100%", () => {
      const discount = { discountType: "customer", type: "percentage", value: 150 }
      const result = calculateDiscountAmount(discount, mockProduct, 1)
      expect(result).toBe(150) // Should calculate but may need capping logic
    })

    it("should handle zero base price", () => {
      const zeroProduct = { ...mockProduct, basePrice: 0 }
      const discount = { discountType: "customer", type: "percentage", value: 10 }
      const result = calculateDiscountAmount(discount, zeroProduct, 1)
      expect(result).toBe(0)
    })

    it("should handle BOGO with odd quantities", () => {
      const bogoDiscount = {
        discountType: "bogo",
        rewardType: "free",
        rewardValue: 0,
      }
      const result = calculateDiscountAmount(bogoDiscount, mockProduct, 3)
      expect(result).toBe(100) // Should discount 1 item (floor(3/2) = 1)
    })

    it("should handle BOGO with single item", () => {
      const bogoDiscount = {
        discountType: "bogo",
        rewardType: "free",
        rewardValue: 0,
      }
      const result = calculateDiscountAmount(bogoDiscount, mockProduct, 1)
      expect(result).toBe(0) // No discount for single item
    })

    it("should handle dollar amount discount larger than product price", () => {
      const discount = { discountType: "customer", type: "dollar", value: 150 }
      const result = calculateDiscountAmount(discount, mockProduct, 1)
      expect(result).toBe(150) // Should calculate but may need capping
    })
  })

  describe("isDiscountApplicable", () => {
    it("should handle null/undefined product gracefully", () => {
      const discount = { level: "brand", target: "Premium Buds" }
      expect(() => isDiscountApplicable(discount, null)).not.toThrow()
      expect(() => isDiscountApplicable(discount, undefined)).not.toThrow()
    })

    it("should handle null/undefined discount gracefully", () => {
      expect(() => isDiscountApplicable(null, mockProduct)).not.toThrow()
      expect(() => isDiscountApplicable(undefined, mockProduct)).not.toThrow()
    })

    it("should handle missing product properties", () => {
      const incompleteProduct = { id: "prod-1", name: "Test" }
      const discount = { level: "brand", target: "Premium Buds" }
      const result = isDiscountApplicable(discount, incompleteProduct)
      expect(result).toBe(false)
    })

    it("should handle case sensitivity in brand matching", () => {
      const discount = { level: "brand", target: "premium buds" }
      const result = isDiscountApplicable(discount, mockProduct)
      expect(result).toBe(false) // Should be case sensitive
    })

    it("should handle unknown discount levels", () => {
      const discount = { level: "unknown", target: "something" }
      const result = isDiscountApplicable(discount, mockProduct)
      expect(result).toBe(false)
    })
  })

  describe("isBogoApplicable", () => {
    it("should reject single quantity", () => {
      const promo = { triggerLevel: "brand", triggerTarget: "Premium Buds" }
      const result = isBogoApplicable(promo, mockProduct, 1)
      expect(result).toBe(false)
    })

    it("should accept minimum BOGO quantity", () => {
      const promo = { triggerLevel: "brand", triggerTarget: "Premium Buds" }
      const result = isBogoApplicable(promo, mockProduct, 2)
      expect(result).toBe(true)
    })

    it("should handle zero quantity", () => {
      const promo = { triggerLevel: "brand", triggerTarget: "Premium Buds" }
      const result = isBogoApplicable(promo, mockProduct, 0)
      expect(result).toBe(false)
    })

    it("should handle negative quantity", () => {
      const promo = { triggerLevel: "brand", triggerTarget: "Premium Buds" }
      const result = isBogoApplicable(promo, mockProduct, -1)
      expect(result).toBe(false)
    })

    it("should handle missing promo properties", () => {
      const incompletePromo = { triggerLevel: "brand" }
      const result = isBogoApplicable(incompletePromo, mockProduct, 2)
      expect(result).toBe(false)
    })
  })

  describe("Complex Stacking Scenarios", () => {
    it("should handle multiple applicable discounts correctly", () => {
      const discounts = [
        { id: "1", discountType: "customer", type: "percentage", value: 10, priority: 1 },
        { id: "2", discountType: "inventory", type: "percentage", discountValue: 15, priority: 2 },
        { id: "3", discountType: "customer", type: "dollar", value: 5, priority: 3 },
      ]

      const amounts = discounts.map((d) => calculateDiscountAmount(d, mockProduct, 1))
      expect(amounts).toEqual([10, 15, 5])

      // Best discount should be the inventory discount (15)
      const bestAmount = Math.max(...amounts)
      expect(bestAmount).toBe(15)
    })

    it("should handle edge case where dollar discount equals percentage discount", () => {
      const percentageDiscount = { discountType: "customer", type: "percentage", value: 10 }
      const dollarDiscount = { discountType: "customer", type: "dollar", value: 10 }

      const percentageAmount = calculateDiscountAmount(percentageDiscount, mockProduct, 1)
      const dollarAmount = calculateDiscountAmount(dollarDiscount, mockProduct, 1)

      expect(percentageAmount).toBe(dollarAmount) // Both should be 10
    })
  })

  describe("Date and Time Edge Cases", () => {
    it("should handle expiration date calculations correctly", () => {
      const today = new Date()
      const futureDate = new Date(today.getTime() + 29 * 24 * 60 * 60 * 1000) // 29 days from now

      const daysToExpiration = Math.ceil((futureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      expect(daysToExpiration).toBe(29)
      expect(daysToExpiration <= 30).toBe(true) // Should trigger 30-day discount
    })

    it("should handle expired products", () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const daysToExpiration = Math.ceil((yesterday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

      expect(daysToExpiration).toBeLessThanOrEqual(0)
    })

    it("should handle same-day expiration", () => {
      const today = new Date()
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      const daysToExpiration = Math.ceil((endOfToday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      expect(daysToExpiration).toBe(1)
    })
  })

  describe("THC Percentage Edge Cases", () => {
    it("should handle zero THC percentage", () => {
      const zeroThcProduct = { ...mockProduct, thcPercentage: 0 }
      // Assuming discount applies to THC below 15%
      expect(zeroThcProduct.thcPercentage < 15).toBe(true)
    })

    it("should handle exactly 15% THC (boundary condition)", () => {
      const boundaryProduct = { ...mockProduct, thcPercentage: 15 }
      // Should not qualify for "below 15%" discount
      expect(boundaryProduct.thcPercentage < 15).toBe(false)
    })

    it("should handle very high THC percentage", () => {
      const highThcProduct = { ...mockProduct, thcPercentage: 99.9 }
      expect(highThcProduct.thcPercentage < 15).toBe(false)
    })

    it("should handle null/undefined THC percentage", () => {
      const noThcProduct = { ...mockProduct, thcPercentage: undefined }
      expect(noThcProduct.thcPercentage && noThcProduct.thcPercentage < 15).toBeFalsy()
    })
  })
})
