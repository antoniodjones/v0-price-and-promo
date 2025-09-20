export interface NavigationItem {
  id: string
  label: string
  icon: string // Using string instead of component for better compatibility
  description?: string
}

export interface NavigationGroup {
  id: string
  label: string
  icon: string // Using string instead of component for better compatibility
  items: NavigationItem[]
  defaultExpanded?: boolean
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: "basic",
    label: "Basic Configuration",
    icon: "DollarSign",
    defaultExpanded: true,
    items: [
      {
        id: "discounts",
        label: "Discounts",
        icon: "Percent",
        description: "Configure discount rules and limits",
      },
      {
        id: "pricing",
        label: "Pricing",
        icon: "DollarSign",
        description: "Set pricing strategies and models",
      },
      {
        id: "expiration",
        label: "Expiration",
        icon: "Clock",
        description: "Manage offer and pricing expiration",
      },
      {
        id: "markets",
        label: "Markets",
        icon: "MapPin",
        description: "Configure regional market settings",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "Bell",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        icon: "Bell",
        description: "Configure alerts and notifications",
      },
      {
        id: "testing",
        label: "Testing",
        icon: "TestTube",
        description: "A/B testing and experimentation",
      },
    ],
  },
  {
    id: "advanced",
    label: "Advanced Features",
    icon: "Plug",
    items: [
      {
        id: "integrations",
        label: "Integrations",
        icon: "Plug",
        description: "API connections and webhooks",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "BarChart3",
        description: "Reporting and data insights",
      },
      {
        id: "users",
        label: "Users",
        icon: "Users",
        description: "User management and permissions",
      },
    ],
  },
  {
    id: "system",
    label: "System Administration",
    icon: "Shield",
    items: [
      {
        id: "security",
        label: "Security",
        icon: "Shield",
        description: "Authentication and access control",
      },
      {
        id: "performance",
        label: "Performance",
        icon: "Zap",
        description: "System monitoring and optimization",
      },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    icon: "Building",
    items: [
      {
        id: "multi-tenant",
        label: "Multi-Tenant",
        icon: "Building",
        description: "Organization and tenant management",
      },
      {
        id: "automation",
        label: "Automation",
        icon: "Bot",
        description: "Custom rules and AI preferences",
      },
      {
        id: "disaster-recovery",
        label: "Disaster Recovery",
        icon: "HardDrive",
        description: "Backup and failover configuration",
      },
    ],
  },
]
