// Server-side WebSocket handlers for collaboration features
import type { Server as SocketIOServer, Socket } from "socket.io"
import { logger } from "@/lib/logger"

interface CollaborationUser {
  id: string
  socketId: string
  name: string
  email: string
  avatar?: string
  status: "online" | "away" | "offline"
  lastSeen: number
  currentPage?: string
  currentAction?: string
}

interface DocumentSession {
  documentId: string
  documentType: string
  users: Map<string, CollaborationUser>
  content: string
  lastModified: number
}

export class CollaborationManager {
  private users = new Map<string, CollaborationUser>()
  private documentSessions = new Map<string, DocumentSession>()
  private activities: any[] = []

  constructor(private io: SocketIOServer) {
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      // Presence management
      socket.on("join-presence", (data: { page: string; action?: string }) => {
        this.handleUserJoinPresence(socket, data)
      })

      socket.on("leave-presence", () => {
        this.handleUserLeavePresence(socket)
      })

      socket.on("update-action", (data: { page: string; action: string }) => {
        this.handleUserActionUpdate(socket, data)
      })

      // Document collaboration
      socket.on("join-document", (data: { documentId: string; documentType: string }) => {
        this.handleJoinDocument(socket, data)
      })

      socket.on("leave-document", (data: { documentId: string }) => {
        this.handleLeaveDocument(socket, data)
      })

      socket.on("document-change", (data: { documentId: string; change: any }) => {
        this.handleDocumentChange(socket, data)
      })

      socket.on("cursor-update", (data: { documentId: string; cursor: number; selection?: any }) => {
        this.handleCursorUpdate(socket, data)
      })

      // Activity feed
      socket.on("join-activity-feed", () => {
        socket.join("activity-feed")
      })

      socket.on("leave-activity-feed", () => {
        socket.leave("activity-feed")
      })

      socket.on("get-recent-activities", (data: { limit: number }) => {
        socket.emit("recent-activities", {
          activities: this.activities.slice(0, data.limit),
        })
      })

      // Disconnect handling
      socket.on("disconnect", () => {
        this.handleUserDisconnect(socket)
      })
    })
  }

  private handleUserJoinPresence(socket: Socket, data: { page: string; action?: string }) {
    const user: CollaborationUser = {
      id: socket.id,
      socketId: socket.id,
      name: `User ${socket.id.slice(-4)}`, // In real app, get from auth
      email: `user${socket.id.slice(-4)}@example.com`,
      status: "online",
      lastSeen: Date.now(),
      currentPage: data.page,
      currentAction: data.action,
    }

    this.users.set(socket.id, user)
    socket.join("presence")

    // Notify others
    socket.to("presence").emit("user-joined", user)

    // Send current users to new user
    const currentUsers = Array.from(this.users.values()).filter((u) => u.id !== socket.id)
    socket.emit("presence-update", { users: currentUsers })

    this.addActivity({
      type: "user",
      action: "joined",
      description: `${user.name} joined the workspace`,
      user: { id: user.id, name: user.name, avatar: user.avatar },
      timestamp: Date.now(),
    })

    logger.info(`User ${user.name} joined presence on ${data.page}`)
  }

  private handleUserLeavePresence(socket: Socket) {
    const user = this.users.get(socket.id)
    if (user) {
      user.status = "offline"
      user.lastSeen = Date.now()
      socket.to("presence").emit("user-left", socket.id)
      this.users.delete(socket.id)
    }
    socket.leave("presence")
  }

  private handleUserActionUpdate(socket: Socket, data: { page: string; action: string }) {
    const user = this.users.get(socket.id)
    if (user) {
      user.currentPage = data.page
      user.currentAction = data.action
      user.lastSeen = Date.now()

      socket.to("presence").emit("user-action-changed", {
        userId: socket.id,
        action: data.action,
        page: data.page,
      })
    }
  }

  private handleJoinDocument(socket: Socket, data: { documentId: string; documentType: string }) {
    const { documentId, documentType } = data

    if (!this.documentSessions.has(documentId)) {
      this.documentSessions.set(documentId, {
        documentId,
        documentType,
        users: new Map(),
        content: "",
        lastModified: Date.now(),
      })
    }

    const session = this.documentSessions.get(documentId)!
    const user = this.users.get(socket.id)

    if (user) {
      const collaboratorUser = {
        ...user,
        color: this.getUserColor(socket.id),
      }
      session.users.set(socket.id, collaboratorUser)
      socket.join(`document-${documentId}`)

      // Notify other collaborators
      socket.to(`document-${documentId}`).emit("collaborators-updated", {
        collaborators: Array.from(session.users.values()),
      })

      // Send current collaborators to new user
      socket.emit("collaborators-updated", {
        collaborators: Array.from(session.users.values()).filter((u) => u.id !== socket.id),
      })

      this.addActivity({
        type: "edit",
        action: "started editing",
        description: `${user.name} started editing ${documentType.replace("-", " ")}`,
        user: { id: user.id, name: user.name, avatar: user.avatar },
        timestamp: Date.now(),
        metadata: { entityType: documentType, entityId: documentId },
      })
    }
  }

  private handleLeaveDocument(socket: Socket, data: { documentId: string }) {
    const session = this.documentSessions.get(data.documentId)
    if (session) {
      session.users.delete(socket.id)
      socket.leave(`document-${data.documentId}`)

      // Notify remaining collaborators
      socket.to(`document-${data.documentId}`).emit("collaborators-updated", {
        collaborators: Array.from(session.users.values()),
      })
    }
  }

  private handleDocumentChange(socket: Socket, data: { documentId: string; change: any }) {
    const session = this.documentSessions.get(data.documentId)
    if (session) {
      session.lastModified = Date.now()

      // Broadcast change to other collaborators
      socket.to(`document-${data.documentId}`).emit("document-change", data.change)

      const user = this.users.get(socket.id)
      if (user) {
        this.addActivity({
          type: "edit",
          action: "made changes",
          description: `${user.name} edited ${session.documentType.replace("-", " ")}`,
          user: { id: user.id, name: user.name, avatar: user.avatar },
          timestamp: Date.now(),
          metadata: { entityType: session.documentType, entityId: data.documentId, impact: "medium" },
        })
      }
    }
  }

  private handleCursorUpdate(socket: Socket, data: { documentId: string; cursor: number; selection?: any }) {
    socket.to(`document-${data.documentId}`).emit("cursor-update", {
      userId: socket.id,
      cursor: data.cursor,
      selection: data.selection,
    })
  }

  private handleUserDisconnect(socket: Socket) {
    const user = this.users.get(socket.id)
    if (user) {
      user.status = "offline"
      user.lastSeen = Date.now()

      // Remove from all document sessions
      this.documentSessions.forEach((session, documentId) => {
        if (session.users.has(socket.id)) {
          session.users.delete(socket.id)
          socket.to(`document-${documentId}`).emit("collaborators-updated", {
            collaborators: Array.from(session.users.values()),
          })
        }
      })

      // Notify presence
      socket.to("presence").emit("user-left", socket.id)
      this.users.delete(socket.id)

      this.addActivity({
        type: "user",
        action: "left",
        description: `${user.name} left the workspace`,
        user: { id: user.id, name: user.name, avatar: user.avatar },
        timestamp: Date.now(),
      })
    }
  }

  private getUserColor(socketId: string): string {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"]
    const index = socketId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  private addActivity(activity: any) {
    const activityWithId = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    this.activities.unshift(activityWithId)
    this.activities = this.activities.slice(0, 100) // Keep last 100 activities

    // Broadcast to activity feed subscribers
    this.io.to("activity-feed").emit("new-activity", activityWithId)
  }
}
