import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const timeRange = searchParams.get("timeRange") || "1h"

    // Calculate time range
    const now = new Date()
    const timeRangeMap: Record<string, number> = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    }
    const timeRangeMs = timeRangeMap[timeRange] || timeRangeMap["1h"]
    const startTime = new Date(now.getTime() - timeRangeMs)

    // Get latest metrics
    let metricsQuery = supabase
      .from("performance_metrics_detailed")
      .select("*")
      .gte("timestamp", startTime.toISOString())
      .order("timestamp", { ascending: false })

    if (category !== "all") {
      metricsQuery = metricsQuery.eq("metric_category", category)
    }

    const { data: metrics, error: metricsError } = await metricsQuery

    if (metricsError) {
      console.error("Error fetching metrics:", metricsError)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    // Get active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("performance_alerts")
      .select(`
        *,
        performance_alert_rules (
          description,
          severity
        )
      `)
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(50)

    if (alertsError) {
      console.error("Error fetching alerts:", alertsError)
      return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
    }

    // Get latest system health
    const { data: healthData, error: healthError } = await supabase
      .from("system_health_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (healthError && healthError.code !== "PGRST116") {
      console.error("Error fetching health data:", healthError)
    }

    // Group metrics by name and get latest values
    const latestMetrics = metrics?.reduce((acc: any, metric: any) => {
      if (!acc[metric.metric_name] || new Date(metric.timestamp) > new Date(acc[metric.metric_name].timestamp)) {
        acc[metric.metric_name] = metric
      }
      return acc
    }, {})

    // Get historical data for charts
    const historicalData = metrics?.reduce((acc: any, metric: any) => {
      if (!acc[metric.metric_name]) {
        acc[metric.metric_name] = []
      }
      acc[metric.metric_name].push({
        timestamp: metric.timestamp,
        value: Number.parseFloat(metric.value),
      })
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        metrics: Object.values(latestMetrics || {}),
        historicalData,
        alerts: alerts || [],
        systemHealth: healthData || {
          overall_status: "unknown",
          health_score: 0,
          active_issues: 0,
          issues_detail: [],
        },
        timeRange,
        category,
      },
    })
  } catch (error) {
    console.error("Advanced performance monitoring error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
      },
    })

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "record_metrics":
        // Record multiple metrics
        const { error: metricsError } = await supabase.from("performance_metrics_detailed").insert(data.metrics)

        if (metricsError) {
          console.error("Error recording metrics:", metricsError)
          return NextResponse.json({ error: "Failed to record metrics" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

      case "trigger_alert":
        // Trigger a new alert
        const { error: alertError } = await supabase.from("performance_alerts").insert(data.alert)

        if (alertError) {
          console.error("Error triggering alert:", alertError)
          return NextResponse.json({ error: "Failed to trigger alert" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

      case "resolve_alert":
        // Resolve an alert
        const { error: resolveError } = await supabase
          .from("performance_alerts")
          .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
          })
          .eq("id", data.alertId)

        if (resolveError) {
          console.error("Error resolving alert:", resolveError)
          return NextResponse.json({ error: "Failed to resolve alert" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

      case "update_health":
        // Update system health snapshot
        const { error: healthError } = await supabase.from("system_health_snapshots").insert(data.health)

        if (healthError) {
          console.error("Error updating health:", healthError)
          return NextResponse.json({ error: "Failed to update health" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Advanced performance monitoring POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
