export interface DocumentationLink {
  pageId: string
  pageName: string
  documentationUrl: string
  enabled: boolean
  category: string
  description?: string
}

export interface DocumentationConfig {
  globalEnabled: boolean
  links: DocumentationLink[]
}

export const DEFAULT_DOCUMENTATION_LINKS: DocumentationLink[] = [
  {
    pageId: "dashboard",
    pageName: "Dashboard",
    documentationUrl: "/docs/dashboard-guide.md",
    enabled: true,
    category: "Core",
    description: "Overview of your pricing engine metrics and performance",
  },
  {
    pageId: "products",
    pageName: "Products",
    documentationUrl: "/docs/products-user-guide.md",
    enabled: true,
    category: "Catalog",
    description: "Managing your product catalog and inventory",
  },
  {
    pageId: "customers",
    pageName: "Customers",
    documentationUrl: "/docs/customers-user-guide.md",
    enabled: true,
    category: "Catalog",
    description: "Customer management and tier assignments",
  },
  {
    pageId: "pricing-engine",
    pageName: "Pricing Engine",
    documentationUrl: "/docs/pricing-engine-guide.md",
    enabled: true,
    category: "Pricing",
    description: "Understanding pricing calculations and rules",
  },
  {
    pageId: "discounts",
    pageName: "Discounts",
    documentationUrl: "/docs/discounts-user-guide.md",
    enabled: true,
    category: "Promotions",
    description: "Creating and managing discount rules",
  },
  {
    pageId: "bundle-deals",
    pageName: "Bundle Deals",
    documentationUrl: "/docs/bundle-deals-guide.md",
    enabled: true,
    category: "Promotions",
    description: "Setting up product bundles and combo deals",
  },
  {
    pageId: "best-deal-logic",
    pageName: "Best Deal Logic",
    documentationUrl: "/docs/best-deal-logic-training-guide.md",
    enabled: true,
    category: "Promotions",
    description: "How the system selects the best deal for customers",
  },
  {
    pageId: "promotions",
    pageName: "Promotions",
    documentationUrl: "/docs/promotions-user-guide.md",
    enabled: true,
    category: "Promotions",
    description: "Managing promotional campaigns and promo codes",
  },
  {
    pageId: "promo-simulator",
    pageName: "Promo Simulator",
    documentationUrl: "/docs/promo-simulator-guide.md",
    enabled: true,
    category: "Testing",
    description: "Testing promotions before going live",
  },
  {
    pageId: "analytics",
    pageName: "Analytics",
    documentationUrl: "/docs/analytics-guide.md",
    enabled: true,
    category: "Reporting",
    description: "Understanding your analytics and reports",
  },
  {
    pageId: "settings",
    pageName: "Settings",
    documentationUrl: "/docs/settings-guide.md",
    enabled: true,
    category: "System",
    description: "Configuring system settings and preferences",
  },
]
