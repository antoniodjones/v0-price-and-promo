"use client"

import { useState } from "react"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  BellRing,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
  Clock,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface NotificationCenterProps {
  className?: string
  showAsDropdown?: boolean
}

export function NotificationCenter({ className, showAsDropdown = false }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, removeNotification, clearAllNotifications } = useNotifications()
  const [filter, setFilter] = useState<"all" | "unread" | "success" | "error" | "warning" | "info">("all")
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string, read: boolean) => {
    const baseClasses = read ? "bg-gray-50/50 border-gray-200" : "bg-white border-l-4"
    switch (type) {
      case "success":
        return cn(baseClasses, !read && "border-l-green-500 bg-green-50/30")
      case "error":
        return cn(baseClasses, !read && "border-l-red-500 bg-red-50/30")
      case "warning":
        return cn(baseClasses, !read && "border-l-yellow-500 bg-yellow-50/30")
      case "info":
        return cn(baseClasses, !read && "border-l-blue-500 bg-blue-50/30")
      default:
        return cn(baseClasses, !read && "border-l-gray-500")
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
  }

  const handleRemoveNotification = (notificationId: string) => {
    removeNotification(notificationId)
  }

  const NotificationList = () => (
    <div className="space-y-2">
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{filter === "unread" ? "No unread notifications" : "No notifications"}</p>
        </div>
      ) : (
        filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-3 rounded-lg border transition-colors",
              getNotificationColor(notification.type, notification.read),
            )}
          >
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn("text-sm font-medium", notification.read && "text-muted-foreground")}>
                    {notification.title}
                  </p>
                  <div className="flex items-center space-x-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveNotification(notification.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className={cn("text-sm mt-1", notification.read ? "text-muted-foreground" : "text-gray-700")}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  if (showAsDropdown) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            {unreadCount > 0 ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="h-6 px-2 text-xs">
                  Clear all
                </Button>
              )}
            </div>
            <ScrollArea className="h-64">
              <NotificationList />
            </ScrollArea>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
            </CardTitle>
            <CardDescription>Stay updated with system alerts and important events</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>All Notifications</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>Unread Only</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("success")}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Success
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("error")}>
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Errors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("warning")}>
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                  Warnings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("info")}>
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Info
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="error">Errors</TabsTrigger>
            <TabsTrigger value="warning">Warnings</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          <TabsContent value={filter} className="mt-4">
            <ScrollArea className="h-96">
              <NotificationList />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
