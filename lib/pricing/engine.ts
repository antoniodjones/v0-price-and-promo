// GTI Pricing Engine - Core pricing calculation logic

import { db } from "@/lib/api/database"
import { logInfo, logError } from "@/lib/logger"
import type { Product, Customer, CustomerDiscount, InventoryDiscount, BogoPromotion, BundleDeal } from "@/lib/schemas"

export interface PricingItem {
  productId: string
  quantity: number
  product?: Product
}

export interface PricingResult {
  items: PricedItem[]
  subtotal: number
  totalDiscount: number
  finalTotal: number
  appliedDiscounts: AppliedDiscount[]
  appliedPromotions: AppliedPromotion[]
}

export interface PricedItem {
  productId: string
  quantity: number
  basePrice: number
  discountedPrice: number
  totalPrice: number
  discountAmount: number
  product: Product
}

export interface AppliedDiscount {
  id: string
  name: string
  type: "customer" | "inventory"
  discountType: "percentage" | "fixed"
  value: number
  appliedTo: string[]
  savings: number
}

export interface AppliedPromotion {
  id: string
  name: string
  type: "bogo" | "bundle"
  description: string
  savings: number
}

export class PricingEngine {
  private customer: Customer | null = null
  private products: Map<string, Product> = new Map()
  private customerDiscounts: CustomerDiscount[] = []
  private inventoryDiscounts: InventoryDiscount[] = []
  private bogoPromotions: BogoPromotion[] = []
  private bundleDeals: BundleDeal[] = []

  async initialize(customerId: string, market: string): Promise<void> {
    try {
      logInfo(`Initializing pricing engine for customer: ${customerId}, market: ${market}`)

      // Load customer data
      this.customer = await db.getCustomer(customerId)
      if (!this.customer) {
        throw new Error(`Customer not found: ${customerId}`)
      }

      // Load active discounts and promotions
      await this.loadDiscountsAndPromotions(market)

      logInfo("Pricing engine initialized successfully")
    } catch (error) {
      logError("Failed to initialize pricing engine", error)
      throw error
    }
  }

  private async loadDiscountsAndPromotions(market: string): Promise<void> {
    try {
      // Load customer discounts (filtered by customer tier and market)
      const allCustomerDiscounts = await db.getCustomerDiscounts()
      this.customerDiscounts = allCustomerDiscounts.filter(
        (discount) =>
          discount.status === "active" &&
          discount.customerTiers.includes(this.customer!.tier) &&
          discount.markets.includes(market) &&
          this.isDiscountActive(discount.startDate, discount.endDate),
      )

      // Load inventory discounts
      const allInventoryDiscounts = await db.getInventoryDiscounts()
      this.inventoryDiscounts = allInventoryDiscounts.filter((discount) => discount.status === "active")

      // Load BOGO promotions
      const allBogoPromotions = await db.getBogoPromotions()
      this.bogoPromotions = allBogoPromotions.filter(
        (promo) => promo.status === "active" && this.isDiscountActive(promo.startDate, promo.endDate),
      )

      // Load bundle deals
      const allBundleDeals = await db.getBundleDeals()
      this.bundleDeals = allBundleDeals.filter(
        (bundle) => bundle.status === "active" && this.isDiscountActive(bundle.startDate, bundle.endDate),
      )

      logInfo(
        `Loaded ${this.customerDiscounts.length} customer discounts, ${this.inventoryDiscounts.length} inventory discounts`,
      )
    } catch (error) {
      logError("Failed to load discounts and promotions", error)
      throw error
    }
  }

  private isDiscountActive(startDate: string, endDate: string | null): boolean {
    const now = new Date()
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    return now >= start && (!end || now <= end)
  }

  async calculatePricing(items: PricingItem[]): Promise<PricingResult> {
    try {
      if (!this.customer) {
        throw new Error("Pricing engine not initialized")
      }

      logInfo(`Calculating pricing for ${items.length} items`)

      // Load product data for all items
      await this.loadProducts(items.map((item) => item.productId))

      // Calculate base pricing
      const pricedItems = await this.calculateBasePricing(items)

      // Apply customer discounts
      const { items: itemsWithCustomerDiscounts, appliedDiscounts } = await this.applyCustomerDiscounts(pricedItems)

      // Apply inventory discounts
      const { items: itemsWithInventoryDiscounts, appliedInventoryDiscounts } =
        await this.applyInventoryDiscounts(itemsWithCustomerDiscounts)

      // Apply promotions (BOGO, bundles)
      const { items: finalItems, appliedPromotions } = await this.applyPromotions(itemsWithInventoryDiscounts, items)

      // Calculate totals
      const subtotal = pricedItems.reduce((sum, item) => sum + item.totalPrice, 0)
      const finalTotal = finalItems.reduce((sum, item) => sum + item.totalPrice, 0)
      const totalDiscount = subtotal - finalTotal

      const result: PricingResult = {
        items: finalItems,
        subtotal,
        totalDiscount,
        finalTotal,
        appliedDiscounts: [...appliedDiscounts, ...appliedInventoryDiscounts],
        appliedPromotions,
      }

      logInfo(`Pricing calculation complete. Subtotal: $${subtotal.toFixed(2)}, Final: $${finalTotal.toFixed(2)}`)

      return result
    } catch (error) {
      logError("Failed to calculate pricing", error)
      throw error
    }
  }

