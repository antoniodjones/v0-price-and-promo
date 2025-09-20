// Core API types and interfaces for GTI Pricing Engine

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Customer types
export interface Customer {
  id: string
  name: string
  email: string
  tier: "A" | "B" | "C"
  market: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Product types
export interface Product {
  id: string
  name: string
  sku: string
  category: string
  subCategory: string
  brand: string
  thcPercentage: number
  basePrice: number
  expirationDate: string
  batchId: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Discount types
export interface CustomerDiscount {
  id: string
  name: string
  type: "percentage" | "fixed"
  value: number
  level: "item" | "brand" | "category" | "subcategory"
  target: string
  customerTiers: string[]
  markets: string[]
  startDate: string
  endDate: string
  status: "active" | "inactive" | "scheduled"
  createdAt: string
  updatedAt: string
}

export interface InventoryDiscount {
  id: string
  name: string
  type: "expiration" | "thc"
  triggerValue: number
  discountType: "percentage" | "fixed"
  discountValue: number
  scope: "all" | "category" | "brand"
  scopeValue?: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Promotion types
export interface BogoPromotion {
  id: string
  name: string
  type: "traditional" | "percentage" | "fixed"
  triggerLevel: "item" | "brand" | "category"
  triggerValue: string
  rewardType: "free" | "percentage" | "fixed"
  rewardValue: number
  startDate: string
  endDate: string
  status: "active" | "inactive" | "scheduled"
  createdAt: string
  updatedAt: string
}

export interface BundleDeal {
  id: string
  name: string
  type: "fixed" | "category" | "mix_match" | "tiered"
  products: string[]
  discountType: "percentage" | "fixed"
  discountValue: number
  minQuantity: number
  startDate: string
  endDate: string
  status: "active" | "inactive" | "scheduled"
  createdAt: string
  updatedAt: string
}

// Pricing types
export interface PricingRequest {
  customerId: string
  items: {
    productId: string
    quantity: number
  }[]
  market: string
}

export interface PricingResponse {
  items: {
    productId: string
    quantity: number
    basePrice: number
    discountedPrice: number
    appliedDiscounts: {
      type: string
      name: string
      value: number
    }[]
  }[]
  subtotal: number
  totalDiscount: number
  finalTotal: number
}
