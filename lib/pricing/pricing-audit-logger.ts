/**
 * Pricing Audit Logger
 *
 * This module provides comprehensive audit logging for all pricing calculations.
 * All pricing decisions are logged to the audit_logs table for compliance,
 * debugging, and analytics purposes.
 *
 * Task: TM-027 - Add audit logging for pricing calculations
 */

import { createClient } from "@/lib/supabase/server"

// Audit log types for pricing events
export type PricingAuditEventType =
  | "pricing_calculation"
  | "discount_applied"
  | "discount_evaluation"
  | "tier_assignment_check"
  | "pricing_error"

export type PricingAuditSeverity = "critical" | "high" | "medium" | "low" | "info"
export type PricingAuditStatus = "success" | "failure" | "warning"

export interface PricingAuditLogData {
  eventType: PricingAuditEventType
  customerId: string
  productId?: string
  quantity?: number
  basePrice?: number
  finalPrice?: number
  discountAmount?: number
  discountPercentage?: number
  ruleId?: string
  ruleName?: string
  tierName?: string
  calculationDetails?: Record<string, any>
  evaluatedDiscounts?: Array<{
    ruleId: string
    ruleName: string
    tierName: string
    discountAmount: number
    savings: number
  }>
  selectionReason?: string
  errorMessage?: string
  severity?: PricingAuditSeverity
  status?: PricingAuditStatus
  metadata?: Record<string, any>
}

/**
 * Log a pricing calculation event to the audit_logs table
 */
export async function logPricingCalculation(data: PricingAuditLogData): Promise<void> {
  try {
    const supabase = await createClient()

    // Get current user if available
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Prepare audit log entry
    const auditLog = {
      event_type: data.eventType,
      event_category: "business",
      event_action: "calculate",
      resource_type: "pricing",
      resource_id: `${data.customerId}:${data.productId || "bulk"}`,
      user_id: user?.id || null,
      user_email: user?.email || null,
      event_data: {
        customer_id: data.customerId,
        product_id: data.productId,
        quantity: data.quantity,
        base_price: data.basePrice,
        final_price: data.finalPrice,
        discount_amount: data.discountAmount,
        discount_percentage: data.discountPercentage,
        rule_id: data.ruleId,
        rule_name: data.ruleName,
        tier_name: data.tierName,
        calculation_details: data.calculationDetails,
        evaluated_discounts: data.evaluatedDiscounts,
        selection_reason: data.selectionReason,
      },
      severity: data.severity || "info",
      status: data.status || "success",
      error_message: data.errorMessage || null,
      metadata: {
        ...data.metadata,
        timestamp: new Date().toISOString(),
        calculation_duration_ms: data.metadata?.calculationDurationMs,
      },
    }

    // Insert audit log
    const { error } = await supabase.from("audit_logs").insert(auditLog)

    if (error) {
      console.error("[TM-027] Failed to log pricing calculation:", error)
      // Don't throw - we don't want audit logging failures to break pricing
    }
  } catch (error) {
    console.error("[TM-027] Error in pricing audit logger:", error)
    // Don't throw - we don't want audit logging failures to break pricing
  }
}

/**
 * Log a successful pricing calculation
 */
export async function logSuccessfulPricing(data: {
  customerId: string
  productId: string
  quantity: number
  basePrice: number
  finalPrice: number
  discountAmount: number
  discountPercentage: number
  ruleId?: string
  ruleName?: string
  tierName?: string
  evaluatedDiscounts?: Array<any>
  selectionReason?: string
  calculationDurationMs?: number
}): Promise<void> {
  await logPricingCalculation({
    eventType: "pricing_calculation",
    customerId: data.customerId,
    productId: data.productId,
    quantity: data.quantity,
    basePrice: data.basePrice,
    finalPrice: data.finalPrice,
    discountAmount: data.discountAmount,
    discountPercentage: data.discountPercentage,
    ruleId: data.ruleId,
    ruleName: data.ruleName,
    tierName: data.tierName,
    evaluatedDiscounts: data.evaluatedDiscounts,
    selectionReason: data.selectionReason,
    severity: "info",
    status: "success",
    metadata: {
      calculationDurationMs: data.calculationDurationMs,
    },
  })
}

/**
 * Log a pricing calculation error
 */
export async function logPricingError(data: {
  customerId: string
  productId?: string
  quantity?: number
  errorMessage: string
  errorDetails?: Record<string, any>
}): Promise<void> {
  await logPricingCalculation({
    eventType: "pricing_error",
    customerId: data.customerId,
    productId: data.productId,
    quantity: data.quantity,
    errorMessage: data.errorMessage,
    severity: "high",
    status: "failure",
    metadata: data.errorDetails,
  })
}

