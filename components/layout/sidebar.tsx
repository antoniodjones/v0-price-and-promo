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
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
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
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col bg-gti-dark-green border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <Target className="w-5 h-5 text-gti-bright-green" />
          </div>
          {!collapsed && (
            <div className="text-white">
              <div className="font-bold text-xl">Promotions Engine</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:bg-gti-medium-green hover:text-white",
                    isActive && "bg-gti-medium-green text-white",
                    collapsed && "px-2",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full text-white hover:bg-gti-medium-green hover:text-white"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </div>
  )
}
