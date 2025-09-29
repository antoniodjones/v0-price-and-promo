"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { ProductEntity } from "../domain/entities/product"
import type { CustomerEntity } from "../domain/entities/customer"

interface AppState {
  // Products
  products: ProductEntity[]
  selectedProducts: ProductEntity[]
  productsLoading: boolean
  productsError: string | null

  // Customers
  customers: CustomerEntity[]
  selectedCustomer: CustomerEntity | null
  customersLoading: boolean
  customersError: string | null

  // UI State
  sidebarOpen: boolean
  isMobileSidebarOpen: boolean
  currentPage: string
  notifications: Notification[]

  // Pricing
  pricingResults: PricingResult[]
  pricingLoading: boolean
  pricingError: string | null
}

interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: number
  read: boolean
}

interface PricingResult {
  productId: string
  customerId: string
  finalPrice: number
  savings: number
  appliedDiscount?: string
  explanation: string
}

type AppAction =
  // Product actions
  | { type: "SET_PRODUCTS"; payload: ProductEntity[] }
  | { type: "ADD_PRODUCT"; payload: ProductEntity }
  | { type: "UPDATE_PRODUCT"; payload: ProductEntity }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "SELECT_PRODUCT"; payload: ProductEntity }
  | { type: "DESELECT_PRODUCT"; payload: string }
  | { type: "CLEAR_SELECTED_PRODUCTS" }
  | { type: "SET_PRODUCTS_LOADING"; payload: boolean }
  | { type: "SET_PRODUCTS_ERROR"; payload: string | null }

  // Customer actions
  | { type: "SET_CUSTOMERS"; payload: CustomerEntity[] }
  | { type: "ADD_CUSTOMER"; payload: CustomerEntity }
  | { type: "UPDATE_CUSTOMER"; payload: CustomerEntity }
  | { type: "DELETE_CUSTOMER"; payload: string }
  | { type: "SELECT_CUSTOMER"; payload: CustomerEntity | null }
  | { type: "SET_CUSTOMERS_LOADING"; payload: boolean }
  | { type: "SET_CUSTOMERS_ERROR"; payload: string | null }

  // UI actions
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "TOGGLE_MOBILE_SIDEBAR" }
  | { type: "SET_MOBILE_SIDEBAR_OPEN"; payload: boolean }
  | { type: "SET_CURRENT_PAGE"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "timestamp" | "read"> }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }

  // Pricing actions
  | { type: "SET_PRICING_RESULTS"; payload: PricingResult[] }
  | { type: "ADD_PRICING_RESULT"; payload: PricingResult }
  | { type: "CLEAR_PRICING_RESULTS" }
  | { type: "SET_PRICING_LOADING"; payload: boolean }
  | { type: "SET_PRICING_ERROR"; payload: string | null }

const initialState: AppState = {
  products: [],
  selectedProducts: [],
  productsLoading: false,
  productsError: null,

  customers: [],
  selectedCustomer: null,
  customersLoading: false,
  customersError: null,

  sidebarOpen: true,
  isMobileSidebarOpen: false,
  currentPage: "dashboard",
  notifications: [],

  pricingResults: [],
  pricingLoading: false,
  pricingError: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Product cases
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, productsError: null }

    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] }

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)),
        selectedProducts: state.selectedProducts.map((p) => (p.id === action.payload.id ? action.payload : p)),
      }

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        selectedProducts: state.selectedProducts.filter((p) => p.id !== action.payload),
      }

    case "SELECT_PRODUCT":
      if (state.selectedProducts.some((p) => p.id === action.payload.id)) {
        return state
      }
      return { ...state, selectedProducts: [...state.selectedProducts, action.payload] }

    case "DESELECT_PRODUCT":
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter((p) => p.id !== action.payload),
      }

    case "CLEAR_SELECTED_PRODUCTS":
      return { ...state, selectedProducts: [] }

    case "SET_PRODUCTS_LOADING":
      return { ...state, productsLoading: action.payload }

    case "SET_PRODUCTS_ERROR":
      return { ...state, productsError: action.payload, productsLoading: false }

    // Customer cases
    case "SET_CUSTOMERS":
      return { ...state, customers: action.payload, customersError: null }

    case "ADD_CUSTOMER":
      return { ...state, customers: [action.payload, ...state.customers] }

    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((c) => (c.id === action.payload.id ? action.payload : c)),
        selectedCustomer: state.selectedCustomer?.id === action.payload.id ? action.payload : state.selectedCustomer,
      }

    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter((c) => c.id !== action.payload),
        selectedCustomer: state.selectedCustomer?.id === action.payload ? null : state.selectedCustomer,
      }

    case "SELECT_CUSTOMER":
      return { ...state, selectedCustomer: action.payload }

    case "SET_CUSTOMERS_LOADING":
      return { ...state, customersLoading: action.payload }

    case "SET_CUSTOMERS_ERROR":
      return { ...state, customersError: action.payload, customersLoading: false }

    // UI cases
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload }

    case "TOGGLE_MOBILE_SIDEBAR":
      return { ...state, isMobileSidebarOpen: !state.isMobileSidebarOpen }

    case "SET_MOBILE_SIDEBAR_OPEN":
      return { ...state, isMobileSidebarOpen: action.payload }

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: Date.now(),
            read: false,
          },
          ...state.notifications,
        ],
      }

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      }

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] }

    // Pricing cases
    case "SET_PRICING_RESULTS":
      return { ...state, pricingResults: action.payload, pricingError: null }

    case "ADD_PRICING_RESULT":
      return {
        ...state,
        pricingResults: [
          action.payload,
          ...state.pricingResults.filter(
            (r) => !(r.productId === action.payload.productId && r.customerId === action.payload.customerId),
          ),
        ],
      }

    case "CLEAR_PRICING_RESULTS":
      return { ...state, pricingResults: [] }

    case "SET_PRICING_LOADING":
      return { ...state, pricingLoading: action.payload }

    case "SET_PRICING_ERROR":
      return { ...state, pricingError: action.payload, pricingLoading: false }

    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  isMobileSidebarOpen: boolean
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const toggleMobileSidebar = () => dispatch({ type: "TOGGLE_MOBILE_SIDEBAR" })
  const closeMobileSidebar = () => dispatch({ type: "SET_MOBILE_SIDEBAR_OPEN", payload: false })

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        toggleMobileSidebar,
        closeMobileSidebar,
        isMobileSidebarOpen: state.isMobileSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
