"use client"

// React hooks for analytics integration

import { useState, useEffect } from "react"
import { analyticsIntegration, type RealtimeAnalytics, type AnalyticsEvent } from "./integration-service"

export function useRealtimeAnalytics() {
  const [analytics, setAnalytics] = useState<RealtimeAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const data = await analyticsIntegration.getRealtimeAnalytics()
        setAnalytics(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Set up polling for real-time updates
    const interval = setInterval(fetchAnalytics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const trackEvent = async (event: Omit<AnalyticsEvent, "timestamp">) => {
    try {
      await analyticsIntegration.trackDiscountEvent(event)
      // Refresh analytics after tracking
      const data = await analyticsIntegration.getRealtimeAnalytics()
      setAnalytics(data)
    } catch (err) {
      console.error("Failed to track event:", err)
    }
  }

  return {
    analytics,
    loading,
    error,
    trackEvent,
  }
}

export function useAnalyticsInsights(timeframe: "7d" | "30d" | "90d" = "30d") {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true)
        const data = await analyticsIntegration.generateInsights(timeframe)
        setInsights(data)
      } catch (error) {
        console.error("Failed to fetch insights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [timeframe])

  return { insights, loading }
}
