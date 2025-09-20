import type { NextRequest } from "next/server"
import { wsServer } from "@/lib/websocket/server"

export async function GET(request: NextRequest) {
  // This endpoint is used to initialize WebSocket server
  // The actual WebSocket connection is handled by the server setup

  return new Response("WebSocket server endpoint", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}

// Trigger real-time pricing update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data, customerId } = body

    switch (type) {
      case "pricing-update":
        if (customerId) {
          wsServer.sendCustomerPricingUpdate(customerId, data)
        } else {
          wsServer.broadcastPricingUpdate(data)
        }
        break

      case "inventory-alert":
        wsServer.broadcastInventoryAlert(data)
        break

      case "discount-activation":
        wsServer.broadcastDiscountActivation(data)
        break

      default:
        return new Response("Invalid update type", { status: 400 })
    }

    return new Response("Update broadcasted", { status: 200 })
  } catch (error) {
    return new Response("Failed to broadcast update", { status: 500 })
  }
}
