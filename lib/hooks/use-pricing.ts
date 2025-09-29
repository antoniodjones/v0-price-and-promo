"use client"

import { useCallback } from "react"
import { useAppContext } from "../context/app-context"
import { container } from "../infrastructure/dependency-injection"
import type { ProductEntity } from "../domain/entities/product"
import type { CustomerEntity } from "../domain/entities/customer"

export function usePricing() {
  const { state, dispatch } = useAppContext()
  const pricingService = container.getPricingService()

  const calculatePricing = useCallback(
    async (products: ProductEntity[], customer: CustomerEntity, quantities: Record<string, number> = {}) => {
      try {
        dispatch({ type: "SET_PRICING_LOADING", payload: true })
        dispatch({ type: "SET_PRICING_ERROR", payload: null })

        const results = products.map((product) => {
          const quantity = quantities[product.id] || 1
          const calculation = pricingService.calculateBestPrice(product, customer, quantity)

          return {
            productId: product.id,
            customerId: customer.id,
            finalPrice: calculation.finalPrice,
            savings: calculation.savings,
            appliedDiscount: calculation.appliedDiscount?.name,
            explanation: calculation.explanation,
          }
        })

        dispatch({ type: "SET_PRICING_RESULTS", payload: results })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Pricing Calculated",
            message: `Calculated pricing for ${results.length} products`,
          },
        })

        return results
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to calculate pricing"
        dispatch({ type: "SET_PRICING_ERROR", payload: errorMessage })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Pricing Error",
            message: errorMessage,
          },
        })
        throw error
      } finally {
        dispatch({ type: "SET_PRICING_LOADING", payload: false })
      }
    },
    [pricingService, dispatch],
  )

  const calculateSingleProductPricing = useCallback(
    async (product: ProductEntity, customer: CustomerEntity, quantity = 1) => {
      try {
        const calculation = pricingService.calculateBestPrice(product, customer, quantity)

        const result = {
          productId: product.id,
          customerId: customer.id,
          finalPrice: calculation.finalPrice,
          savings: calculation.savings,
          appliedDiscount: calculation.appliedDiscount?.name,
          explanation: calculation.explanation,
        }

        dispatch({ type: "ADD_PRICING_RESULT", payload: result })

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to calculate pricing"
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Pricing Error",
            message: errorMessage,
          },
        })
        throw error
      }
    },
    [pricingService, dispatch],
  )

  const clearPricingResults = useCallback(() => {
    dispatch({ type: "CLEAR_PRICING_RESULTS" })
  }, [dispatch])

  return {
    pricingResults: state.pricingResults,
    loading: state.pricingLoading,
    error: state.pricingError,
    calculatePricing,
    calculateSingleProductPricing,
    clearPricingResults,
  }
}
