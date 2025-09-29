export interface PriceHistoryEntry {
  id: string
  productId: string
  customerId?: string
  originalPrice: number
  finalPrice: number
  discountAmount: number
  appliedRules: string[] // Rule IDs
  context: {
    market: string
    orderQuantity: number
    customerTier: string
    timestamp: string
  }
  metadata?: Record<string, any>
}

export interface PriceAuditTrail {
  entries: PriceHistoryEntry[]
  totalEntries: number
  dateRange: {
    from: string
    to: string
  }
  summary: {
    totalSavings: number
    averageDiscount: number
    mostUsedRules: Array<{ ruleId: string; count: number }>
  }
}

/**
 * Pure function to create a price history entry
 */
export function createPriceHistoryEntry(
  productId: string,
  originalPrice: number,
  finalPrice: number,
  appliedRules: string[],
  context: Partial<PriceHistoryEntry["context"]>,
  customerId?: string,
  metadata?: Record<string, any>,
): PriceHistoryEntry {
  try {
    return {
      id: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: String(productId || ""),
      customerId: customerId ? String(customerId) : undefined,
      originalPrice: typeof originalPrice === "number" ? originalPrice : 0,
      finalPrice: typeof finalPrice === "number" ? finalPrice : 0,
      discountAmount: Math.max(0, (originalPrice || 0) - (finalPrice || 0)),
      appliedRules: Array.isArray(appliedRules) ? appliedRules.filter(Boolean) : [],
      context: {
        market: String(context.market || ""),
        orderQuantity: typeof context.orderQuantity === "number" ? context.orderQuantity : 0,
        customerTier: String(context.customerTier || ""),
        timestamp: context.timestamp || new Date().toISOString(),
      },
      metadata: metadata || {},
    }
  } catch (error) {
    console.error("[v0] Error creating price history entry:", error)
    return {
      id: `error_${Date.now()}`,
      productId: String(productId || ""),
      customerId,
      originalPrice: 0,
      finalPrice: 0,
      discountAmount: 0,
      appliedRules: [],
      context: {
        market: "",
        orderQuantity: 0,
        customerTier: "",
        timestamp: new Date().toISOString(),
      },
      metadata: { error: "Failed to create entry" },
    }
  }
}

/**
 * Analyze price history entries to generate audit trail
 */
export function generatePriceAuditTrail(
  entries: PriceHistoryEntry[],
  filters?: {
    productId?: string
    customerId?: string
    dateFrom?: string
    dateTo?: string
    market?: string
  },
): PriceAuditTrail {
  try {
    // Validate and filter entries
    const validEntries = Array.isArray(entries) ? entries.filter(Boolean) : []

    let filteredEntries = validEntries

    if (filters) {
      filteredEntries = validEntries.filter((entry) => {
        try {
          if (filters.productId && entry.productId !== filters.productId) return false
          if (filters.customerId && entry.customerId !== filters.customerId) return false
          if (filters.market && entry.context?.market !== filters.market) return false

          if (filters.dateFrom || filters.dateTo) {
            const entryDate = new Date(entry.context?.timestamp || 0)
            if (filters.dateFrom && entryDate < new Date(filters.dateFrom)) return false
            if (filters.dateTo && entryDate > new Date(filters.dateTo)) return false
          }

          return true
        } catch {
          return false
        }
      })
    }

    // Calculate summary statistics
    const totalSavings = filteredEntries.reduce((sum, entry) => {
      try {
        return sum + (entry.discountAmount || 0)
      } catch {
        return sum
      }
    }, 0)

    const averageDiscount =
      filteredEntries.length > 0
        ? filteredEntries.reduce((sum, entry) => {
            try {
              const discount = entry.originalPrice > 0 ? ((entry.discountAmount || 0) / entry.originalPrice) * 100 : 0
              return sum + discount
            } catch {
              return sum
            }
          }, 0) / filteredEntries.length
        : 0

    // Count rule usage
    const ruleUsage = new Map<string, number>()
    filteredEntries.forEach((entry) => {
      try {
        if (Array.isArray(entry.appliedRules)) {
          entry.appliedRules.forEach((ruleId) => {
            if (typeof ruleId === "string" && ruleId.trim()) {
              ruleUsage.set(ruleId, (ruleUsage.get(ruleId) || 0) + 1)
            }
          })
        }
      } catch {
        // Skip invalid entries
      }
    })

    const mostUsedRules = Array.from(ruleUsage.entries())
      .map(([ruleId, count]) => ({ ruleId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Determine date range
    const timestamps = filteredEntries
      .map((entry) => entry.context?.timestamp)
      .filter(Boolean)
      .sort()

    const dateRange = {
      from: timestamps[0] || new Date().toISOString(),
      to: timestamps[timestamps.length - 1] || new Date().toISOString(),
    }

    return {
      entries: filteredEntries,
      totalEntries: filteredEntries.length,
      dateRange,
      summary: {
        totalSavings,
        averageDiscount,
        mostUsedRules,
      },
    }
  } catch (error) {
    console.error("[v0] Error generating price audit trail:", error)
    return {
      entries: [],
      totalEntries: 0,
      dateRange: {
        from: new Date().toISOString(),
        to: new Date().toISOString(),
      },
      summary: {
        totalSavings: 0,
        averageDiscount: 0,
        mostUsedRules: [],
      },
    }
  }
}

/**
 * Export price history data for compliance reporting
 */
export function exportPriceHistoryForCompliance(auditTrail: PriceAuditTrail, format: "csv" | "json" = "json"): string {
  try {
    if (format === "csv") {
      const headers = [
        "Entry ID",
        "Product ID",
        "Customer ID",
        "Original Price",
        "Final Price",
        "Discount Amount",
        "Applied Rules",
        "Market",
        "Order Quantity",
        "Customer Tier",
        "Timestamp",
      ]

      const rows = auditTrail.entries.map((entry) => [
        entry.id || "",
        entry.productId || "",
        entry.customerId || "",
        (entry.originalPrice || 0).toFixed(2),
        (entry.finalPrice || 0).toFixed(2),
        (entry.discountAmount || 0).toFixed(2),
        (entry.appliedRules || []).join("; "),
        entry.context?.market || "",
        entry.context?.orderQuantity || 0,
        entry.context?.customerTier || "",
        entry.context?.timestamp || "",
      ])

      return [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")
    } else {
      return JSON.stringify(auditTrail, null, 2)
    }
  } catch (error) {
    console.error("[v0] Error exporting price history:", error)
    return format === "csv" ? "Error,exporting,data" : '{"error": "Failed to export data"}'
  }
}
