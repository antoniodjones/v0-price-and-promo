// Navigation configuration for module-based routing
// This will be enhanced with module system in later phases

import type { Permission } from "./rbac/roles"

export interface NavigationRoute {
  id: string
  path: string
  label: string
  icon?: string
  requireAuth?: boolean
  requiredPermissions?: Permission[]
  module?: string
  children?: NavigationRoute[]
}

export const NAVIGATION_ROUTES: NavigationRoute[] = [
  {
    id: "dashboard",
    path: "/",
    label: "Dashboard",
    icon: "Home",
    module: "core",
  },
  {
    id: "pricing",
    path: "/pricing",
    label: "Pricing Engine",
    icon: "Calculator",
    module: "pricing-engine",
    requiredPermissions: ["pricing:view"],
    children: [
      {
        id: "pricing-calculator",
        path: "/pricing/calculator",
        label: "Price Calculator",
        icon: "Calculator",
        module: "pricing-engine",
        requiredPermissions: ["pricing:view"],
      },
      {
        id: "pricing-history",
        path: "/pricing/history",
        label: "Price History",
        icon: "TrendingUp",
        module: "pricing-engine",
        requiredPermissions: ["pricing:view"],
      },
      {
        id: "pricing-rules",
        path: "/pricing/rules",
        label: "Pricing Rules",
        icon: "Settings",
        module: "pricing-engine",
        requiredPermissions: ["pricing:edit"],
      },
    ],
  },
  {
    id: "discounts",
    path: "/discounts",
    label: "Discounts",
    icon: "Tag",
    module: "customer-discounts",
    requiredPermissions: ["discounts:view"],
    children: [
      {
        id: "customer-discounts",
        path: "/customer-discounts",
        label: "Customer Discounts",
        icon: "Tag",
        module: "customer-discounts",
        requiredPermissions: ["discounts:view"],
      },
      {
        id: "inventory-discounts",
        path: "/inventory-discounts",
        label: "Inventory Discounts",
        icon: "Package",
        module: "inventory-discounts",
        requiredPermissions: ["discounts:view"],
      },
    ],
  },
  {
    id: "promotions",
    path: "/promotions",
    label: "Promotions",
    icon: "TrendingUp",
    module: "promotions",
    requiredPermissions: ["promotions:view"],
  },
  {
    id: "analytics",
    path: "/analytics",
    label: "Analytics",
    icon: "TrendingUp",
    module: "analytics",
    requireAuth: true,
    requiredPermissions: ["analytics:view"],
  },
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
    icon: "Settings",
    module: "settings",
    requireAuth: true,
    requiredPermissions: ["settings:view"],
  },
]

// Helper functions for navigation
export function findRouteByPath(path: string): NavigationRoute | null {
  const findInRoutes = (routes: NavigationRoute[]): NavigationRoute | null => {
    for (const route of routes) {
      if (route.path === path) {
        return route
      }
      if (route.children) {
        const found = findInRoutes(route.children)
        if (found) return found
      }
    }
    return null
  }

  return findInRoutes(NAVIGATION_ROUTES)
}

export function generateBreadcrumbs(path: string) {
  const route = findRouteByPath(path)
  if (!route) return []

  const breadcrumbs = []
  const pathSegments = path.split("/").filter(Boolean)

  let currentPath = ""
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const segmentRoute = findRouteByPath(currentPath)
    if (segmentRoute) {
      breadcrumbs.push({
        label: segmentRoute.label,
        href: segmentRoute.path,
        isActive: currentPath === path,
      })
    }
  }

  return breadcrumbs
}

export function isRouteAccessible(route: NavigationRoute, userPermissions: Permission[]): boolean {
  if (!route.requireAuth && !route.requiredPermissions) {
    return true
  }

  if (route.requiredPermissions) {
    return route.requiredPermissions.some((permission) => userPermissions.includes(permission))
  }

  return true
}