  private async loadProducts(productIds: string[]): Promise<void> {
    try {
      const products = await db.getProductsByIds(productIds)
      this.products.clear()

      for (const product of products) {
        this.products.set(product.id!, product)
      }

      // Check for missing products
      const missingProducts = productIds.filter((id) => !this.products.has(id))
      if (missingProducts.length > 0) {
        throw new Error(`Products not found: ${missingProducts.join(", ")}`)
      }
    } catch (error) {
      logError("Failed to load products", error)
      throw error
    }
  }

  private async calculateBasePricing(items: PricingItem[]): Promise<PricedItem[]> {
    return items.map((item) => {
      const product = this.products.get(item.productId)!
      const basePrice = product.price
      const totalPrice = basePrice * item.quantity

      return {
        productId: item.productId,
        quantity: item.quantity,
        basePrice,
        discountedPrice: basePrice,
        totalPrice,
        discountAmount: 0,
        product,
      }
    })
  }

  private async applyCustomerDiscounts(
    items: PricedItem[],
  ): Promise<{ items: PricedItem[]; appliedDiscounts: AppliedDiscount[] }> {
    const appliedDiscounts: AppliedDiscount[] = []
    const updatedItems = [...items]

    for (const discount of this.customerDiscounts) {
      const applicableItems = this.findApplicableItems(updatedItems, discount.level, discount.target)

      if (applicableItems.length === 0) continue

      let totalSavings = 0
      const appliedTo: string[] = []

      for (const item of applicableItems) {
        const discountAmount = this.calculateDiscountAmount(item.discountedPrice, discount.type, discount.value)
        const newPrice = Math.max(0, item.discountedPrice - discountAmount)
        const itemSavings = (item.discountedPrice - newPrice) * item.quantity

        item.discountedPrice = newPrice
        item.totalPrice = newPrice * item.quantity
        item.discountAmount += discountAmount * item.quantity

        totalSavings += itemSavings
        appliedTo.push(item.productId)
      }

      if (totalSavings > 0) {
        appliedDiscounts.push({
          id: discount.id!,
          name: discount.name,
          type: "customer",
          discountType: discount.type,
          value: discount.value,
          appliedTo,
          savings: totalSavings,
        })
      }
    }

    return { items: updatedItems, appliedDiscounts }
  }

