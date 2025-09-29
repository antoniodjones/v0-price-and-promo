"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PushNotificationManagerProps {
  className?: string
}

export function PushNotificationManager({ className }: PushNotificationManagerProps) {
  const { addNotification } = useNotifications()
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported("Notification" in window && "serviceWorker" in navigator)

    if ("Notification" in window) {
      setPermission(Notification.permission)
      setIsEnabled(Notification.permission === "granted")
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      setIsEnabled(result === "granted")

      if (result === "granted") {
        // Register service worker for push notifications
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register("/sw.js")
          console.log("Service Worker registered:", registration)
        }

        addNotification({
          type: "success",
          title: "Push Notifications Enabled",
          message: "You'll now receive real-time notifications from the GTI Pricing Engine.",
        })

        // Send a test notification
        setTimeout(() => {
          sendTestNotification()
        }, 2000)
      } else {
        addNotification({
          type: "warning",
          title: "Push Notifications Blocked",
          message: "You can enable them later in your browser settings.",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      addNotification({
        type: "error",
        title: "Permission Error",
        message: "Failed to request notification permission.",
      })
    }
  }

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("GTI Pricing Engine", {
        body: "Push notifications are now active! You'll receive real-time updates.",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test-notification",
        requireInteraction: false,
      })
    }
  }

  const disableNotifications = () => {
    setIsEnabled(false)
    addNotification({
      type: "info",
      title: "Push Notifications Disabled",
      message: "You can re-enable them anytime from the notification settings.",
    })
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return { status: "Enabled", color: "bg-green-500", icon: CheckCircle }
      case "denied":
        return { status: "Blocked", color: "bg-red-500", icon: AlertCircle }
      default:
        return { status: "Not Set", color: "bg-gray-500", icon: Bell }
    }
  }

  const permissionStatus = getPermissionStatus()
  const StatusIcon = permissionStatus.icon

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Push Notifications</span>
          <Badge className={`${permissionStatus.color} text-white`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {permissionStatus.status}
          </Badge>
        </CardTitle>
        <CardDescription>Receive real-time notifications even when the app is closed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">Push notifications are not supported in this browser.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about pricing updates, system alerts, and important events
                </p>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestPermission()
                  } else {
                    disableNotifications()
                  }
                }}
                disabled={permission === "denied"}
              />
            </div>

            {permission === "denied" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Notifications are blocked</p>
                    <p className="text-sm text-red-700 mt-1">
                      To enable notifications, click the lock icon in your browser's address bar and allow
                      notifications.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {permission === "granted" && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-800">Push notifications are active and working properly.</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={sendTestNotification} className="w-full bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Test Notification
                </Button>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Pricing alerts and discount notifications</p>
              <p>• System maintenance and update alerts</p>
              <p>• Important business rule changes</p>
              <p>• Inventory threshold warnings</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
