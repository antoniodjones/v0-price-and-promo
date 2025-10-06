import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import webpush from "web-push"

// Configure web-push
webpush.setVapidDetails(
  "mailto:admin@gti-pricing-engine.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: messageBody, icon, tag, data, targetUserId } = body

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get push subscriptions
    let query = supabase.from("push_subscriptions").select("*")

    if (targetUserId) {
      query = query.eq("user_id", targetUserId)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error("Failed to fetch push subscriptions:", error)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No subscriptions found" }, { status: 200 })
    }

    // Prepare notification payload
    const notificationPayload = {
      title,
      body: messageBody,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
      tag: tag || "gti-notification",
      data: data || {},
      actions: [
        {
          action: "view",
          title: "View",
          icon: "/favicon.ico",
        },
        {
          action: "dismiss",
          title: "Dismiss",
          icon: "/favicon.ico",
        },
      ],
    }

    // Send notifications to all subscriptions
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh_key,
              auth: subscription.auth_key,
            },
          },
          JSON.stringify(notificationPayload),
        )
        return { success: true, endpoint: subscription.endpoint }
      } catch (error) {
        console.error(`Failed to send notification to ${subscription.endpoint}:`, error)

        // Remove invalid subscriptions
        if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint)
        }

        return { success: false, endpoint: subscription.endpoint, error }
      }
    })

    const results = await Promise.all(sendPromises)
    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      total: subscriptions.length,
    })
  } catch (error) {
    console.error("Push notification send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
