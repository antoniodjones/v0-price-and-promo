"use client"

import { useState } from "react"
import { ChevronDown, User, Settings, LogOut, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth-context"
import { DevelopmentUserSwitcher } from "./development-user-switcher"

export function UserMenu() {
  const { state, signOut } = useAuth()
  const [showUserSwitcher, setShowUserSwitcher] = useState(false)

  if (!state.user) return null

  const user = state.user as any // Type assertion for mock user properties
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() || "U"

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || user.email} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{user.name || user.email}</span>
              {user.role && (
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {user.department && (
                <Badge variant="outline" className="text-xs w-fit">
                  {user.department}
                </Badge>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          {state.isDevelopmentMode && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowUserSwitcher(true)}>
                <Users className="mr-2 h-4 w-4" />
                Switch User (Dev)
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {state.isDevelopmentMode && (
        <DevelopmentUserSwitcher open={showUserSwitcher} onOpenChange={setShowUserSwitcher} />
      )}
    </>
  )
}
