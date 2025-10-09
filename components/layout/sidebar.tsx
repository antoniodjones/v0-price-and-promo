"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  Package,
  TrendingUp,
  Settings,
  BarChart3,
  Zap,
  Target,
  Calculator,
  Layers,
  ChevronDown,
  ChevronRight,
  Search,
  Shield,
  Trophy,
  Tag,
  Percent,
} from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"
import { usePermissions } from "@/lib/rbac/hooks"
import { PERMISSIONS } from "@/lib/rbac/roles"
import { Separator } from "@/components/ui/separator"

interface NavigationItem {
  name: string
  href: string
  icon: any
  permission?: string
  subnodes?: NavigationItem[]
}

interface NavigationGroup {
  name: string
  items: NavigationItem[]
}

const navigationGroups: NavigationGroup[] = [
  {
    name: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
    ],
  },
  {
    name: "Pricing & Discounts",
    items: [
      {
        name: "Best Deal Logic",
        href: "/pricing",
        icon: Calculator,
        permission: PERMISSIONS.PRICING_VIEW,
      },
      {
        name: "Market Pricing",
        href: "/market-pricing",
        icon: TrendingUp,
        permission: PERMISSIONS.PRICING_VIEW,
      },
      {
        name: "Simulator",
        href: "/simulator",
        icon: Zap,
        permission: PERMISSIONS.PRICING_VIEW,
      },
      {
        name: "Customer Discounts",
        href: "/customer-discounts",
        icon: Users,
        permission: PERMISSIONS.DISCOUNTS_VIEW,
      },
      {
        name: "Inventory Discounts",
        href: "/inventory-discounts",
        icon: Package,
        permission: PERMISSIONS.DISCOUNTS_VIEW,
      },
      {
        name: "Tier Management",
        href: "/tier-management",
        icon: Trophy,
        permission: PERMISSIONS.DISCOUNTS_VIEW,
      },
    ],
  },
  {
    name: "Promotions",
    items: [
      {
        name: "All Promotions",
        href: "/promotions",
        icon: Tag,
        permission: PERMISSIONS.PROMOTIONS_VIEW,
      },
      {
        name: "Promo Codes",
        href: "/promo-codes",
        icon: Percent,
        permission: PERMISSIONS.PROMOTIONS_VIEW,
      },
      {
        name: "Bundle Deals",
        href: "/bundle-deals",
        icon: Layers,
        permission: PERMISSIONS.PROMOTIONS_VIEW,
      },
    ],
  },
  {
    name: "Products",
    items: [
      {
        name: "Product Catalog",
        href: "/products",
        icon: Package,
        permission: PERMISSIONS.PRODUCTS_VIEW,
      },
      {
        name: "Price Search",
        href: "/price-search",
        icon: Search,
        permission: PERMISSIONS.PRODUCTS_VIEW,
      },
    ],
  },
  {
    name: "Customers",
    items: [
      {
        name: "Customer Management",
        href: "/customers",
        icon: Users,
        permission: PERMISSIONS.CUSTOMERS_VIEW,
      },
    ],
  },
  {
    name: "System",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_VIEW,
      },
      {
        name: "Admin",
        href: "/admin",
        icon: Shield,
        permission: PERMISSIONS.USERS_VIEW,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Overview", "Pricing & Discounts"])
  const { hasPermission } = usePermissions()

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((name) => name !== groupName) : [...prev, groupName],
    )
  }

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed)
  }

  // Filter navigation items based on permissions
  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter((item) => {
      if (!item.permission) return true
      return hasPermission(item.permission as any)
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 border-b border-sidebar-border px-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gti-green rounded-md flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="text-sidebar-foreground">
              <div className="font-bold text-lg">GTI Pricing</div>
              <div className="text-xs text-muted-foreground">Engine</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-center">
            <UserMenu />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-4">
          {navigationGroups.map((group) => {
            const filteredItems = filterItems(group.items)
            if (filteredItems.length === 0) return null

            const isGroupExpanded = expandedGroups.includes(group.name)

            return (
              <div key={group.name}>
                {/* Group Header */}
                {!collapsed && (
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => toggleGroup(group.name)}
                      className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      {group.name}
                      {isGroupExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                  </div>
                )}

                {/* Group Items */}
                {(collapsed || isGroupExpanded) && (
                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive = pathname === item.href

                      return (
                        <Link key={item.name} href={item.href}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive && "bg-gti-green text-white hover:bg-gti-green/90 hover:text-white",
                              collapsed && "px-2 justify-center",
                            )}
                            title={collapsed ? item.name : undefined}
                          >
                            <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                            {!collapsed && <span className="truncate">{item.name}</span>}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                )}

                {/* Separator between groups */}
                {!collapsed && isGroupExpanded && <Separator className="my-3" />}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapseToggle}
          className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-90" />}
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  )
}
