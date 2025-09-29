"use client"

import { useCallback, useEffect } from "react"
import { useAppContext } from "../context/app-context"
import { container } from "../infrastructure/dependency-injection"
import { ProductEntity } from "../domain/entities/product"

export function useProducts() {
  const { state, dispatch } = useAppContext()
  const productRepository = container.getProductRepository()

  const fetchProducts = useCallback(
    async (page = 1, limit = 50) => {
      try {
        dispatch({ type: "SET_PRODUCTS_LOADING", payload: true })
        dispatch({ type: "SET_PRODUCTS_ERROR", payload: null })

        const { products, total } = await productRepository.findAll(page, limit)

        dispatch({ type: "SET_PRODUCTS", payload: products })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Products Loaded",
            message: `Successfully loaded ${products.length} products`,
          },
        })

        return { products, total }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch products"
        dispatch({ type: "SET_PRODUCTS_ERROR", payload: errorMessage })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Error Loading Products",
            message: errorMessage,
          },
        })
        throw error
      } finally {
        dispatch({ type: "SET_PRODUCTS_LOADING", payload: false })
      }
    },
    [productRepository, dispatch],
  )

  const createProduct = useCallback(
    async (productData: Omit<ProductEntity, "id">) => {
      try {
        const newProduct = await productRepository.save(
          new ProductEntity(
            "new",
            productData.name,
            productData.sku,
            productData.category,
            productData.brand,
            productData.price,
            productData.cost,
            productData.inventoryCount,
            productData.batchId,
            productData.thcPercentage,
            productData.expirationDate,
          ),
        )

        dispatch({ type: "ADD_PRODUCT", payload: newProduct })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Product Created",
            message: `Successfully created ${newProduct.name}`,
          },
        })

        return newProduct
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create product"
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Error Creating Product",
            message: errorMessage,
          },
        })
        throw error
      }
    },
    [productRepository, dispatch],
  )

  const updateProduct = useCallback(
    async (product: ProductEntity) => {
      try {
        const updatedProduct = await productRepository.save(product)

        dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Product Updated",
            message: `Successfully updated ${updatedProduct.name}`,
          },
        })

        return updatedProduct
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update product"
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Error Updating Product",
            message: errorMessage,
          },
        })
        throw error
      }
    },
    [productRepository, dispatch],
  )

  const deleteProduct = useCallback(
    async (productId: string) => {
      try {
        await productRepository.delete(productId)

        dispatch({ type: "DELETE_PRODUCT", payload: productId })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Product Deleted",
            message: "Product successfully deleted",
          },
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete product"
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Error Deleting Product",
            message: errorMessage,
          },
        })
        throw error
      }
    },
    [productRepository, dispatch],
  )

  const searchProducts = useCallback(
    async (query: string) => {
      try {
        const results = await productRepository.search(query)
        return results
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to search products"
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Search Error",
            message: errorMessage,
          },
        })
        throw error
      }
    },
    [productRepository, dispatch],
  )

  const selectProduct = useCallback(
    (product: ProductEntity) => {
      dispatch({ type: "SELECT_PRODUCT", payload: product })
    },
    [dispatch],
  )

  const deselectProduct = useCallback(
    (productId: string) => {
      dispatch({ type: "DESELECT_PRODUCT", payload: productId })
    },
    [dispatch],
  )

  const clearSelectedProducts = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTED_PRODUCTS" })
  }, [dispatch])

  // Auto-fetch products on mount
  useEffect(() => {
    if (state.products.length === 0 && !state.productsLoading) {
      fetchProducts()
    }
  }, [fetchProducts, state.products.length, state.productsLoading])

  return {
    products: state.products,
    selectedProducts: state.selectedProducts,
    loading: state.productsLoading,
    error: state.productsError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    selectProduct,
    deselectProduct,
    clearSelectedProducts,
  }
}
