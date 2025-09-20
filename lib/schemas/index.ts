import { z } from "zod"

// Base schemas for common types
export const StatusSchema = z.enum(["active", "inactive"])
export const CustomerTierSchema = z.enum(["A", "B", "C"])
export const DiscountTypeSchema = z.enum(["percentage", "fixed"])
export const DiscountLevelSchema = z.enum(["item", "brand", "category", "subcategory"])

// Customer schemas
export const CustomerSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format"),
  tier: CustomerTierSchema,
  market: z.string().min(1, "Market is required"),
  status: StatusSchema.default("active"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateCustomerSchema = CustomerSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateCustomerSchema = CreateCustomerSchema.partial()

// Product schemas
export const ProductSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Product name is required").max(200, "Name must be less than 200 characters"),
  sku: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  brand: z.string().min(1, "Brand is required"),
  thcPercentage: z.number().min(0, "THC percentage cannot be negative").max(100, "THC percentage cannot exceed 100%"),
  basePrice: z.number().positive("Base price must be positive"),
  expirationDate: z.string().datetime("Invalid expiration date format"),
  batchId: z.string().min(1, "Batch ID is required"),
  status: StatusSchema.default("active"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const CreateProductSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateProductSchema = CreateProductSchema.partial()

// Customer discount schemas
export const CustomerDiscountSchema = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().min(1, "Discount name is required").max(100, "Name must be less than 100 characters"),
    type: DiscountTypeSchema,
    value: z.number().positive("Discount value must be positive"),
    level: DiscountLevelSchema,
    target: z.string().min(1, "Target is required"),
    customerTiers: z.array(CustomerTierSchema).min(1, "At least one customer tier is required"),
    markets: z.array(z.string().min(1)).min(1, "At least one market is required"),
    startDate: z.string().datetime("Invalid start date format"),
    endDate: z.string().datetime("Invalid end date format"),
    status: z.enum(["active", "inactive", "scheduled"]).default("active"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "percentage" && data.value > 100) {
        return false
      }
      return true
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["value"],
    },
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      return endDate > startDate
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export const CreateCustomerDiscountSchema = CustomerDiscountSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateCustomerDiscountSchema = CreateCustomerDiscountSchema.partial()

// Inventory discount schemas
export const InventoryDiscountSchema = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().min(1, "Discount name is required").max(100, "Name must be less than 100 characters"),
    type: z.enum(["expiration", "thc"]),
    triggerValue: z.number().positive("Trigger value must be positive"),
    discountType: DiscountTypeSchema,
    discountValue: z.number().positive("Discount value must be positive"),
    scope: z.enum(["all", "category", "brand"]),
    scopeValue: z.string().optional(),
    status: StatusSchema.default("active"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.scope !== "all" && !data.scopeValue) {
        return false
      }
      return true
    },
    {
      message: "Scope value is required when scope is not 'all'",
      path: ["scopeValue"],
    },
  )
  .refine(
    (data) => {
      if (data.discountType === "percentage" && data.discountValue > 100) {
        return false
      }
      return true
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    },
  )

export const CreateInventoryDiscountSchema = InventoryDiscountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const UpdateInventoryDiscountSchema = CreateInventoryDiscountSchema.partial()

// BOGO promotion schemas
export const BogoPromotionSchema = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().min(1, "Promotion name is required").max(100, "Name must be less than 100 characters"),
    type: z.enum(["traditional", "percentage", "fixed"]),
    triggerLevel: z.enum(["item", "brand", "category"]),
    triggerValue: z.string().min(1, "Trigger value is required"),
    rewardType: z.enum(["free", "percentage", "fixed"]),
    rewardValue: z.number().min(0, "Reward value cannot be negative"),
    startDate: z.string().datetime("Invalid start date format"),
    endDate: z.string().datetime("Invalid end date format"),
    status: z.enum(["active", "inactive", "scheduled"]).default("active"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.rewardType === "percentage" && data.rewardValue > 100) {
        return false
      }
      return true
    },
    {
      message: "Percentage reward cannot exceed 100%",
      path: ["rewardValue"],
    },
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      return endDate > startDate
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export const CreateBogoPromotionSchema = BogoPromotionSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateBogoPromotionSchema = CreateBogoPromotionSchema.partial()

// Bundle deal schemas
export const BundleDealSchema = z
  .object({
    id: z.string().cuid().optional(),
    name: z.string().min(1, "Bundle name is required").max(100, "Name must be less than 100 characters"),
    type: z.enum(["fixed", "category", "mix_match", "tiered"]),
    products: z.array(z.string().cuid()).min(2, "Bundle must contain at least 2 products"),
    discountType: DiscountTypeSchema,
    discountValue: z.number().positive("Discount value must be positive"),
    minQuantity: z.number().int().positive("Minimum quantity must be a positive integer"),
    startDate: z.string().datetime("Invalid start date format"),
    endDate: z.string().datetime("Invalid end date format"),
    status: z.enum(["active", "inactive", "scheduled"]).default("active"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage" && data.discountValue > 100) {
        return false
      }
      return true
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    },
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      return endDate > startDate
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export const CreateBundleDealSchema = BundleDealSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateBundleDealSchema = CreateBundleDealSchema.partial()

// Pricing schemas
export const PricingItemSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
})

export const PricingRequestSchema = z.object({
  customerId: z.string().cuid("Invalid customer ID"),
  items: z.array(PricingItemSchema).min(1, "At least one item is required"),
  market: z.string().min(1, "Market is required"),
})

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// Type exports
export type Customer = z.infer<typeof CustomerSchema>
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>

export type Product = z.infer<typeof ProductSchema>
export type CreateProduct = z.infer<typeof CreateProductSchema>
export type UpdateProduct = z.infer<typeof UpdateProductSchema>

export type CustomerDiscount = z.infer<typeof CustomerDiscountSchema>
export type CreateCustomerDiscount = z.infer<typeof CreateCustomerDiscountSchema>
export type UpdateCustomerDiscount = z.infer<typeof UpdateCustomerDiscountSchema>

export type InventoryDiscount = z.infer<typeof InventoryDiscountSchema>
export type CreateInventoryDiscount = z.infer<typeof CreateInventoryDiscountSchema>
export type UpdateInventoryDiscount = z.infer<typeof UpdateInventoryDiscountSchema>

export type BogoPromotion = z.infer<typeof BogoPromotionSchema>
export type CreateBogoPromotion = z.infer<typeof CreateBogoPromotionSchema>
export type UpdateBogoPromotion = z.infer<typeof UpdateBogoPromotionSchema>

export type BundleDeal = z.infer<typeof BundleDealSchema>
export type CreateBundleDeal = z.infer<typeof CreateBundleDealSchema>
export type UpdateBundleDeal = z.infer<typeof UpdateBundleDealSchema>

export type PricingRequest = z.infer<typeof PricingRequestSchema>
export type PaginationParams = z.infer<typeof PaginationSchema>
