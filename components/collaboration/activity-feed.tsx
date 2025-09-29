"use client"

import { useState, useEffect } from "react"
import { useWebSocket } from "@/lib/websocket/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Activity, Edit, Plus, Trash2, DollarSign, Users, Settings, AlertCircle, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityEvent {
  id: string
  type: "edit" | "create" | "delete" | "pricing" | "user" | "system" | "approval"
  action: string
  description: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: number
  metadata?: {
    entityType?: string
    entityId?: string
    oldValue?: any
    newValue?: any
    impact?: "low" | "medium" | "high"
  }
}

interface ActivityFeedProps {
  className?: string
  maxItems?: number
  showFilters?: boolean
}

export function ActivityFeed({ className, maxItems = 20, showFilters = true }: ActivityFeedProps) {
  const { connected, socket } = useWebSocket()
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    if (!socket || !connected) return

    // Join activity feed
    socket.emit("join-activity-feed")

    // Listen for new activities
    socket.on("new-activity", (activity: ActivityEvent) => {
      setActivities((prev) => [activity, ...prev.slice(0, maxItems - 1)])
    })

    // Load initial activities
    socket.emit("get-recent-activities", { limit: maxItems })
    socket.on("recent-activities", (data: { activities: ActivityEvent[] }) => {
      setActivities(data.activities)
    })

    return () => {
      socket.off("new-activity")
      socket.off("recent-activities")
      socket.emit("leave-activity-feed")
    }
  }, [socket, connected, maxItems])

  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case "create":
        return <Plus className="h-4 w-4 text-green-500" />
      case "edit":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "pricing":
        return <DollarSign className="h-4 w-4 text-purple-500" />
      case "user":
        return <Users className="h-4 w-4 text-orange-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      case "approval":
        return action.includes("approved") ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        )
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string, impact?: string) => {
    if (impact === "high") return "border-l-red-500 bg-red-50/30"
    if (impact === "medium") return "border-l-yellow-500 bg-yellow-50/30"

    switch (type) {
      case "create":
        return "border-l-green-500 bg-green-50/30"
      case "edit":
        return "border-l-blue-500 bg-blue-50/30"
      case "delete":
        return "border-l-red-500 bg-red-50/30"
      case "pricing":
        return "border-l-purple-500 bg-purple-50/30"
      case "approval":
        return "border-l-yellow-500 bg-yellow-50/30"
      default:
        return "border-l-gray-500 bg-gray-50/30"
    }
  }

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    return activity.type === filter
  })

  const filterOptions = [
    { value: "all", label: "All Activities" },
    { value: "edit", label: "Edits" },
    { value: "create", label: "Created" },
    { value: "pricing", label: "Pricing" },
    { value: "approval", label: "Approvals" },
    { value: "system", label: "System" },
  ]

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Activity className="h-4 w-4" />
              <span>Team Activity</span>
              <Badge variant="outline">{filteredActivities.length}</Badge>
            </CardTitle>
            <CardDescription>Real-time updates from your team</CardDescription>
          </div>
          {showFilters && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div
                    className={`p-3 rounded-lg border-l-4 ${getActivityColor(activity.type, activity.metadata?.impact)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getActivityIcon(activity.type, activity.action)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{activity.user.name}</span>
                          <span className="text-sm text-muted-foreground">{activity.action}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{activity.description}</p>

                        {activity.metadata && (
                          <div className="mt-2 space-y-1">
                            {activity.metadata.entityType && (
                              <Badge variant="outline" className="text-xs">
                                {activity.metadata.entityType}
                              </Badge>
                            )}
                            {activity.metadata.impact && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  activity.metadata.impact === "high"
                                    ? "border-red-500 text-red-700"
                                    : activity.metadata.impact === "medium"
                                      ? "border-yellow-500 text-yellow-700"
                                      : "border-green-500 text-green-700"
                                }`}
                              >
                                {activity.metadata.impact} impact
                              </Badge>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < filteredActivities.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
