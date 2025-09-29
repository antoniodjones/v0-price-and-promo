"use client"

interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export class PushNotificationService {
  private static instance: PushNotificationService | null = null
  private registration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService()
    }
    return PushNotificationService.instance
  }

  async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      console.log("Service Worker registered successfully")

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready

      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      throw new Error("Notifications not supported")
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  async subscribe(): Promise<PushSubscriptionData | null> {
    if (!this.registration) {
      throw new Error("Service Worker not registered")
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription()

      if (!subscription) {
        // Create new subscription
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "your-vapid-public-key",
          ),
        })
      }

      // Convert subscription to our format
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")!),
          auth: this.arrayBufferToBase64(subscription.getKey("auth")!),
        },
      }

      // Send subscription to server
      await this.sendSubscriptionToServer(subscriptionData)

      return subscriptionData
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        // Notify server about unsubscription
        await this.removeSubscriptionFromServer(subscription.endpoint)
      }
      return true
    } catch (error) {
      console.error("Failed to unsubscribe:", error)
      return false
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      return response.ok
    } catch (error) {
      console.error("Failed to send notification:", error)
      return false
    }
  }

  // Show local notification (fallback)
  showLocalNotification(payload: NotificationPayload): void {
    if (Notification.permission === "granted") {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/favicon.ico",
        badge: payload.badge || "/favicon.ico",
        tag: payload.tag,
        data: payload.data,
        requireInteraction: false,
      })
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscriptionData): Promise<void> {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error("Failed to send subscription to server:", error)
    }
  }

  private async removeSubscriptionFromServer(endpoint: string): Promise<void> {
    try {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      })
    } catch (error) {
      console.error("Failed to remove subscription from server:", error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
}

export const pushService = PushNotificationService.getInstance()
