"use client"

import { useState, useEffect, useRef } from "react"
import { useWebSocket } from "@/lib/websocket/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Users, Save, Clock, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CollaborativeEditorProps {
  documentId: string
  documentType: "pricing-rule" | "discount-config" | "product-description" | "business-rule"
  initialContent?: string
  onSave?: (content: string) => Promise<void>
  className?: string
}

interface EditorUser {
  id: string
  name: string
  avatar?: string
  cursor: number
  selection?: { start: number; end: number }
  color: string
}

interface DocumentChange {
  id: string
  type: "insert" | "delete" | "replace"
  position: number
  content: string
  length?: number
  userId: string
  timestamp: number
}

export function CollaborativeEditor({
  documentId,
  documentType,
  initialContent = "",
  onSave,
  className,
}: CollaborativeEditorProps) {
  const { connected, socket } = useWebSocket()
  const [content, setContent] = useState(initialContent)
  const [collaborators, setCollaborators] = useState<EditorUser[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastChangeRef = useRef<number>(0)

  const userColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // yellow
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
  ]

  useEffect(() => {
    if (!socket || !connected) return

    // Join document editing session
    socket.emit("join-document", { documentId, documentType })

    // Listen for collaborator updates
    socket.on("collaborators-updated", (data: { collaborators: EditorUser[] }) => {
      setCollaborators(data.collaborators)
    })

    // Listen for document changes from other users
    socket.on("document-change", (change: DocumentChange) => {
      if (change.userId !== socket.id) {
        applyChange(change)
      }
    })

    // Listen for cursor position updates
    socket.on(
      "cursor-update",
      (data: { userId: string; cursor: number; selection?: { start: number; end: number } }) => {
        setCollaborators((prev) =>
          prev.map((user) =>
            user.id === data.userId ? { ...user, cursor: data.cursor, selection: data.selection } : user,
          ),
        )
      },
    )

    return () => {
      socket.off("collaborators-updated")
      socket.off("document-change")
      socket.off("cursor-update")
      socket.emit("leave-document", { documentId })
    }
  }, [socket, connected, documentId, documentType])

  const applyChange = (change: DocumentChange) => {
    setContent((prevContent) => {
      switch (change.type) {
        case "insert":
          return prevContent.slice(0, change.position) + change.content + prevContent.slice(change.position)
        case "delete":
          return prevContent.slice(0, change.position) + prevContent.slice(change.position + (change.length || 0))
        case "replace":
          return (
            prevContent.slice(0, change.position) +
            change.content +
            prevContent.slice(change.position + (change.length || 0))
          )
        default:
          return prevContent
      }
    })
  }

  const handleContentChange = (newContent: string) => {
    const now = Date.now()
    if (now - lastChangeRef.current < 100) return // Throttle changes

    lastChangeRef.current = now
    setContent(newContent)
    setHasUnsavedChanges(true)
    setIsEditing(true)

    // Detect change type and send to other collaborators
    if (socket && connected) {
      const change: DocumentChange = {
        id: `${socket.id}-${now}`,
        type: newContent.length > content.length ? "insert" : newContent.length < content.length ? "delete" : "replace",
        position: 0, // Simplified - in a real implementation, you'd calculate the exact position
        content: newContent,
        length: content.length,
        userId: socket.id!,
        timestamp: now,
      }

      socket.emit("document-change", { documentId, change })
    }

    // Auto-save after 2 seconds of inactivity
    setTimeout(() => {
      if (Date.now() - lastChangeRef.current >= 2000) {
        setIsEditing(false)
      }
    }, 2000)
  }

  const handleCursorChange = () => {
    if (!textareaRef.current || !socket || !connected) return

    const cursor = textareaRef.current.selectionStart
    const selection =
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
        ? {
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          }
        : undefined

    socket.emit("cursor-update", { documentId, cursor, selection })
  }

  const handleSave = async () => {
    if (!onSave) return

    try {
      await onSave(content)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      toast({
        title: "Saved",
        description: "Document saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-base">
              <Edit className="h-4 w-4" />
              <span>Collaborative Editor</span>
              {hasUnsavedChanges && <Badge variant="outline">Unsaved</Badge>}
              {isEditing && <Badge className="bg-blue-500 text-white">Editing</Badge>}
            </CardTitle>
            <CardDescription>
              {documentType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} • {collaborators.length}{" "}
              collaborator{collaborators.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {collaborators.length > 0 && (
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((user, index) => (
                  <TooltipProvider key={user.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-xs text-white" style={{ backgroundColor: user.color }}>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.name} is editing</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {collaborators.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{collaborators.length - 3}</span>
                  </div>
                )}
              </div>
            )}
            {onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="h-8 bg-transparent"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Collaborative features are offline. Changes will not be synced with other users.
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onSelect={handleCursorChange}
            onKeyUp={handleCursorChange}
            placeholder={`Start editing this ${documentType.replace("-", " ")}...`}
            className="min-h-64 font-mono text-sm"
            style={{
              resize: "vertical",
            }}
          />

          {/* Cursor indicators for other users */}
          {collaborators.map((user) => (
            <div
              key={user.id}
              className="absolute pointer-events-none"
              style={{
                // This is a simplified cursor indicator
                // In a real implementation, you'd calculate the exact position based on text metrics
                top: `${Math.floor(user.cursor / 50) * 20 + 10}px`,
                left: `${(user.cursor % 50) * 8 + 10}px`,
              }}
            >
              <div className="w-0.5 h-5 animate-pulse" style={{ backgroundColor: user.color }} />
              <div
                className="text-xs px-1 py-0.5 rounded text-white whitespace-nowrap"
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{content.length} characters</span>
            <span>{content.split("\n").length} lines</span>
            {collaborators.length > 0 && (
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {collaborators.length} editing
              </span>
            )}
          </div>
          {lastSaved && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Last saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
