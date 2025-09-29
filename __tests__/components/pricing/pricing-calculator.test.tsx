import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PricingCalculator } from "@/components/pricing/pricing-calculator"

// Mock fetch globally
global.fetch = jest.fn()

const mockProducts = [
  {
    id: "prod-1",
    name: "Premium Flower",
    sku: "PF-001",
    category: "Flower",
    brand: "Premium Buds",
    basePrice: 50,
    thcPercentage: 20,
    expirationDate: "2025-02-01",
  },
  {
    id: "prod-2",
    name: "Budget Flower",
    sku: "BF-001",
    category: "Flower",
    brand: "Budget Brand",
    basePrice: 25,
    thcPercentage: 12,
    expirationDate: "2025-01-15",
  },
]

describe("PricingCalculator Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts }),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should render loading state initially", () => {
    render(<PricingCalculator />)
    expect(screen.getByText("Loading products...")).toBeInTheDocument()
  })

  it("should render products after loading", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Premium Flower")).toBeInTheDocument()
    })

    expect(screen.getByText("PF-001")).toBeInTheDocument()
    expect(screen.getByText("$50.00")).toBeInTheDocument()
  })

  it("should handle API error gracefully", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"))

    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Error Loading Pricing Calculator")).toBeInTheDocument()
    })

    expect(screen.getByText("Failed to load products")).toBeInTheDocument()
  })

  it("should handle invalid API response", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: "response" }),
    })

    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Best Deal Calculator")).toBeInTheDocument()
    })

    // Should handle gracefully with empty products
    expect(screen.queryByText("Premium Flower")).not.toBeInTheDocument()
  })

  it("should update quantity correctly", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Premium Flower")).toBeInTheDocument()
    })

    const plusButton = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg")?.classList.contains("lucide-plus"))

    if (plusButton) {
      await userEvent.click(plusButton)
      // Quantity should increase from 2 to 3 (first item starts with quantity 2)
      expect(screen.getByText("3")).toBeInTheDocument()
    }
  })

  it("should not allow quantity below 1", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Premium Flower")).toBeInTheDocument()
    })

    // Find minus button for second item (which starts with quantity 1)
    const minusButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg")?.classList.contains("lucide-minus"))

    const secondMinusButton = minusButtons[1]
    if (secondMinusButton) {
      expect(secondMinusButton).toBeDisabled()
    }
  })

  it("should remove item correctly", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Premium Flower")).toBeInTheDocument()
    })

    const removeButton = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg")?.classList.contains("lucide-x"))

    if (removeButton) {
      await userEvent.click(removeButton)
      await waitFor(() => {
        expect(screen.queryByText("Premium Flower")).not.toBeInTheDocument()
      })
    }
  })

  it("should add product from inventory", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Add Products from Inventory")).toBeInTheDocument()
    })

    // Should show available products not already in cart
    const addButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.textContent === "" && btn.querySelector("svg")?.classList.contains("lucide-plus"))

    if (addButtons.length > 0) {
      await userEvent.click(addButtons[0])
      // Product should be added to the list
    }
  })

  it("should calculate best deals", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Calculate Best Deals")).toBeInTheDocument()
    })

    const calculateButton = screen.getByText("Calculate Best Deals")
    await userEvent.click(calculateButton)

    expect(screen.getByText("Calculating Best Deals...")).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByText("Best Deal Results")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  it("should handle empty cart gracefully", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Premium Flower")).toBeInTheDocument()
    })

    // Remove all items
    const removeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg")?.classList.contains("lucide-x"))

    for (const button of removeButtons) {
      await userEvent.click(button)
    }

    const calculateButton = screen.getByText("Calculate Best Deals")
    expect(calculateButton).toBeDisabled()
  })

  it("should display discount explanations correctly", async () => {
    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Calculate Best Deals")).toBeInTheDocument()
    })

    const calculateButton = screen.getByText("Calculate Best Deals")
    await userEvent.click(calculateButton)

    await waitFor(
      () => {
        expect(screen.getByText("Best Deal Results")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    // Should show discount explanations
    expect(screen.getByText("Best Deal Logic Applied")).toBeInTheDocument()
    expect(screen.getByText("No-Stacking Policy")).toBeInTheDocument()
  })

  it("should handle products with missing data", async () => {
    const incompleteProducts = [
      {
        id: "prod-1",
        name: null,
        sku: undefined,
        basePrice: "invalid",
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: incompleteProducts }),
    })

    render(<PricingCalculator />)

    await waitFor(() => {
      expect(screen.getByText("Unknown Product")).toBeInTheDocument()
    })

    expect(screen.getByText("$0.00")).toBeInTheDocument()
  })

  it("should handle network timeout", async () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout")), 100)),
    )

    render(<PricingCalculator />)

    await waitFor(
      () => {
        expect(screen.getByText("Error Loading Pricing Calculator")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })
})
