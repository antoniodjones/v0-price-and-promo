import { jest } from "@jest/globals"

export const mockFetch = (data: any, ok = true, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  })
}

export const mockFetchError = (error: string) => {
  global.fetch = jest.fn().mockRejectedValue(new Error(error))
}

export const createMockProduct = (overrides = {}) => ({
  id: "prod-1",
  name: "Test Product",
  sku: "TEST-001",
  category: "Flower",
  brand: "Test Brand",
  basePrice: 100,
  thcPercentage: 20,
  expirationDate: "2025-02-01",
  ...overrides,
})

export const createMockCustomer = (overrides = {}) => ({
  id: "cust-1",
  name: "Test Customer",
  tier: "A",
  ...overrides,
})

export const createMockDiscount = (overrides = {}) => ({
  id: "disc-1",
  name: "Test Discount",
  type: "customer",
  discountType: "percentage",
  value: 10,
  priority: 1,
  status: "active",
  ...overrides,
})

export const waitForElement = async (getByText: any, text: string, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const checkElement = () => {
      try {
        const element = getByText(text)
        if (element) {
          resolve(element)
          return
        }
      } catch (error) {
        // Element not found yet
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Element with text "${text}" not found within ${timeout}ms`))
        return
      }

      setTimeout(checkElement, 100)
    }
    checkElement()
  })
}

export const simulateNetworkDelay = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
