"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Calculator,
  Tag,
  Package,
  TrendingUp,
  Settings,
  ChevronRight,
  X,
  Calendar,
  ClipboardList,
  Trophy,
  PackageOpen,
  Zap,
  Ticket,
  Sparkles,
  Users,
} from "lucide-react"
import { useAppContext } from "@/lib/context/app-context"
import { useRouter, usePathname } from "next/navigation"
import { PromotionsIcon } from "@/components/ui/promotions-icon"

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
    id: "products",
    label: "Products",
    icon: Package,
    href: "/products",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    id: "pricing",
    label: "Pricing Engine",
    icon: Calculator,
    children: [
      { id: "pricing-calculator", label: "Price Calculator", icon: Calculator, href: "/pricing" },
      { id: "pricing-history", label: "Price History", icon: TrendingUp, href: "/price-tracking" },
    ],
  },
  {
    id: "discounts",
    label: "Discounts",
    icon: Tag,
    children: [
      { id: "customer-discounts", label: "Customer Discounts", icon: Tag, href: "/customer-discounts" },
      { id: "inventory-discounts", label: "Inventory Discounts", icon: Package, href: "/inventory-discounts" },
      { id: "tier-management", label: "Tier Management", icon: Trophy, href: "/tier-management" },
    ],
  },
  {
    id: "bundle-deals",
    label: "Bundle Deals",
    icon: PackageOpen,
    href: "/bundle-deals",
  },
  {
    id: "best-deal-logic",
    label: "Best Deal Logic",
    icon: Zap,
    href: "/best-deal-logic",
  },
  {
    id: "promotions",
    label: "Promotions",
    icon: TrendingUp,
    children: [
      { id: "promotions-overview", label: "Overview", icon: TrendingUp, href: "/promotions" },
      { id: "promotions-history", label: "History", icon: Calendar, href: "/promotions/history" },
      { id: "promo-codes", label: "Promo Codes", icon: Ticket, href: "/promo-codes" },
    ],
  },
  {
    id: "simulator",
    label: "Promo Simulator",
    icon: Sparkles,
    href: "/simulator",
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
    children: [
      {
        id: "business-rules",
        label: "Business Rules",
        icon: Settings,
        children: [
          { id: "discounts-settings", label: "Discounts", icon: Tag, href: "/settings?section=discounts" },
          { id: "pricing-settings", label: "Pricing", icon: Calculator, href: "/settings?section=pricing" },
          { id: "expiration-settings", label: "Expiration", icon: Calendar, href: "/settings?section=expiration" },
          { id: "markets-settings", label: "Markets", icon: TrendingUp, href: "/settings?section=markets" },
        ],
      },
      {
        id: "operations",
        label: "Operations",
        icon: Settings,
        children: [
          { id: "documentation", label: "Documentation", icon: ClipboardList, href: "/settings?section=documentation" },
          { id: "task-plan", label: "Task Plan", icon: ClipboardList, href: "/task-planning" },
          {
            id: "test-validation",
            label: "Test Validation",
            icon: ClipboardList,
            href: "/settings?section=test-validation",
          },
          { id: "automation", label: "Automation", icon: Zap, href: "/settings?section=automation" },
        ],
      },
      {
        id: "system",
        label: "System",
        icon: Settings,
        children: [
          { id: "notifications", label: "Notifications", icon: Settings, href: "/settings?section=notifications" },
          { id: "integrations", label: "Integrations", icon: Settings, href: "/settings?section=integrations" },
          { id: "analytics-settings", label: "Analytics", icon: TrendingUp, href: "/settings?section=analytics" },
          { id: "performance", label: "Performance", icon: Zap, href: "/settings?section=performance" },
        ],
      },
      {
        id: "security-access",
        label: "Security & Access",
        icon: Settings,
        children: [
          { id: "users", label: "Users", icon: Settings, href: "/settings?section=users" },
          { id: "security", label: "Security", icon: Settings, href: "/settings?section=security" },
          { id: "multi-tenant", label: "Multi-Tenant", icon: Settings, href: "/settings?section=multi-tenant" },
        ],
      },
      {
        id: "advanced",
        label: "Advanced",
        icon: Settings,
        children: [
          { id: "testing", label: "Testing", icon: ClipboardList, href: "/settings?section=testing" },
          {
            id: "disaster-recovery",
            label: "Disaster Recovery",
            icon: Settings,
            href: "/settings?section=disaster-recovery",
          },
        ],
      },
    ],
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
            <PromotionsIcon size={32} />
            <span className="text-xl font-semibold text-foreground">Promotions</span>
          </div>

          <Button variant="ghost" size="sm" className="lg:hidden" onClick={closeMobileSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
          <div>{NAVIGATION_ITEMS.map((item) => renderNavigationItem(item))}</div>
        </nav>
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
