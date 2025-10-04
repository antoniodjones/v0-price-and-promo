// Role-based access control configuration

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  ANALYST: "analyst",
  VIEWER: "viewer",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const PERMISSIONS = {
  // Product permissions
  PRODUCTS_VIEW: "products:view",
  PRODUCTS_CREATE: "products:create",
  PRODUCTS_EDIT: "products:edit",
  PRODUCTS_DELETE: "products:delete",

  // Pricing permissions
  PRICING_VIEW: "pricing:view",
  PRICING_CALCULATE: "pricing:calculate",
  PRICING_EDIT: "pricing:edit",
  PRICING_APPROVE: "pricing:approve",

  // Discount permissions
  DISCOUNTS_VIEW: "discounts:view",
  DISCOUNTS_CREATE: "discounts:create",
  DISCOUNTS_EDIT: "discounts:edit",
  DISCOUNTS_DELETE: "discounts:delete",
  DISCOUNTS_APPROVE: "discounts:approve",

  // Promotion permissions
  PROMOTIONS_VIEW: "promotions:view",
  PROMOTIONS_CREATE: "promotions:create",
  PROMOTIONS_EDIT: "promotions:edit",
  PROMOTIONS_DELETE: "promotions:delete",
  PROMOTIONS_APPROVE: "promotions:approve",

  // Customer permissions
  CUSTOMERS_VIEW: "customers:view",
  CUSTOMERS_CREATE: "customers:create",
  CUSTOMERS_EDIT: "customers:edit",
  CUSTOMERS_DELETE: "customers:delete",

  // Analytics permissions
  ANALYTICS_VIEW: "analytics:view",
  ANALYTICS_EXPORT: "analytics:export",
  ANALYTICS_ADVANCED: "analytics:advanced",

  // Settings permissions
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
  SETTINGS_SYSTEM: "settings:system",

  // User management permissions
  USERS_VIEW: "users:view",
  USERS_CREATE: "users:create",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin has all permissions

  [ROLES.MANAGER]: [
    // Products
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,

    // Pricing
    PERMISSIONS.PRICING_VIEW,
    PERMISSIONS.PRICING_CALCULATE,
    PERMISSIONS.PRICING_EDIT,
    PERMISSIONS.PRICING_APPROVE,

    // Discounts
    PERMISSIONS.DISCOUNTS_VIEW,
    PERMISSIONS.DISCOUNTS_CREATE,
    PERMISSIONS.DISCOUNTS_EDIT,
    PERMISSIONS.DISCOUNTS_APPROVE,

    // Promotions
    PERMISSIONS.PROMOTIONS_VIEW,
    PERMISSIONS.PROMOTIONS_CREATE,
    PERMISSIONS.PROMOTIONS_EDIT,
    PERMISSIONS.PROMOTIONS_APPROVE,

    // Customers
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_EDIT,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.ANALYTICS_ADVANCED,

    // Settings
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
  ],

  [ROLES.ANALYST]: [
    // Products
    PERMISSIONS.PRODUCTS_VIEW,

    // Pricing
    PERMISSIONS.PRICING_VIEW,
    PERMISSIONS.PRICING_CALCULATE,

    // Discounts
    PERMISSIONS.DISCOUNTS_VIEW,

    // Promotions
    PERMISSIONS.PROMOTIONS_VIEW,

    // Customers
    PERMISSIONS.CUSTOMERS_VIEW,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.ANALYTICS_ADVANCED,

    // Settings
    PERMISSIONS.SETTINGS_VIEW,
  ],

  [ROLES.VIEWER]: [
    // Products
    PERMISSIONS.PRODUCTS_VIEW,

    // Pricing
    PERMISSIONS.PRICING_VIEW,

    // Discounts
    PERMISSIONS.DISCOUNTS_VIEW,

    // Promotions
    PERMISSIONS.PROMOTIONS_VIEW,

    // Customers
    PERMISSIONS.CUSTOMERS_VIEW,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,

    // Settings
    PERMISSIONS.SETTINGS_VIEW,
  ],
}

// Helper functions
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function canAccessRoute(role: Role, routePath: string): boolean {
  // Define route access rules
  const routePermissions: Record<string, Permission[]> = {
    "/products": [PERMISSIONS.PRODUCTS_VIEW],
    "/pricing": [PERMISSIONS.PRICING_VIEW],
    "/customer-discounts": [PERMISSIONS.DISCOUNTS_VIEW],
    "/inventory-discounts": [PERMISSIONS.DISCOUNTS_VIEW],
    "/promotions": [PERMISSIONS.PROMOTIONS_VIEW],
    "/promo-codes": [PERMISSIONS.PROMOTIONS_VIEW],
    "/bundle-deals": [PERMISSIONS.PROMOTIONS_VIEW],
    "/tier-management": [PERMISSIONS.DISCOUNTS_VIEW],
    "/analytics": [PERMISSIONS.ANALYTICS_VIEW],
    "/settings": [PERMISSIONS.SETTINGS_VIEW],
    "/market-pricing": [PERMISSIONS.PRICING_VIEW],
    "/simulator": [PERMISSIONS.PRICING_VIEW],
  }

  const requiredPermissions = routePermissions[routePath]
  if (!requiredPermissions) {
    return true // No specific permissions required
  }

  return hasAnyPermission(role, requiredPermissions)
}
