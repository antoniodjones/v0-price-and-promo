// Navigation configuration for module-based routing
// This will be enhanced with module system in later phases

export interface NavigationRoute {
  id: string
  path: string
  label: string
  icon?: string
  requireAuth?: boolean
  requiredRole?: string
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
    children: [
      {
        id: "pricing-calculator",
        path: "/pricing/calculator",
        label: "Price Calculator",
        icon: "Calculator",
        module: "pricing-engine",
      },
      {
        id: "pricing-history",
        path: "/pricing/history",
        label: "Price History",
        icon: "TrendingUp",
        module: "pricing-engine",
      },
      {
        id: "pricing-rules",
        path: "/pricing/rules",
        label: "Pricing Rules",
        icon: "Settings",
        module: "pricing-engine",
      },
    ],
  },
  {
    id: "discounts",
    path: "/discounts",
    label: "Discounts",
    icon: "Tag",
    module: "customer-discounts",
    children: [
      {
        id: "customer-discounts",
        path: "/discounts/customer",
        label: "Customer Discounts",
        icon: "Tag",
        module: "customer-discounts",
      },
      {
        id: "inventory-discounts",
        path: "/discounts/inventory",
        label: "Inventory Discounts",
        icon: "Package",
        module: "inventory-discounts",
      },
    ],
  },
  {
    id: "promotions",
    path: "/promotions",
    label: "Promotions",
    icon: "TrendingUp",
    module: "promotions",
  },
  {
    id: "analytics",
    path: "/analytics",
    label: "Analytics",
    icon: "TrendingUp",
    module: "analytics",
    requireAuth: true,
  },
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
    icon: "Settings",
    module: "settings",
    requireAuth: true,
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

export function isRouteAccessible(route: NavigationRoute, userRole?: string): boolean {
  // Phase 2: Basic access control - will be enhanced in Phase 3
  if (!route.requireAuth) {
    return true
  }

  // For Phase 2, simulate access granted
  // This will be replaced with real auth logic in Phase 3
  return true
}
