"use client"

import { useState, useEffect } from "react"
import { useWebSocket } from "@/lib/websocket/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, Eye, Edit, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: "online" | "away" | "offline"
  lastSeen: number
  currentPage?: string
  currentAction?: string
}

interface UserPresenceProps {
  currentPage: string
  currentAction?: string
  className?: string
}

export function UserPresence({ currentPage, currentAction, className }: UserPresenceProps) {
  const { connected, socket } = useWebSocket()
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (!socket || !connected) return

    // Join presence room
    socket.emit("join-presence", { page: currentPage, action: currentAction })

    // Listen for presence updates
    socket.on("presence-update", (data: { users: User[] }) => {
      setUsers(data.users.filter((user) => user.id !== currentUser?.id))
    })

    socket.on("user-joined", (user: User) => {
      setUsers((prev) => {
        const filtered = prev.filter((u) => u.id !== user.id)
        return [...filtered, user]
      })
    })

    socket.on("user-left", (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    })

    socket.on("user-action-changed", (data: { userId: string; action: string; page: string }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === data.userId
            ? { ...user, currentAction: data.action, currentPage: data.page, lastSeen: Date.now() }
            : user,
        ),
      )
    })

    return () => {
      socket.off("presence-update")
      socket.off("user-joined")
      socket.off("user-left")
      socket.off("user-action-changed")
      socket.emit("leave-presence")
    }
  }, [socket, connected, currentPage, currentAction, currentUser?.id])

  // Update current action when it changes
  useEffect(() => {
    if (socket && connected && currentAction) {
      socket.emit("update-action", { page: currentPage, action: currentAction })
    }
  }, [socket, connected, currentPage, currentAction])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getActionIcon = (action?: string) => {
    switch (action) {
      case "editing":
        return <Edit className="h-3 w-3" />
      case "viewing":
        return <Eye className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const onlineUsers = users.filter((user) => user.status === "online")
  const awayUsers = users.filter((user) => user.status === "away")

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Users className="h-4 w-4" />
          <span>Team Presence</span>
          <Badge variant="outline">{users.length} active</Badge>
        </CardTitle>
        <CardDescription>See who's working on what in real-time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No other team members online</p>
          </div>
        ) : (
          <div className="space-y-3">
            {onlineUsers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Online ({onlineUsers.length})
                </h4>
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <TooltipProvider key={user.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-xs">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.name}</p>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                {getActionIcon(user.currentAction)}
                                <span className="truncate">
                                  {user.currentAction || "Active"} • {user.currentPage || "Dashboard"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{user.name}</p>
                            <p>{user.email}</p>
                            <p className="text-muted-foreground">
                              {user.currentAction || "Active"} on {user.currentPage || "Dashboard"}
                            </p>
                            <p className="text-muted-foreground">
                              Last seen: {formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}

            {awayUsers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-600 mb-2 flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  Away ({awayUsers.length})
                </h4>
                <div className="space-y-2">
                  {awayUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg opacity-75">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Away • {formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