/**
 * Log discount evaluation (when multiple discounts are being compared)
 */
export async function logDiscountEvaluation(data: {
  customerId: string
  productId: string
  quantity: number
  evaluatedDiscounts: Array<{
    ruleId: string
    ruleName: string
    tierName: string
    discountAmount: number
    savings: number
  }>
  selectedRuleId?: string
  selectionReason?: string
}): Promise<void> {
  await logPricingCalculation({
    eventType: "discount_evaluation",
    customerId: data.customerId,
    productId: data.productId,
    quantity: data.quantity,
    evaluatedDiscounts: data.evaluatedDiscounts,
    ruleId: data.selectedRuleId,
    selectionReason: data.selectionReason,
    severity: "info",
    status: "success",
    calculationDetails: {
      total_discounts_evaluated: data.evaluatedDiscounts.length,
      best_savings: Math.max(...data.evaluatedDiscounts.map((d) => d.savings), 0),
    },
  })
}

/**
 * Query pricing audit logs for a specific customer
 */
export async function getPricingAuditLogs(params: {
  customerId?: string
  productId?: string
  ruleId?: string
  startDate?: Date
  endDate?: Date
  eventType?: PricingAuditEventType
  limit?: number
}) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("audit_logs")
      .select("*")
      .eq("event_category", "business")
      .eq("resource_type", "pricing")
      .order("created_at", { ascending: false })

    if (params.customerId) {
      query = query.ilike("resource_id", `${params.customerId}:%`)
    }

    if (params.productId) {
      query = query.contains("event_data", { product_id: params.productId })
    }

    if (params.ruleId) {
      query = query.contains("event_data", { rule_id: params.ruleId })
    }

    if (params.eventType) {
      query = query.eq("event_type", params.eventType)
    }

    if (params.startDate) {
      query = query.gte("created_at", params.startDate.toISOString())
    }

    if (params.endDate) {
      query = query.lte("created_at", params.endDate.toISOString())
    }

    if (params.limit) {
      query = query.limit(params.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[TM-027] Failed to query pricing audit logs:", error)
      return { data: [], error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("[TM-027] Error querying pricing audit logs:", error)
    return { data: [], error }
  }
}

/**
 * Get pricing statistics from audit logs
 */
export async function getPricingStatistics(params: {
  customerId?: string
  startDate?: Date
  endDate?: Date
}) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("audit_logs")
      .select("event_data, created_at")
      .eq("event_category", "business")
      .eq("resource_type", "pricing")
      .eq("event_type", "pricing_calculation")
      .eq("status", "success")

    if (params.customerId) {
      query = query.ilike("resource_id", `${params.customerId}:%`)
    }

    if (params.startDate) {
      query = query.gte("created_at", params.startDate.toISOString())
    }

    if (params.endDate) {
      query = query.lte("created_at", params.endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error("[TM-027] Failed to get pricing statistics:", error)
      return null
    }

    // Calculate statistics
    const totalCalculations = data.length
    const totalDiscountAmount = data.reduce((sum, log) => sum + (log.event_data?.discount_amount || 0), 0)
    const averageDiscountPercentage =
      data.reduce((sum, log) => sum + (log.event_data?.discount_percentage || 0), 0) / totalCalculations || 0

    const discountsByRule = data.reduce(
      (acc, log) => {
        const ruleName = log.event_data?.rule_name
        if (ruleName) {
          if (!acc[ruleName]) {
            acc[ruleName] = { count: 0, totalSavings: 0 }
          }
          acc[ruleName].count++
          acc[ruleName].totalSavings += log.event_data?.discount_amount || 0
        }
        return acc
      },
      {} as Record<string, { count: number; totalSavings: number }>,
    )

    return {
      totalCalculations,
      totalDiscountAmount,
      averageDiscountPercentage,
      discountsByRule,
      periodStart: params.startDate,
      periodEnd: params.endDate,
    }
  } catch (error) {
    console.error("[TM-027] Error calculating pricing statistics:", error)
    return null
  }
}

/**
 * Get recent pricing calculations for a customer
 */
export async function getRecentPricingForCustomer(customerId: string, limit = 10) {
  return getPricingAuditLogs({
    customerId,
    eventType: "pricing_calculation",
    limit,
  })
}

/**
 * Get all pricing calculations for a specific product
 */
export async function getPricingHistoryForProduct(productId: string, limit = 50) {
  return getPricingAuditLogs({
    productId,
    eventType: "pricing_calculation",
    limit,
  })
}

/**
 * Get pricing errors for debugging
 */
export async function getPricingErrors(params: { startDate?: Date; endDate?: Date; limit?: number }) {
  return getPricingAuditLogs({
    ...params,
    eventType: "pricing_error",
  })
}
