"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Calculator, Tag, Package, TrendingUp, Settings, ChevronRight, X } from "lucide-react"
import { useAppContext } from "@/lib/context/app-context"
import { useRouter, usePathname } from "next/navigation"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: NavigationItem[]
  badge?: string | number
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    id: "pricing",
    label: "Pricing Engine",
    icon: Calculator,
    children: [
      { id: "pricing-calculator", label: "Price Calculator", icon: Calculator, href: "/pricing/calculator" },
      { id: "pricing-history", label: "Price History", icon: TrendingUp, href: "/pricing/history" },
      { id: "pricing-rules", label: "Pricing Rules", icon: Settings, href: "/pricing/rules" },
    ],
  },
  {
    id: "discounts",
    label: "Discounts",
    icon: Tag,
    children: [
      { id: "customer-discounts", label: "Customer Discounts", icon: Tag, href: "/discounts/customer" },
      { id: "inventory-discounts", label: "Inventory Discounts", icon: Package, href: "/discounts/inventory" },
    ],
  },
  {
    id: "promotions",
    label: "Promotions",
    icon: TrendingUp,
    href: "/promotions",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp,
    href: "/analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar({ className }: { className?: string }) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())
  const { isMobileSidebarOpen, closeMobileSidebar } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const paddingLeft = level * 16 + 16
    const isActive = pathname === item.href

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal",
            "hover:bg-accent hover:text-accent-foreground",
            level > 0 && "text-sm",
            isActive && "bg-accent text-accent-foreground font-medium",
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else if (item.href) {
              router.push(item.href)
              closeMobileSidebar()
            }
          }}
        >
          <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">{item.badge}</span>
          )}
          {hasChildren && (
            <ChevronRight className={cn("ml-2 h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
          )}
        </Button>

        {hasChildren && isExpanded && (
          <div className="mt-1">{item.children?.map((child) => renderNavigationItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <>
      {isMobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileSidebar} />}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r",
          "transform transition-transform duration-200 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">GTI</span>
            </div>
            <span className="font-semibold text-foreground">Navigation</span>
          </div>

          <Button variant="ghost" size="sm" className="lg:hidden" onClick={closeMobileSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">{NAVIGATION_ITEMS.map((item) => renderNavigationItem(item))}</div>
        </nav>

        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground text-center">Phase 2: Layout & Navigation</div>
        </div>
      </div>
    </>
  )
}

export class SidebarErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Sidebar Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-72 bg-muted/50 border-r p-4">
          <div className="text-sm text-muted-foreground">Navigation temporarily unavailable</div>
        </div>
      )
    }

    return this.props.children
  }
}
