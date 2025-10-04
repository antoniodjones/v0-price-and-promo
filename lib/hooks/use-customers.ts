"use client"

import { useCallback, useEffect } from "react"
import { useAppContext } from "../context/app-context"
import { container } from "../infrastructure/dependency-injection"
import { CustomerEntity } from "../domain/entities/customer"

export function useCustomers() {
  const { state, dispatch } = useAppContext()
  const customerRepository = container.getCustomerRepository()

  const fetchCustomers = useCallback(
    async (page = 1, limit = 50) => {
      try {
        dispatch({ type: "SET_CUSTOMERS_LOADING", payload: true })
        dispatch({ type: "SET_CUSTOMERS_ERROR", payload: null })

        const { customers, total } = await customerRepository.findAll(page, limit)

        dispatch({ type: "SET_CUSTOMERS", payload: customers })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Customers Loaded",
            message: `Successfully loaded ${customers.length} customers`,
          },
        })

        return { customers, total }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch customers"
        dispatch({ type: "SET_CUSTOMERS_ERROR", payload: errorMessage })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Error Loading Customers",
            message: errorMessage,
          },
        })
        throw error
      } finally {
        dispatch({ type: "SET_CUSTOMERS_LOADING", payload: false })
      }
    },
    [customerRepository, dispatch],
  )

  const createCustomer = useCallback(
    async (customerData: Omit<CustomerEntity, "id">) => {
      try {
        const newCustomer = await customerRepository.save(
          new CustomerEntity(
            "new",
            customerData.businessLegalName,
            customerData.email,
            customerData.tier,
            customerData.market,
            customerData.status,
            customerData.totalPurchases,
          ),
        )

        dispatch({ type: "ADD_CUSTOMER", payload: newCustomer })
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "success",
            title: "Customer Created",
            message: `Successfully created ${newCustomer.businessLegalName}`,
          },
        })

        return newCustomer
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create customer"
        dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            type: "error",
            title: "Error Creating Customer",
            message: errorMessage,
          },
        })
        throw error
      }
    },
    [customerRepository, dispatch],
  )

  const selectCustomer = useCallback(
    (customer: CustomerEntity | null) => {
      dispatch({ type: "SELECT_CUSTOMER", payload: customer })
    },
    [dispatch],
  )

  const searchCustomers = useCallback(
    async (query: string) => {
      try {
        const results = await customerRepository.search(query)
        return results
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to search customers"
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
    [customerRepository, dispatch],
  )

  // Auto-fetch customers on mount
  useEffect(() => {
    if (state.customers.length === 0 && !state.customersLoading) {
      fetchCustomers()
    }
  }, [fetchCustomers, state.customers.length, state.customersLoading])

  return {
    customers: state.customers,
    selectedCustomer: state.selectedCustomer,
    loading: state.customersLoading,
    error: state.customersError,
    fetchCustomers,
    createCustomer,
    selectCustomer,
    searchCustomers,
  }
}
