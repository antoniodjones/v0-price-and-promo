import { test, expect } from "@playwright/test"

test.describe("Pricing Calculator E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing")
  })

  test("should load pricing calculator page", async ({ page }) => {
    await expect(page.getByText("Best Deal Calculator")).toBeVisible()
    await expect(page.getByText("Customer: Dispensary ABC")).toBeVisible()
  })

  test("should calculate discounts for products", async ({ page }) => {
    // Wait for products to load
    await expect(page.getByText("Calculate Best Deals")).toBeVisible()

    // Click calculate button
    await page.getByText("Calculate Best Deals").click()

    // Wait for calculation to complete
    await expect(page.getByText("Best Deal Results")).toBeVisible({ timeout: 10000 })

    // Verify results are displayed
    await expect(page.getByText("Order Summary")).toBeVisible()
    await expect(page.getByText("No-Stacking Policy")).toBeVisible()
  })

  test("should update quantities correctly", async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector("table", { timeout: 10000 })

    // Find and click plus button
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-plus") })
      .first()
    await plusButton.click()

    // Verify quantity increased
    await expect(page.locator("table")).toContainText("3")
  })

  test("should add products from inventory", async ({ page }) => {
    // Wait for inventory section to load
    await expect(page.getByText("Add Products from Inventory")).toBeVisible()

    // Find and click add button for a product
    const addButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-plus") })
      .last()
    await addButton.click()

    // Verify product was added to table
    const tableRows = page.locator("table tbody tr")
    await expect(tableRows).toHaveCount(4) // Should have 4 items now
  })

  test("should remove products correctly", async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector("table", { timeout: 10000 })

    // Count initial rows
    const initialRows = await page.locator("table tbody tr").count()

    // Find and click remove button
    const removeButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-x") })
      .first()
    await removeButton.click()

    // Verify product was removed
    const finalRows = await page.locator("table tbody tr").count()
    expect(finalRows).toBe(initialRows - 1)
  })

  test("should handle empty cart state", async ({ page }) => {
    // Remove all products
    const removeButtons = page.locator("button").filter({ has: page.locator("svg.lucide-x") })
    const count = await removeButtons.count()

    for (let i = 0; i < count; i++) {
      await removeButtons.first().click()
    }

    // Verify calculate button is disabled
    await expect(page.getByText("Calculate Best Deals")).toBeDisabled()
  })

  test("should display discount types correctly", async ({ page }) => {
    // Calculate deals first
    await page.getByText("Calculate Best Deals").click()
    await expect(page.getByText("Best Deal Results")).toBeVisible({ timeout: 10000 })

    // Check for different discount type badges
    await expect(page.locator(".bg-blue-100, .bg-orange-100, .bg-purple-100, .bg-green-100")).toHaveCount({ min: 1 })
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify page still loads and functions
    await expect(page.getByText("Best Deal Calculator")).toBeVisible()
    await expect(page.getByText("Calculate Best Deals")).toBeVisible()

    // Test mobile interactions
    await page.getByText("Calculate Best Deals").click()
    await expect(page.getByText("Best Deal Results")).toBeVisible({ timeout: 10000 })
  })

  test("should handle API errors gracefully", async ({ page }) => {
    // Intercept API calls and return error
    await page.route("/api/products-simple", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      })
    })

    await page.reload()

    // Verify error state is displayed
    await expect(page.getByText("Error Loading Pricing Calculator")).toBeVisible()
    await expect(page.getByText("Refresh Page")).toBeVisible()
  })

  test("should maintain state during interactions", async ({ page }) => {
    // Add a product
    await expect(page.getByText("Add Products from Inventory")).toBeVisible()
    const addButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-plus") })
      .last()
    await addButton.click()

    // Update quantity
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-plus") })
      .first()
    await plusButton.click()

    // Calculate deals
    await page.getByText("Calculate Best Deals").click()
    await expect(page.getByText("Best Deal Results")).toBeVisible({ timeout: 10000 })

    // Verify state is maintained in results
    await expect(page.getByText("Order Summary")).toBeVisible()
    await expect(page.locator("table tbody tr")).toHaveCount({ min: 3 })
  })
})
