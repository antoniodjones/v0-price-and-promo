"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Users, Shield } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { useState } from "react"
import { DevelopmentUserSwitcher } from "./development-user-switcher"

export function DevelopmentAuthStatus() {
  const { state, hasRole, hasDepartment } = useAuth()
  const [showUserSwitcher, setShowUserSwitcher] = useState(false)

  if (!state.isDevelopmentMode) return null

  return (
    <>
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-sm text-orange-800 dark:text-orange-200">Development Mode Active</CardTitle>
          </div>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Authentication is bypassed for development. You can switch between users to test different roles.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {state.user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Current User:</span>
                <span className="text-sm">{(state.user as any).name || (state.user as any).email}</span>
              </div>

              <div className="flex gap-2">
                {(state.user as any).role && (
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {(state.user as any).role}
                  </Badge>
                )}
                {(state.user as any).department && <Badge variant="outline">{(state.user as any).department}</Badge>}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div>Admin Access: {hasRole("admin") ? "✅" : "❌"}</div>
                <div>Manager Access: {hasRole(["admin", "manager"]) ? "✅" : "❌"}</div>
                <div>Pricing Dept: {hasDepartment("pricing") ? "✅" : "❌"}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No user selected - authentication bypassed</div>
          )}

          <Button size="sm" variant="outline" onClick={() => setShowUserSwitcher(true)} className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Switch User
          </Button>
        </CardContent>
      </Card>

      <DevelopmentUserSwitcher open={showUserSwitcher} onOpenChange={setShowUserSwitcher} />
    </>
  )
}
