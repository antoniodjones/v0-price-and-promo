import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url, secret } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 })
    }

    // Create test payload
    const testPayload = {
      event: "user.test",
      timestamp: new Date().toISOString(),
      data: {
        message: "This is a test webhook from GTI Pricing Engine",
      },
    }

    // Create signature if secret is provided
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "GTI-Pricing-Engine/1.0",
    }

    if (secret) {
      const crypto = require("crypto")
      const signature = crypto.createHmac("sha256", secret).update(JSON.stringify(testPayload)).digest("hex")
      headers["X-GTI-Signature"] = `sha256=${signature}`
    }

    // Send test webhook
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`)
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      message: "Webhook test successful",
    })
  } catch (error) {
    console.error("Webhook test failed:", error)
    return NextResponse.json(
      {
        error: "Webhook test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
