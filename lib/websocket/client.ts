"use client"

import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { logger } from "@/lib/logger"

interface UseWebSocketOptions {
  customerId?: string
  enablePricing?: boolean
  enableInventory?: boolean
}

interface PricingCalculationProgress {
  requestId: string
  step: number
  totalSteps: number
  message: string
}

interface WebSocketState {
  connected: boolean
  error: string | null
  pricingUpdates: any[]
  inventoryAlerts: any[]
  calculationProgress: PricingCalculationProgress | null
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null)
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    error: null,
    pricingUpdates: [],
    inventoryAlerts: [],
    calculationProgress: null,
  })

  useEffect(() => {
    // Initialize socket connection
    const socketUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        : "http://localhost:3000"

    socketRef.current = io(socketUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    })

    const socket = socketRef.current

    // Connection event handlers
    socket.on("connect", () => {
      logger.info("WebSocket connected")
      setState((prev) => ({ ...prev, connected: true, error: null }))

      // Join rooms based on options
      if (options.customerId) {
        socket.emit("join-customer", options.customerId)
      }
      if (options.enablePricing) {
        socket.emit("join-pricing")
      }
      if (options.enableInventory) {
        socket.emit("join-inventory")
      }
    })

    socket.on("disconnect", () => {
      logger.info("WebSocket disconnected")
      setState((prev) => ({ ...prev, connected: false }))
    })

    socket.on("connect_error", (error) => {
      logger.error("WebSocket connection error:", error)
      setState((prev) => ({ ...prev, error: error.message, connected: false }))
    })

    // Pricing event handlers
    socket.on("pricing-update", (data) => {
      setState((prev) => ({
        ...prev,
        pricingUpdates: [data, ...prev.pricingUpdates.slice(0, 9)], // Keep last 10
      }))
    })

    socket.on("customer-pricing-update", (data) => {
      setState((prev) => ({
        ...prev,
        pricingUpdates: [{ ...data, isPersonalized: true }, ...prev.pricingUpdates.slice(0, 9)],
      }))
    })

    socket.on("pricing-calculation-started", (data) => {
      setState((prev) => ({
        ...prev,
        calculationProgress: { ...data, step: 0, totalSteps: 4, message: "Starting calculation..." },
      }))
    })

    socket.on("pricing-calculation-progress", (data: PricingCalculationProgress) => {
      setState((prev) => ({ ...prev, calculationProgress: data }))
    })

    socket.on("pricing-calculation-complete", () => {
      setState((prev) => ({ ...prev, calculationProgress: null }))
    })

    socket.on("pricing-calculation-error", (data) => {
      setState((prev) => ({ ...prev, calculationProgress: null, error: data.error }))
    })

    // Inventory event handlers
    socket.on("inventory-alert", (alert) => {
      setState((prev) => ({
        ...prev,
        inventoryAlerts: [alert, ...prev.inventoryAlerts.slice(0, 19)], // Keep last 20
      }))
    })

    socket.on("discount-activated", (discount) => {
      setState((prev) => ({
        ...prev,
        pricingUpdates: [
          {
            type: "discount-activation",
            discount,
            timestamp: new Date().toISOString(),
          },
          ...prev.pricingUpdates.slice(0, 9),
        ],
      }))
    })

    return () => {
      socket.disconnect()
    }
  }, [options.customerId, options.enablePricing, options.enableInventory])

  // Helper functions
  const calculatePricing = (data: any) => {
    if (!socketRef.current?.connected) return

    const requestId = `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    socketRef.current.emit("calculate-pricing", { ...data, requestId })
    return requestId
  }

  const clearPricingUpdates = () => {
    setState((prev) => ({ ...prev, pricingUpdates: [] }))
  }

  const clearInventoryAlerts = () => {
    setState((prev) => ({ ...prev, inventoryAlerts: [] }))
  }

  return {
    ...state,
    calculatePricing,
    clearPricingUpdates,
    clearInventoryAlerts,
    socket: socketRef.current,
  }
}
