import { describe, it, expect, jest, beforeEach } from "@jest/globals"
import { NextRequest } from "next/server"
import { POST, GET } from "@/app/api/discounts/validate/route"

// Mock the database module
jest.mock("@/lib/api/database", () => ({
  db: {
    getCustomerById: jest.fn(),
    getProductById: jest.fn(),
    getCustomerDiscounts: jest.fn(),
    getInventoryDiscounts: jest.fn(),
    getBogoPromotions: jest.fn(),
  },
}))

// Mock the API utils
jest.mock("@/lib/api/utils", () => ({
  createApiResponse: jest.fn((data, message, success = true) => ({ data, message, success })),
  handleApiError: jest.fn((error) => ({ error: error.message, success: false })),
}))

const mockDb = require("@/lib/api/database").db

describe("/api/discounts/validate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST endpoint", () => {
    it("should validate required fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain("Customer ID and Market are required")
    })

    it("should require either productId or products array", async () => {
      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({
          customerId: "cust-1",
          market: "CA",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain("Either productId or products array is required")
    })

    it("should handle customer not found", async () => {
      mockDb.getCustomerById.mockRejectedValue(new Error("Customer not found"))

      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({
          customerId: "invalid-customer",
          productId: "prod-1",
          market: "CA",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.message).toBe("Customer not found")
    })

    it("should handle single product validation successfully", async () => {
      const mockCustomer = { id: "cust-1", name: "Test Customer", tier: "A" }
      const mockProduct = { id: "prod-1", name: "Test Product", basePrice: 100 }

      mockDb.getCustomerById.mockResolvedValue(mockCustomer)
      mockDb.getProductById.mockResolvedValue(mockProduct)
      mockDb.getCustomerDiscounts.mockResolvedValue([])
      mockDb.getInventoryDiscounts.mockResolvedValue([])
      mockDb.getBogoPromotions.mockResolvedValue([])

      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({
          customerId: "cust-1",
          productId: "prod-1",
          market: "CA",
          quantity: 2,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.customer).toEqual(mockCustomer)
      expect(data.data.calculations).toBeDefined()
      expect(data.data.summary).toBeDefined()
    })

    it("should handle multiple products validation", async () => {
      const mockCustomer = { id: "cust-1", name: "Test Customer", tier: "A" }
      const mockProduct = { id: "prod-1", name: "Test Product", basePrice: 100 }

      mockDb.getCustomerById.mockResolvedValue(mockCustomer)
      mockDb.getProductById.mockResolvedValue(mockProduct)
      mockDb.getCustomerDiscounts.mockResolvedValue([])
      mockDb.getInventoryDiscounts.mockResolvedValue([])
      mockDb.getBogoPromotions.mockResolvedValue([])

      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({
          customerId: "cust-1",
          products: [
            { id: "prod-1", quantity: 2 },
            { id: "prod-2", quantity: 1 },
          ],
          market: "CA",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockDb.getProductById).toHaveBeenCalledTimes(2)
    })

    it("should handle database errors gracefully", async () => {
      mockDb.getCustomerById.mockRejectedValue(new Error("Database connection failed"))

      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({
          customerId: "cust-1",
          productId: "prod-1",
          market: "CA",
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(404)
    })

    it("should handle malformed JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: "invalid json",
      })

      const response = await POST(request)
      expect(response.status).toBeGreaterThanOrEqual(400)
    })

    it("should handle empty request body", async () => {
      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: "",
      })

      const response = await POST(request)
      expect(response.status).toBeGreaterThanOrEqual(400)
    })

    it("should handle very large quantities", async () => {
      const mockCustomer = { id: "cust-1", name: "Test Customer", tier: "A" }
      const mockProduct = { id: "prod-1", name: "Test Product", basePrice: 100 }

      mockDb.getCustomerById.mockResolvedValue(mockCustomer)
      mockDb.getProductById.mockResolvedValue(mockProduct)
      mockDb.getCustomerDiscounts.mockResolvedValue([])
      mockDb.getInventoryDiscounts.mockResolvedValue([])
      mockDb.getBogoPromotions.mockResolvedValue([])

      const request = new NextRequest("http://localhost:3000/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({
          customerId: "cust-1",
          productId: "prod-1",
          market: "CA",
          quantity: 999999,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.summary.totalOriginalPrice).toBe(99999900000) // 999999 * 100
    })
  })

  describe("GET endpoint", () => {
    it("should validate required query parameters", async () => {
      const request = new NextRequest("http://localhost:3000/api/discounts/validate")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain("Customer ID and Market are required")
    })

    it("should return discount summary successfully", async () => {
      const mockCustomer = { id: "cust-1", name: "Test Customer", tier: "A" }

      mockDb.getCustomerById.mockResolvedValue(mockCustomer)
      mockDb.getCustomerDiscounts.mockResolvedValue([
        { status: "active", customerTiers: ["A"], markets: ["CA"] },
        { status: "active", customerTiers: ["B"], markets: ["CA"] },
      ])
      mockDb.getInventoryDiscounts.mockResolvedValue([{ status: "active" }, { status: "inactive" }])

      const request = new NextRequest("http://localhost:3000/api/discounts/validate?customerId=cust-1&market=CA")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.discountSummary.customerDiscounts).toBe(1) // Only tier A discount
      expect(data.data.discountSummary.inventoryDiscounts).toBe(1) // Only active discount
    })

    it("should handle customer not found in GET", async () => {
      mockDb.getCustomerById.mockRejectedValue(new Error("Customer not found"))

      const request = new NextRequest("http://localhost:3000/api/discounts/validate?customerId=invalid&market=CA")

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.message).toBe("Customer not found")
    })
  })
})