  private async applyInventoryDiscounts(
    items: PricedItem[],
  ): Promise<{ items: PricedItem[]; appliedDiscounts: AppliedDiscount[] }> {
    const appliedDiscounts: AppliedDiscount[] = []
    const updatedItems = [...items]

    for (const discount of this.inventoryDiscounts) {
      const applicableItems = updatedItems.filter((item) => {
        if (discount.scope === "all") return true
        if (discount.scope === "category") return item.product.category === discount.scopeValue
        if (discount.scope === "brand") return item.product.brand === discount.scopeValue
        return false
      })

      let totalSavings = 0
      const appliedTo: string[] = []

      for (const item of applicableItems) {
        let shouldApply = false

        if (discount.type === "expiration") {
          const daysToExpiration = Math.ceil(
            (new Date(item.product.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )
          shouldApply = daysToExpiration <= discount.triggerValue
        } else if (discount.type === "thc") {
          shouldApply = item.product.thc_percentage <= discount.triggerValue
        }

        if (shouldApply) {
          const discountAmount = this.calculateDiscountAmount(
            item.discountedPrice,
            discount.discountType,
            discount.discountValue,
          )
          const newPrice = Math.max(0, item.discountedPrice - discountAmount)
          const itemSavings = (item.discountedPrice - newPrice) * item.quantity

          item.discountedPrice = newPrice
          item.totalPrice = newPrice * item.quantity
          item.discountAmount += discountAmount * item.quantity

          totalSavings += itemSavings
          appliedTo.push(item.productId)
        }
      }

      if (totalSavings > 0) {
        appliedDiscounts.push({
          id: discount.id!,
          name: discount.name,
          type: "inventory",
          discountType: discount.discountType,
          value: discount.discountValue,
          appliedTo,
          savings: totalSavings,
        })
      }
    }

    return { items: updatedItems, appliedDiscounts }
  }

  private async applyPromotions(
    items: PricedItem[],
    originalItems: PricingItem[],
  ): Promise<{ items: PricedItem[]; appliedPromotions: AppliedPromotion[] }> {
    const appliedPromotions: AppliedPromotion[] = []
    let updatedItems = [...items]

    // Apply BOGO promotions
    for (const bogo of this.bogoPromotions) {
      const { items: itemsWithBogo, promotion } = this.applyBogoPromotion(updatedItems, bogo)
      if (promotion) {
        updatedItems = itemsWithBogo
        appliedPromotions.push(promotion)
      }
    }

    // Apply bundle deals
    for (const bundle of this.bundleDeals) {
      const { items: itemsWithBundle, promotion } = this.applyBundleDeal(updatedItems, bundle, originalItems)
      if (promotion) {
        updatedItems = itemsWithBundle
        appliedPromotions.push(promotion)
      }
    }

    return { items: updatedItems, appliedPromotions }
  }

  private applyBogoPromotion(
    items: PricedItem[],
    bogo: BogoPromotion,
  ): { items: PricedItem[]; promotion?: AppliedPromotion } {
    // Find applicable items based on trigger level and value
    const applicableItems = items.filter((item) => {
      if (bogo.triggerLevel === "item") return item.productId === bogo.triggerValue
      if (bogo.triggerLevel === "brand") return item.product.brand === bogo.triggerValue
      if (bogo.triggerLevel === "category") return item.product.category === bogo.triggerValue
      return false
    })

    if (applicableItems.length === 0) return { items }

    // Calculate BOGO savings (simplified - buy 1 get 1 free)
    let totalSavings = 0
    const updatedItems = [...items]

    for (const item of applicableItems) {
      if (item.quantity >= 2) {
        const freeItems = Math.floor(item.quantity / 2)
        let savings = 0

        if (bogo.rewardType === "free") {
          savings = item.discountedPrice * freeItems
        } else if (bogo.rewardType === "percentage") {
          savings = ((item.discountedPrice * bogo.rewardValue) / 100) * freeItems
        } else if (bogo.rewardType === "fixed") {
          savings = bogo.rewardValue * freeItems
        }

        const itemIndex = updatedItems.findIndex((i) => i.productId === item.productId)
        if (itemIndex !== -1) {
          updatedItems[itemIndex].totalPrice -= savings
          updatedItems[itemIndex].discountAmount += savings
          totalSavings += savings
        }
      }
    }

    if (totalSavings > 0) {
      return {
        items: updatedItems,
        promotion: {
          id: bogo.id!,
          name: bogo.name,
          type: "bogo",
          description: `Buy one, get one ${bogo.rewardType === "free" ? "free" : `${bogo.rewardValue}${bogo.rewardType === "percentage" ? "%" : "$"} off`}`,
          savings: totalSavings,
        },
      }
    }

    return { items }
  }

  private applyBundleDeal(
    items: PricedItem[],
    bundle: BundleDeal,
    originalItems: PricingItem[],
  ): { items: PricedItem[]; promotion?: AppliedPromotion } {
    // Check if all required products are in the cart with minimum quantity
    const requiredProducts = bundle.products
    const hasAllProducts = requiredProducts.every((productId) => {
      const item = originalItems.find((i) => i.productId === productId)
      return item && item.quantity >= bundle.minQuantity
    })

    if (!hasAllProducts) return { items }

    // Apply bundle discount
    const bundleItems = items.filter((item) => requiredProducts.includes(item.productId))
    let totalSavings = 0
    const updatedItems = [...items]

    for (const item of bundleItems) {
      const discountAmount = this.calculateDiscountAmount(
        item.discountedPrice,
        bundle.discountType,
        bundle.discountValue,
      )
      const savings = discountAmount * Math.min(item.quantity, bundle.minQuantity)

      const itemIndex = updatedItems.findIndex((i) => i.productId === item.productId)
      if (itemIndex !== -1) {
        updatedItems[itemIndex].totalPrice -= savings
        updatedItems[itemIndex].discountAmount += savings
        totalSavings += savings
      }
    }

    if (totalSavings > 0) {
      return {
        items: updatedItems,
        promotion: {
          id: bundle.id!,
          name: bundle.name,
          type: "bundle",
          description: `Bundle deal: ${bundle.discountType === "percentage" ? `${bundle.discountValue}% off` : `$${bundle.discountValue} off`}`,
          savings: totalSavings,
        },
      }
    }

    return { items }
  }

  private findApplicableItems(items: PricedItem[], level: string, target: string): PricedItem[] {
    return items.filter((item) => {
      switch (level) {
        case "brand":
          return item.product.brand === target
        case "category":
          return item.product.category === target
        case "batch":
          return item.product.batch_id === target
        default:
          return false
      }
    })
  }

  private calculateDiscountAmount(price: number, type: "percentage" | "fixed", value: number): number {
    if (type === "percentage") {
      return price * (value / 100)
    }
    return Math.min(value, price) // Fixed discount can't exceed the price
  }
}

// Export singleton instance
export const pricingEngine = new PricingEngine()
