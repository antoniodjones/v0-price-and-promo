"use client"

import { useState } from "react"

export default function PricingTestPage() {
  const [customerId, setCustomerId] = useState("")
  const [market, setMarket] = useState("")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testPricing = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      if (!customerId.trim() || !market.trim() || !productId.trim()) {
        throw new Error("All fields are required")
      }

      const response = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId.trim(),
          market: market.trim(),
          items: [{ productId: productId.trim(), quantity }],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.error || "API returned unsuccessful response")
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Phase 0 Pricing Test</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Test the core pricing calculation flow</p>

      <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Customer ID</label>
          <input
            type="text"
            placeholder="e.g., cust_001"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Market</label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">Select market</option>
            <option value="massachusetts">Massachusetts</option>
            <option value="california">California</option>
            <option value="colorado">Colorado</option>
            <option value="oregon">Oregon</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Product ID</label>
          <input
            type="text"
            placeholder="e.g., prod_001"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          onClick={testPricing}
          disabled={isLoading}
          style={{
            padding: "0.75rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? "Testing..." : "Test Pricing"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "4px",
            color: "#dc2626",
            marginBottom: "1rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ color: "#16a34a", marginBottom: "1rem" }}>✅ Success!</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${result.subtotal?.toFixed(2) || "0.00"}</div>
              <div style={{ fontSize: "0.875rem", color: "#666" }}>Subtotal</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#dc2626" }}>
                -${result.totalDiscount?.toFixed(2) || "0.00"}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#666" }}>Discount</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#16a34a" }}>
                ${result.finalTotal?.toFixed(2) || "0.00"}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#666" }}>Final Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
