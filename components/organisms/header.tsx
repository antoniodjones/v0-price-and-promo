"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, Search, Bell } from "lucide-react"
import { useAppContext } from "@/lib/context/app-context"
import { UserMenu } from "@/components/auth/user-menu"
import { DocumentationLink } from "@/components/shared/documentation-link"

interface HeaderProps {
  showSearch?: boolean
  showNotifications?: boolean
  showUserMenu?: boolean
  pageId?: string
  className?: string
}

export function Header({
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  pageId,
  className,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const { toggleMobileSidebar } = useAppContext()

  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {/* Left Section - Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleMobileSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Center Section - Search */}
      {showSearch && (
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Button */}
        {showSearch && (
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
        )}

        {/* Documentation Link */}
        {pageId && <DocumentationLink pageId={pageId} />}

        {/* Notifications */}
        {showNotifications && (
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
          </Button>
        )}

        {/* User Menu */}
        {showUserMenu && <UserMenu />}
      </div>
    </div>
  )
}

// Error Boundary for Header
export class HeaderErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Header Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-between w-full p-4 bg-muted/50">
          <div className="text-sm text-muted-foreground">Header temporarily unavailable</div>
        </div>
      )
    }

    return this.props.children
  }
}
