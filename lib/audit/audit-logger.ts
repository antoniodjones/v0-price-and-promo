import { createServerClient } from "@supabase/ssr"

export interface AuditLogEntry {
  event_type: string
  event_category: "user" | "system" | "business" | "security" | "data"
  event_action: string
  resource_type?: string
  resource_id?: string
  user_id?: string
  user_email?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  event_data?: Record<string, any>
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  severity?: "critical" | "high" | "medium" | "low" | "info"
  status?: "success" | "failure" | "warning"
  error_message?: string
  metadata?: Record<string, any>
  expires_at?: string
}

export interface AuditLogFilter {
  event_category?: string
  event_type?: string
  resource_type?: string
  user_id?: string
  severity?: string
  status?: string
  start_date?: string
  end_date?: string
  search?: string
}

export interface AuditLogStats {
  total_events: number
  events_today: number
  errors_today: number
  warnings_today: number
  unique_users_today: number
  top_event_types: Array<{ event_type: string; count: number }>
  recent_critical_events: number
  system_health_score: number
}

class AuditLogger {
  private async getSupabaseClient(cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>) {
    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })
  }

  async log(
    entry: AuditLogEntry,
    cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
  ): Promise<boolean> {
    try {
      const supabase = await this.getSupabaseClient(cookieStore)

      // Set default values
      const auditEntry = {
        ...entry,
        severity: entry.severity || "info",
        status: entry.status || "success",
        created_at: new Date().toISOString(),
        expires_at: entry.expires_at || this.getDefaultExpiryDate(entry.event_category),
      }

      const { error } = await supabase.from("audit_logs").insert([auditEntry])

      if (error) {
        console.error("Failed to log audit entry:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Audit logging error:", error)
      return false
    }
  }

  private getDefaultExpiryDate(category: string): string {
    const now = new Date()
    let daysToKeep = 90 // Default retention

    switch (category) {
      case "security":
        daysToKeep = 365 // Keep security logs for 1 year
        break
      case "user":
        daysToKeep = 180 // Keep user logs for 6 months
        break
      case "business":
        daysToKeep = 365 // Keep business logs for 1 year
        break
      case "system":
        daysToKeep = 90 // Keep system logs for 3 months
        break
      case "data":
        daysToKeep = 180 // Keep data logs for 6 months
        break
    }

    now.setDate(now.getDate() + daysToKeep)
    return now.toISOString()
  }

  async getAuditLogs(
    cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
    filter: AuditLogFilter = {},
    page = 1,
    limit = 50,
  ): Promise<{ data: any[]; total: number; pagination: any }> {
    try {
      const supabase = await this.getSupabaseClient(cookieStore)
      let query = supabase.from("audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false })

      // Apply filters
      if (filter.event_category) {
        query = query.eq("event_category", filter.event_category)
      }
      if (filter.event_type) {
        query = query.eq("event_type", filter.event_type)
      }
      if (filter.resource_type) {
        query = query.eq("resource_type", filter.resource_type)
      }
      if (filter.user_id) {
        query = query.eq("user_id", filter.user_id)
      }
      if (filter.severity) {
        query = query.eq("severity", filter.severity)
      }
      if (filter.status) {
        query = query.eq("status", filter.status)
      }
      if (filter.start_date) {
        query = query.gte("created_at", filter.start_date)
      }
      if (filter.end_date) {
        query = query.lte("created_at", filter.end_date)
      }
      if (filter.search) {
        query = query.or(
          `event_type.ilike.%${filter.search}%,user_email.ilike.%${filter.search}%,error_message.ilike.%${filter.search}%`,
        )
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      return {
        data: data || [],
        total: count || 0,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      return { data: [], total: 0, pagination: { page: 1, limit, total: 0, pages: 0 } }
    }
  }

  async getAuditStats(cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>): Promise<AuditLogStats> {
    try {
      const supabase = await this.getSupabaseClient(cookieStore)
      const today = new Date().toISOString().split("T")[0]

      // Get basic stats
      const [totalResult, todayResult, errorsResult, warningsResult, usersResult] = await Promise.all([
        supabase.from("audit_logs").select("id", { count: "exact", head: true }),
        supabase.from("audit_logs").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase
          .from("audit_logs")
          .select("id", { count: "exact", head: true })
          .eq("status", "failure")
          .gte("created_at", today),
        supabase
          .from("audit_logs")
          .select("id", { count: "exact", head: true })
          .eq("status", "warning")
          .gte("created_at", today),
        supabase
          .from("audit_logs")
          .select("user_id", { count: "exact" })
          .not("user_id", "is", null)
          .gte("created_at", today),
      ])

      const { data: topEvents } = await supabase
        .from("audit_logs")
        .select("event_type")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

      const eventTypeCounts =
        topEvents?.reduce((acc: Record<string, number>, log) => {
          acc[log.event_type] = (acc[log.event_type] || 0) + 1
          return acc
        }, {}) || {}

      const topEventTypes = Object.entries(eventTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([event_type, count]) => ({ event_type, count }))

      // Get recent critical events
      const { count: criticalCount } = await supabase
        .from("audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("severity", "critical")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

      // Calculate system health score (0-100)
      const totalEvents = todayResult.count || 0
      const errorEvents = errorsResult.count || 0
      const warningEvents = warningsResult.count || 0
      const criticalEvents = criticalCount || 0

      let healthScore = 100
      if (totalEvents > 0) {
        const errorRate = errorEvents / totalEvents
        const warningRate = warningEvents / totalEvents
        healthScore = Math.max(0, 100 - errorRate * 50 - warningRate * 20 - criticalEvents * 10)
      }

      return {
        total_events: totalResult.count || 0,
        events_today: todayResult.count || 0,
        errors_today: errorsResult.count || 0,
        warnings_today: warningsResult.count || 0,
        unique_users_today: usersResult.count || 0,
        top_event_types: topEventTypes,
        recent_critical_events: criticalCount || 0,
        system_health_score: Math.round(healthScore),
      }
    } catch (error) {
      console.error("Error fetching audit stats:", error)
      return {
        total_events: 0,
        events_today: 0,
        errors_today: 0,
        warnings_today: 0,
        unique_users_today: 0,
        top_event_types: [],
        recent_critical_events: 0,
        system_health_score: 0,
      }
    }
  }

  async cleanupExpiredLogs(cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>): Promise<number> {
    try {
      const supabase = await this.getSupabaseClient(cookieStore)
      const { data } = await supabase.rpc("cleanup_expired_audit_logs")
      return data || 0
    } catch (error) {
      console.error("Error cleaning up expired logs:", error)
      return 0
    }
  }

  // Convenience methods for common audit events
  async logUserAction(
    cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
    action: string,
    userId: string,
    userEmail: string,
    resourceType?: string,
    resourceId?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    metadata?: Record<string, any>,
  ) {
    return this.log(
      {
        event_type: `user_${action}`,
        event_category: "user",
        event_action: action,
        resource_type: resourceType,
        resource_id: resourceId,
        user_id: userId,
        user_email: userEmail,
        old_values: oldValues,
        new_values: newValues,
        metadata,
        severity: "info",
      },
      cookieStore,
    )
  }

  async logSystemEvent(
    cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
    eventType: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    eventData?: Record<string, any>,
    severity: "critical" | "high" | "medium" | "low" | "info" = "info",
    status: "success" | "failure" | "warning" = "success",
  ) {
    return this.log(
      {
        event_type: eventType,
        event_category: "system",
        event_action: action,
        resource_type: resourceType,
        resource_id: resourceId,
        event_data: eventData,
        severity,
        status,
      },
      cookieStore,
    )
  }

  async logSecurityEvent(
    cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
    eventType: string,
    action: string,
    userId?: string,
    userEmail?: string,
    ipAddress?: string,
    userAgent?: string,
    eventData?: Record<string, any>,
    severity: "critical" | "high" | "medium" | "low" | "info" = "high",
  ) {
    return this.log(
      {
        event_type: eventType,
        event_category: "security",
        event_action: action,
        user_id: userId,
        user_email: userEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        event_data: eventData,
        severity,
      },
      cookieStore,
    )
  }

  async logBusinessEvent(
    cookieStore: Awaited<ReturnType<typeof import("next/headers").cookies>>,
    eventType: string,
    action: string,
    resourceType: string,
    resourceId: string,
    userId?: string,
    userEmail?: string,
    eventData?: Record<string, any>,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ) {
    return this.log(
      {
        event_type: eventType,
        event_category: "business",
        event_action: action,
        resource_type: resourceType,
        resource_id: resourceId,
        user_id: userId,
        user_email: userEmail,
        event_data: eventData,
        old_values: oldValues,
        new_values: newValues,
        severity: "info",
      },
      cookieStore,
    )
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger()
