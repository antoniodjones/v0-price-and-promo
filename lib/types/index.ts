export interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  price: number
  cost?: number
  inventoryCount?: number
  batchId?: string
  thcPercentage?: number
  expirationDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  tier: "A" | "B" | "C"
  market: string
  status: "active" | "inactive"
  totalPurchases?: number
  createdAt?: string
  updatedAt?: string
}

export interface DiscountRule {
  id: string
  name: string
  type: "customer" | "expiration" | "thc" | "volume" | "tiered"
  discountType: "percentage" | "dollar"
  discountValue: number
  priority: number
  reason: string
  applicable: boolean
  startDate?: string
  endDate?: string
  status: "active" | "inactive"
}

export interface PricingCalculation {
  productId: string
  customerId: string
  basePrice: number
  finalPrice: number
  appliedDiscount?: DiscountRule
  availableDiscounts: DiscountRule[]
  savings: number
  explanation: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  success: boolean
}
