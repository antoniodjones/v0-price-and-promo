import type { Server as HTTPServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { logger } from "@/lib/logger"
import { cache } from "@/lib/cache"

export class WebSocketServer {
  private io: SocketIOServer | null = null
  private static instance: WebSocketServer | null = null

  private constructor() {}

  static getInstance(): WebSocketServer {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer()
    }
    return WebSocketServer.instance
  }

  initialize(httpServer: HTTPServer) {
    if (this.io) {
      return this.io
    }

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_APP_URL
            : ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    })

    this.setupEventHandlers()
    logger.info("WebSocket server initialized")

    return this.io
  }

  private setupEventHandlers() {
    if (!this.io) return

    this.io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`)

      // Join customer-specific room for personalized updates
      socket.on("join-customer", (customerId: string) => {
        socket.join(`customer-${customerId}`)
        logger.info(`Client ${socket.id} joined customer room: ${customerId}`)
      })

      // Join pricing room for general pricing updates
      socket.on("join-pricing", () => {
        socket.join("pricing-updates")
        logger.info(`Client ${socket.id} joined pricing updates room`)
      })

      // Join inventory monitoring room
      socket.on("join-inventory", () => {
        socket.join("inventory-monitoring")
        logger.info(`Client ${socket.id} joined inventory monitoring room`)
      })

      // Handle pricing calculation requests
      socket.on("calculate-pricing", async (data) => {
        try {
          // Emit calculation started
          socket.emit("pricing-calculation-started", { requestId: data.requestId })

          // Simulate real-time calculation progress
          const steps = ["Validating items", "Checking discounts", "Applying rules", "Finalizing prices"]
          for (let i = 0; i < steps.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 500))
            socket.emit("pricing-calculation-progress", {
              requestId: data.requestId,
              step: i + 1,
              totalSteps: steps.length,
              message: steps[i],
            })
          }

          // Cache the result for quick access
          await cache.set(`pricing-${data.requestId}`, data, 300) // 5 minutes

          socket.emit("pricing-calculation-complete", {
            requestId: data.requestId,
            message: "Pricing calculation completed",
          })
        } catch (error) {
          socket.emit("pricing-calculation-error", {
            requestId: data.requestId,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      })

      socket.on("disconnect", () => {
        logger.info(`Client disconnected: ${socket.id}`)
      })
    })
  }

  // Broadcast pricing updates to all connected clients
  broadcastPricingUpdate(data: any) {
    if (!this.io) return
    this.io.to("pricing-updates").emit("pricing-update", data)
    logger.info("Broadcasted pricing update to all clients")
  }

  // Send customer-specific pricing updates
  sendCustomerPricingUpdate(customerId: string, data: any) {
    if (!this.io) return
    this.io.to(`customer-${customerId}`).emit("customer-pricing-update", data)
    logger.info(`Sent pricing update to customer: ${customerId}`)
  }

  // Broadcast inventory alerts
  broadcastInventoryAlert(alert: any) {
    if (!this.io) return
    this.io.to("inventory-monitoring").emit("inventory-alert", alert)
    logger.info("Broadcasted inventory alert")
  }

  // Send real-time discount notifications
  broadcastDiscountActivation(discount: any) {
    if (!this.io) return
    this.io.emit("discount-activated", discount)
    logger.info(`Broadcasted discount activation: ${discount.name}`)
  }

  getIO() {
    return this.io
  }
}

export const wsServer = WebSocketServer.getInstance()
