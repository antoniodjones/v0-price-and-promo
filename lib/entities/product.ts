export interface ProductEntity {
  id: string
  name: string
  sku: string
  brand: string
  category: string
  subCategory?: string
  basePrice: number
  cost: number
  inventoryCount: number

  // Cannabis-specific fields
  thcPercentage?: number
  cbdPercentage?: number
  batchId?: string
  expirationDate?: string
  testResults?: {
    coaUrl?: string
    potency?: Record<string, number>
    pesticides?: boolean
    heavyMetals?: boolean
    microbials?: boolean
  }

  // Compliance fields
  licenseNumber?: string
  stateCompliance?: Record<string, boolean>

  // Metadata
  createdAt: string
  updatedAt: string
}

export interface PricingContext {
  customerId: string
  customerTier: string
  market: string
  orderQuantity: number
  totalOrderValue: number
  isInternalDispensary: boolean
}

export interface PricingRule {
  id: string
  name: string
  type: "customer" | "volume" | "expiration" | "thc" | "inventory" | "tiered"
  priority: number
  conditions: PricingCondition[]
  action: PricingAction
  isActive: boolean
}

export interface PricingCondition {
  field: string
  operator: "equals" | "greater_than" | "less_than" | "contains" | "in_range"
  value: any
}

export interface PricingAction {
  type: "percentage_discount" | "fixed_discount" | "fixed_price"
  value: number
  maxDiscount?: number
}

export interface PricingResult {
  originalPrice: number
  finalPrice: number
  discountAmount: number
  discountPercentage: number
  appliedRules: PricingRule[]
  explanation: string
}
