"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Shield, Building, LogOut } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

interface DevelopmentUserSwitcherProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DevelopmentUserSwitcher({ open, onOpenChange }: DevelopmentUserSwitcherProps) {
  const { switchUser, signOut, state } = useAuth()
  const [switching, setSwitching] = useState<string | null>(null)

  const mockUsers = [
    {
      id: "admin-1",
      email: "admin@company.com",
      name: "Admin User",
      role: "admin",
      department: "management",
      description: "Full system access, can manage users and settings",
    },
    {
      id: "manager-1",
      email: "manager@company.com",
      name: "Manager User",
      role: "manager",
      department: "pricing",
      description: "Can manage pricing, promotions, and view analytics",
    },
    {
      id: "analyst-1",
      email: "analyst@company.com",
      name: "Pricing Analyst",
      role: "analyst",
      department: "pricing",
      description: "Can view and analyze pricing data, create reports",
    },
    {
      id: "viewer-1",
      email: "viewer@company.com",
      name: "Viewer User",
      role: "viewer",
      department: "sales",
      description: "Read-only access to pricing and product information",
    },
  ]

  const handleSwitchUser = async (user: (typeof mockUsers)[0]) => {
    setSwitching(user.id)
    try {
      await switchUser(user)
      onOpenChange(false)
    } catch (error) {
      console.error("Error switching user:", error)
    } finally {
      setSwitching(null)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      onOpenChange(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "analyst":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Development User Switcher
          </DialogTitle>
          <DialogDescription>
            Switch between different user roles to test various access levels and permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current User */}
          {state.user && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Current User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{(state.user as any).name}</div>
                    <div className="text-sm text-muted-foreground">{(state.user as any).email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRoleColor((state.user as any).role)}>{(state.user as any).role}</Badge>
                    <Badge variant="outline">
                      <Building className="h-3 w-3 mr-1" />
                      {(state.user as any).department}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Users */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Switch to:</h4>
            {mockUsers.map((user) => (
              <Card
                key={user.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  (state.user as any)?.id === user.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{user.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        <Badge variant="outline">
                          <Building className="h-3 w-3 mr-1" />
                          {user.department}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSwitchUser(user)}
                        disabled={switching === user.id || (state.user as any)?.id === user.id}
                      >
                        {switching === user.id ? "Switching..." : "Switch"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sign Out Option */}
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={handleSignOut} className="w-full bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out (Clear User)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
