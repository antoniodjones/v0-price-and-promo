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
  TestTube,
  Calculator,
  Layers,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Search,
  Shield,
} from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Price Search",
    href: "/price-search",
    icon: Search,
  },
  {
    name: "Customer Discounts",
    href: "/customer-discounts",
    icon: Users,
  },
  {
    name: "Inventory Discounts",
    href: "/inventory-discounts",
    icon: Package,
  },
  {
    name: "Bundle Deals",
    href: "/bundle-deals",
    icon: Layers,
  },
  {
    name: "Best Deal Logic",
    href: "/pricing",
    icon: Calculator,
  },
  {
    name: "Market Pricing",
    href: "/market-pricing",
    icon: TrendingUp,
  },
  {
    name: "Promotions",
    href: "/promotions",
    icon: Zap,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Testing Tools",
    href: "/testing",
    icon: TestTube,
  },
  {
    name: "Task Planning",
    href: "/task-planning",
    icon: ClipboardList,
    subnodes: [
      {
        name: "User Stories",
        href: "/task-planning/user-stories",
        icon: BookOpen,
      },
    ],
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Shield,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Task Planning"])

  console.log("[v0] Sidebar: Rendering with pathname:", pathname)

  const toggleExpanded = (itemName: string) => {
    console.log("[v0] Sidebar: Toggling expanded for:", itemName)
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const handleCollapseToggle = () => {
    console.log("[v0] Sidebar: Toggling collapse, current state:", collapsed)
    setCollapsed(!collapsed)
  }

  const handleNavClick = (itemName: string, href: string) => {
    console.log("[v0] Sidebar: Navigation clicked:", itemName, "->", href)
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
          <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
            <Target className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="text-sidebar-foreground">
              <div className="font-bold text-xl">Promotions Engine</div>
            </div>
          )}
        </div>
        {/* User Menu */}
        {!collapsed && (
          <div className="flex items-center">
            <UserMenu />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isExpanded = expandedItems.includes(item.name)
            const hasSubnodes = item.subnodes && item.subnodes.length > 0

            return (
              <div key={item.name}>
                {/* Main navigation item */}
                <div className="flex items-center">
                  <Link href={item.href} className="flex-1" onClick={() => handleNavClick(item.name, item.href)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                        collapsed && "px-2",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                      {!collapsed && item.name}
                    </Button>
                  </Link>

                  {hasSubnodes && !collapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item.name)}
                      className="ml-1 p-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </Button>
                  )}
                </div>

                {hasSubnodes && isExpanded && !collapsed && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subnodes.map((subnode) => {
                      const isSubnodeActive = pathname === subnode.href
                      return (
                        <Link
                          key={subnode.name}
                          href={subnode.href}
                          onClick={() => handleNavClick(subnode.name, subnode.href)}
                        >
                          <Button
                            variant={isSubnodeActive ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isSubnodeActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                            )}
                          >
                            <subnode.icon className="h-3 w-3 mr-2" />
                            {subnode.name}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                )}
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
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </div>
  )
}
