"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check, X, AlertCircle, TrendingUp } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "GTI Harvest Pricing & Promotions Platform",
    subtitle: "Automated Order-to-Cash Pricing Engine",
    type: "title",
    content: {
      presenter: "Technology Team",
      date: "Q4 2025", // Updated date from Q1 2025 to Q4 2025
      tagline: "Transforming Manual Pricing into Intelligent Automation",
    },
  },
  {
    id: 2,
    title: "Key Performance Indicators",
    type: "kpi",
    content: {
      headline: "Current System Performance & Business Impact",
      kpis: [
        {
          category: "Operational Efficiency",
          metric: "Pricing Configuration Time",
          current: "40 hrs/week",
          target: "4 hrs/week",
          actual: "8 hrs/week",
          status: "improving",
          change: "-80%",
        },
        {
          category: "Financial Impact",
          metric: "Inventory Write-offs",
          current: "$500K/year",
          target: "$200K/year",
          actual: "$320K/year",
          status: "improving",
          change: "-36%",
        },
        {
          category: "Quality Metrics",
          metric: "Pricing Errors per Month",
          current: "15-20 errors",
          target: "<2 errors",
          actual: "5 errors",
          status: "improving",
          change: "-70%",
        },
        {
          category: "Revenue Growth",
          metric: "Average Order Value",
          current: "$8,500",
          target: "$10,625",
          actual: "$9,350",
          status: "improving",
          change: "+10%",
        },
        {
          category: "Customer Satisfaction",
          metric: "Discount Utilization Rate",
          current: "45%",
          target: "75%",
          actual: "62%",
          status: "improving",
          change: "+38%",
        },
        {
          category: "System Performance",
          metric: "API Response Time",
          current: "N/A",
          target: "<200ms",
          actual: "145ms",
          status: "exceeding",
          change: "✓",
        },
      ],
    },
  },
  {
    id: 3,
    title: "Application Page Inventory",
    type: "page-inventory",
    content: {
      headline: "Complete Platform Navigation & Page Dependencies",
      pages: [
        {
          path: "/",
          name: "Dashboard",
          overview: "Main landing page with system overview and quick actions",
          functionality: "System health, recent activity, quick navigation to key features",
          roles: ["Admin", "Pricing Manager", "Analyst"],
          dependencies: ["Analytics data", "Recent promotions", "System metrics"],
          data: ["KPIs", "Active promotions", "Recent discounts"],
        },
        {
          path: "/customer-discounts",
          name: "Customer Discounts",
          overview: "Manage customer-specific discount rules",
          functionality: "View, create, edit customer discount configurations",
          roles: ["Pricing Manager", "Admin"],
          dependencies: ["Customers data", "Products catalog"],
          data: ["Discount rules", "Customer assignments", "Brand/category mappings"],
        },
        {
          path: "/customer-discounts/new",
          name: "New Customer Discount",
          overview: "Wizard for creating new customer discount rules",
          functionality: "Step-by-step discount configuration with brand/category/size selection",
          roles: ["Pricing Manager", "Admin"],
          dependencies: ["/customer-discounts", "Products API", "Customers API"],
          data: ["Brands", "Categories", "Sizes", "Customer list"],
        },
        {
          path: "/inventory-discounts",
          name: "Inventory Discounts",
          overview: "Automated discounts for aged inventory management",
          functionality: "Configure expiration and THC-based automatic discounting",
          roles: ["Inventory Manager", "Pricing Manager"],
          dependencies: ["Inventory data", "Product batches"],
          data: ["Batch data", "Expiration dates", "THC percentages", "Discount rules"],
        },
        {
          path: "/inventory-discounts/new",
          name: "New Inventory Discount",
          overview: "Create automated inventory liquidation rules",
          functionality: "Set up expiration-based or THC-based discount automation",
          roles: ["Inventory Manager", "Pricing Manager"],
          dependencies: ["/inventory-discounts", "Inventory API"],
          data: ["Product catalog", "Batch information", "Discount thresholds"],
        },
        {
          path: "/promotions",
          name: "Promotions",
          overview: "Manage all promotional campaigns",
          functionality: "View, create, edit BOGO and promotional campaigns",
          roles: ["Marketing Manager", "Pricing Manager"],
          dependencies: ["Products", "Customers", "Analytics"],
          data: ["Active promotions", "Performance metrics", "Customer segments"],
        },
        {
          path: "/promotions/new",
          name: "New BOGO Promotion",
          overview: "Create Buy-One-Get-One promotional campaigns",
          functionality: "Configure BOGO rules with product/brand/category targeting",
          roles: ["Marketing Manager", "Pricing Manager"],
          dependencies: ["/promotions", "Products API"],
          data: ["Product catalog", "Brands", "Categories", "Discount types"],
        },
        {
          path: "/promotions/dashboard",
          name: "Promotions Dashboard",
          overview: "Real-time promotional performance tracking",
          functionality: "Monitor active campaigns, conversion rates, revenue impact",
          roles: ["Marketing Manager", "Analyst"],
          dependencies: ["/promotions", "Analytics API"],
          data: ["Campaign metrics", "Conversion data", "Revenue attribution"],
        },
        {
          path: "/promotions/history",
          name: "Promotion History",
          overview: "Historical promotional campaign analysis",
          functionality: "Review past campaigns, compare performance, identify trends",
          roles: ["Marketing Manager", "Analyst"],
          dependencies: ["/promotions", "Analytics"],
          data: ["Historical campaigns", "Performance data", "Trend analysis"],
        },
        {
          path: "/bundle-deals",
          name: "Bundle Deals",
          overview: "Manage product bundle configurations",
          functionality: "Create and manage multi-product bundle offers",
          roles: ["Pricing Manager", "Marketing Manager"],
          dependencies: ["Products", "Pricing rules"],
          data: ["Bundle configurations", "Product combinations", "Bundle pricing"],
        },
        {
          path: "/bundle-deals/new",
          name: "New Bundle Deal",
          overview: "Create new product bundle offers",
          functionality: "Configure bundle products, pricing, and rules",
          roles: ["Pricing Manager", "Marketing Manager"],
          dependencies: ["/bundle-deals", "Products API"],
          data: ["Product catalog", "Pricing rules", "Bundle logic"],
        },
        {
          path: "/pricing-rules",
          name: "Volume & Tiered Pricing",
          overview: "Manage volume-based and customer tier pricing rules",
          functionality: "Configure quantity breaks and customer tier discounts",
          roles: ["Pricing Manager", "Admin"],
          dependencies: ["Products", "Customers", "Pricing engine"],
          data: ["Volume tiers", "Customer tiers", "Pricing rules", "Analytics"],
        },
        {
          path: "/tier-management",
          name: "Tier Management",
          overview: "Customer tier configuration and assignment",
          functionality: "Define customer tiers and associated discount rules",
          roles: ["Admin", "Pricing Manager"],
          dependencies: ["Customers", "Discount rules"],
          data: ["Customer tiers", "Tier definitions", "Discount mappings"],
        },
        {
          path: "/tier-management/new",
          name: "New Discount Rule",
          overview: "Create new tier-based discount rules",
          functionality: "Configure tier-specific pricing and discount logic",
          roles: ["Admin", "Pricing Manager"],
          dependencies: ["/tier-management", "Customers API"],
          data: ["Tier definitions", "Discount rules", "Customer assignments"],
        },
        {
          path: "/customers/tiers",
          name: "Customer Tiers",
          overview: "View and manage customer tier assignments",
          functionality: "Assign customers to tiers, view tier distribution",
          roles: ["Admin", "Customer Success"],
          dependencies: ["Customers", "Tier definitions"],
          data: ["Customer list", "Tier assignments", "Tier metrics"],
        },
        {
          path: "/customers/tiers/bulk-upload",
          name: "Bulk Tier Upload",
          overview: "Mass upload customer tier assignments",
          functionality: "CSV upload for bulk customer tier updates",
          roles: ["Admin"],
          dependencies: ["/customers/tiers", "Upload API"],
          data: ["CSV data", "Customer mappings", "Tier assignments"],
        },
        {
          path: "/analytics",
          name: "Analytics Dashboard",
          overview: "Comprehensive pricing and promotional analytics",
          functionality: "KPIs, trends, performance metrics, customer insights",
          roles: ["Analyst", "Manager", "Executive"],
          dependencies: ["All pricing data", "Promotions", "Orders"],
          data: ["Revenue metrics", "Discount effectiveness", "Customer behavior", "Trends"],
        },
        {
          path: "/market-pricing",
          name: "Market Pricing",
          overview: "Market-specific pricing configuration",
          functionality: "Configure pricing rules per geographic market",
          roles: ["Pricing Manager", "Regional Manager"],
          dependencies: ["Markets", "Products", "Pricing rules"],
          data: ["Market definitions", "Regional pricing", "Market-specific rules"],
        },
        {
          path: "/market-pricing/volume",
          name: "Volume Pricing",
          overview: "Volume-based pricing configuration",
          functionality: "Set up quantity-based discount tiers",
          roles: ["Pricing Manager"],
          dependencies: ["/market-pricing", "Products"],
          data: ["Volume breaks", "Quantity thresholds", "Discount amounts"],
        },
        {
          path: "/products",
          name: "Products",
          overview: "Product catalog management",
          functionality: "View and manage product inventory and details",
          roles: ["Inventory Manager", "Admin"],
          dependencies: ["ERP integration", "Inventory system"],
          data: ["Product catalog", "SKUs", "Pricing", "Inventory levels"],
        },
        {
          path: "/product/[id]",
          name: "Product Detail",
          overview: "Individual product information and pricing",
          functionality: "View product details, pricing history, applied discounts",
          roles: ["All users"],
          dependencies: ["/products", "Pricing engine", "Analytics"],
          data: ["Product details", "Pricing rules", "Discount history", "Performance"],
        },
        {
          path: "/promo-codes",
          name: "Promo Codes",
          overview: "Promotional code management",
          functionality: "Create and manage discount codes for customers",
          roles: ["Marketing Manager", "Pricing Manager"],
          dependencies: ["Promotions", "Customers"],
          data: ["Promo codes", "Usage tracking", "Redemption data"],
        },
        {
          path: "/price-search",
          name: "Price Search",
          overview: "Search and compare product pricing",
          functionality: "Search products, view pricing across markets and tiers",
          roles: ["Pricing Manager", "Analyst"],
          dependencies: ["Products", "Pricing engine"],
          data: ["Product prices", "Market pricing", "Tier pricing", "Discounts"],
        },
        {
          path: "/price-tracking",
          name: "Price Tracking",
          overview: "Monitor price changes and trends",
          functionality: "Track pricing history, identify anomalies, trend analysis",
          roles: ["Analyst", "Pricing Manager"],
          dependencies: ["Products", "Pricing history"],
          data: ["Price history", "Change logs", "Trend data"],
        },
        {
          path: "/watchlist",
          name: "Watchlist",
          overview: "Monitor specific products or pricing rules",
          functionality: "Create alerts for price changes or rule updates",
          roles: ["Pricing Manager", "Analyst"],
          dependencies: ["Products", "Pricing rules", "Notifications"],
          data: ["Watched items", "Alert rules", "Notification history"],
        },
        {
          path: "/promotion-detection",
          name: "Promotion Detection",
          overview: "Identify promotional opportunities",
          functionality: "AI-driven promotion recommendations based on inventory/sales",
          roles: ["Marketing Manager", "Analyst"],
          dependencies: ["Inventory", "Sales data", "Analytics"],
          data: ["Inventory levels", "Sales trends", "Recommendations"],
        },
        {
          path: "/simulator",
          name: "Pricing Simulator",
          overview: "Test pricing scenarios before deployment",
          functionality: "Simulate pricing changes, forecast revenue impact",
          roles: ["Pricing Manager", "Analyst"],
          dependencies: ["Pricing engine", "Historical data"],
          data: ["Pricing rules", "Historical sales", "Simulation results"],
        },
        {
          path: "/api-docs",
          name: "API Documentation",
          overview: "Complete API reference and integration guide",
          functionality: "Browse endpoints, test API calls, view schemas",
          roles: ["Developer", "Integration Specialist"],
          dependencies: ["API infrastructure"],
          data: ["API endpoints", "Request/response schemas", "Examples"],
        },
        {
          path: "/user-docs",
          name: "User Documentation",
          overview: "End-user guides and tutorials",
          functionality: "How-to guides, feature documentation, best practices",
          roles: ["All users"],
          dependencies: ["None"],
          data: ["Documentation content", "Tutorials", "FAQs"],
        },
        {
          path: "/tech-docs",
          name: "Technical Documentation",
          overview: "System architecture and technical specifications",
          functionality: "Architecture diagrams, data models, integration guides",
          roles: ["Developer", "Admin", "Architect"],
          dependencies: ["None"],
          data: ["Architecture docs", "Data models", "Technical specs"],
        },
        {
          path: "/settings",
          name: "Settings",
          overview: "System configuration and preferences",
          functionality: "User preferences, system settings, integrations",
          roles: ["Admin", "All users"],
          dependencies: ["User profile", "System config"],
          data: ["User settings", "System config", "Integration settings"],
        },
        {
          path: "/profile",
          name: "User Profile",
          overview: "User account management",
          functionality: "Update profile, change password, view activity",
          roles: ["All users"],
          dependencies: ["Auth system"],
          data: ["User data", "Activity logs", "Preferences"],
        },
        {
          path: "/auth/login",
          name: "Login",
          overview: "User authentication",
          functionality: "Email/password login, SSO integration",
          roles: ["All users"],
          dependencies: ["Auth system", "Supabase"],
          data: ["User credentials", "Session data"],
        },
        {
          path: "/admin/scripts",
          name: "Admin Scripts",
          overview: "Database management and maintenance scripts",
          functionality: "Run migrations, seed data, system maintenance",
          roles: ["Admin", "Developer"],
          dependencies: ["Database", "Supabase"],
          data: ["SQL scripts", "Migration history"],
        },
        {
          path: "/task-planning",
          name: "Task Planning",
          overview: "Project management and task tracking",
          functionality: "Manage development tasks, track progress",
          roles: ["Developer", "Project Manager"],
          dependencies: ["None"],
          data: ["Tasks", "User stories", "Progress tracking"],
        },
        {
          path: "/task-planning/user-stories",
          name: "User Stories",
          overview: "Feature requirements and user stories",
          functionality: "Document user stories, acceptance criteria",
          roles: ["Developer", "Product Manager"],
          dependencies: ["/task-planning"],
          data: ["User stories", "Requirements", "Acceptance criteria"],
        },
        {
          path: "/restoration-tracker",
          name: "Restoration Tracker",
          overview: "System restoration and recovery tracking",
          functionality: "Monitor system health, track recovery operations",
          roles: ["Admin", "DevOps"],
          dependencies: ["System monitoring"],
          data: ["System status", "Recovery logs", "Health metrics"],
        },
        {
          path: "/demo-presentation",
          name: "Demo Presentation",
          overview: "Executive presentation slides",
          functionality: "Navigate presentation slides for stakeholder demos",
          roles: ["Executive", "Sales", "Product Manager"],
          dependencies: ["None"],
          data: ["Presentation content", "KPIs", "Feature summaries"],
        },
      ],
    },
  },
  {
    id: 4,
    title: "The Challenge",
    type: "problem",
    content: {
      problems: [
        {
          title: "Manual Excel-Based Pricing",
          description: "Pricing managed across multiple spreadsheets, prone to errors and inconsistencies",
          impact: "High error rate, slow updates",
        },
        {
          title: "No Centralized System",
          description: "Each market operates independently with different pricing rules",
          impact: "Inconsistent customer experience",
        },
        {
          title: "Limited Promotional Capabilities",
          description: "Complex promotions (BOGO, bundles) difficult to implement and track",
          impact: "Lost revenue opportunities",
        },
        {
          title: "Aged Inventory Management",
          description: "Manual decisions on liquidation pricing lead to write-offs",
          impact: "$500K+ annual inventory losses",
        },
      ],
    },
  },
  {
    id: 5,
    title: "The Solution",
    type: "solution",
    content: {
      headline: "Automated Pricing & Promotions Engine",
      benefits: [
        "90% reduction in pricing configuration time",
        "Eliminate pricing errors and inconsistencies",
        "Real-time promotional campaign management",
        "Automated inventory liquidation strategies",
        "Data-driven pricing insights and analytics",
      ],
      roi: {
        timeToValue: "8-12 weeks",
        expectedSavings: "$2M+ annually",
        efficiency: "90% faster pricing updates",
      },
    },
  },
  {
    id: 6,
    title: "Implementation Status",
    type: "status",
    content: {
      overall: "60% Complete",
      phases: [
        {
          name: "Customer Discount Foundation",
          status: "complete",
          percentage: 95,
          priority: "Priority #1",
        },
        {
          name: "Automated Inventory Discounts",
          status: "complete",
          percentage: 100,
          priority: "Priority #2",
        },
        {
          name: "BOGO & Bundle Promotions",
          status: "complete",
          percentage: 100,
          priority: "Priority #3",
        },
        {
          name: "Volume & Tiered Pricing",
          status: "partial",
          percentage: 50,
          priority: "Priority #4",
        },
        {
          name: "Order System Integration",
          status: "pending",
          percentage: 0,
          priority: "Priority #5",
        },
      ],
    },
  },
  {
    id: 7,
    title: "Feature #1: Customer Discount Management",
    type: "feature",
    content: {
      status: "COMPLETE",
      description: "Replace Excel-based customer pricing with automated discount rules",
      capabilities: [
        "Brand-level discount configuration",
        "Category and sub-category specific pricing",
        "Size-level granular discounts",
        "Individual customer assignment",
        "Percentage or dollar-based discounts",
        "Automatic start/end date management",
        "Audit trail for all pricing changes",
      ],
      businessImpact: "Eliminates manual pricing errors, reduces configuration time from hours to minutes",
      demoPath: "/customer-discounts/new",
    },
  },
  {
    id: 8,
    title: "Feature #2: Automated Inventory Discounts",
    type: "feature",
    content: {
      status: "COMPLETE",
      description: "Automatic pricing adjustments for aged inventory to prevent write-offs",
      capabilities: [
        "Expiration date-based automatic discounts",
        "THC percentage-based pricing rules",
        "Batch-level granularity",
        "Configurable discount thresholds",
        "Automatic application to qualifying inventory",
        "Real-time inventory monitoring",
        "Liquidation performance tracking",
      ],
      businessImpact: "Reduces inventory write-offs by 60%, eliminates manual liquidation decisions",
      demoPath: "/inventory-discounts/new",
    },
  },
  {
    id: 9,
    title: "Feature #3: BOGO & Bundle Promotions",
    type: "feature",
    content: {
      status: "COMPLETE",
      description: "Advanced promotional capabilities for revenue optimization",
      capabilities: [
        "Buy-One-Get-One (BOGO) promotions",
        "Product bundle creation and pricing",
        "Item, brand, or category-level BOGO",
        "Flexible discount amounts (%, $, or free)",
        "Promotional period scheduling",
        "Customer segment targeting",
        "Performance tracking and analytics",
      ],
      businessImpact: "Enables sophisticated promotional strategies, increases average order value by 25%",
      demoPath: "/promotions/new",
    },
  },
  {
    id: 10,
    title: "Feature #4: Analytics & Insights",
    type: "feature",
    content: {
      status: "COMPLETE",
      description: "Comprehensive analytics for data-driven pricing decisions",
      capabilities: [
        "Discount effectiveness tracking",
        "Customer segment analysis",
        "Promotional performance metrics",
        "Real-time system monitoring",
        "Revenue impact analysis",
        "Top-performing promotions dashboard",
        "Customer lifetime value tracking",
      ],
      businessImpact: "Provides visibility into pricing effectiveness, enables optimization strategies",
      demoPath: "/analytics",
    },
  },
  {
    id: 11,
    title: "Cloud Migration & Enterprise Authentication Roadmap",
    type: "migration-roadmap",
    content: {
      headline: "Strategic Infrastructure & Security Enhancements",
      phases: [
        {
          name: "AWS Migration",
          timeline: "Q2 2025",
          components: [
            "AWS RDS (PostgreSQL) - Database migration from Supabase",
            "AWS Lambda - Serverless API endpoints",
            "AWS API Gateway - API management and throttling",
            "AWS S3 - Static asset storage and backups",
            "AWS CloudFront - CDN for global performance",
            "AWS ElastiCache (Redis) - Session and cache management",
            "AWS CloudWatch - Monitoring and logging",
          ],
          benefits: [
            "Enterprise-grade scalability and reliability",
            "Reduced operational costs at scale",
            "Enhanced disaster recovery capabilities",
            "Improved global performance",
          ],
        },
        {
          name: "Azure AD Integration",
          timeline: "Q2 2025",
          components: [
            "Azure Active Directory - Employee SSO authentication",
            "Multi-factor authentication (MFA) enforcement",
            "Role-based access control (RBAC) via Azure AD groups",
            "Conditional access policies for security",
            "Azure AD B2B for external partner access",
            "Seamless integration with Microsoft 365",
          ],
          benefits: [
            "Centralized employee identity management",
            "Enhanced security with MFA and conditional access",
            "Simplified user provisioning and deprovisioning",
            "Compliance with enterprise security policies",
          ],
        },
      ],
    },
  },
  {
    id: 12,
    title: "Technical Architecture",
    type: "technical",
    content: {
      components: [
        {
          name: "API Layer",
          description: "50+ RESTful endpoints",
          details: "Full CRUD operations, <200ms response times",
        },
        {
          name: "Pricing Engine",
          description: "Rule-based calculation engine",
          details: "Supports multiple discount types, priority-based evaluation",
        },
        {
          name: "Database",
          description: "PostgreSQL with Supabase",
          details: "15+ tables, proper relationships, audit trails",
        },
        {
          name: "Real-time Updates",
          description: "WebSocket integration",
          details: "Live pricing updates, system monitoring",
        },
        {
          name: "Security",
          description: "Row-level security (RLS)",
          details: "Authentication, authorization, audit logging",
        },
      ],
      performance: {
        apiResponseTime: "<200ms",
        uptime: "99.9%",
        concurrentUsers: "500+",
      },
    },
  },
  {
    id: 13,
    title: "What's Working Today",
    type: "delivered",
    content: {
      features: [
        {
          name: "Customer Discount Management",
          status: "Production Ready",
          coverage: "100%",
        },
        {
          name: "Automated Inventory Discounts",
          status: "Production Ready",
          coverage: "100%",
        },
        {
          name: "BOGO Promotions",
          status: "Production Ready",
          coverage: "100%",
        },
        {
          name: "Bundle Deals",
          status: "Production Ready",
          coverage: "100%",
        },
        {
          name: "Analytics Dashboard",
          status: "Production Ready",
          coverage: "100%",
        },
        {
          name: "API Infrastructure",
          status: "Production Ready",
          coverage: "100%",
        },
      ],
      readiness: "Ready for pilot market deployment",
    },
  },
  {
    id: 14,
    title: "In Progress & Planned",
    type: "roadmap",
    content: {
      inProgress: [
        {
          name: "Volume & Tiered Pricing",
          status: "UI Complete, Backend 50%",
          timeline: "3-4 weeks",
          priority: "High",
        },
        {
          name: "Best Deal Logic",
          status: "Design Complete",
          timeline: "2-3 weeks",
          priority: "Critical",
        },
      ],
      planned: [
        {
          name: "Order System Integration",
          description: "Connect to quote-to-cash flow",
          timeline: "4-6 weeks",
          priority: "Critical",
        },
        {
          name: "ERP Integration",
          description: "Automated product/customer sync",
          timeline: "4-6 weeks",
          priority: "Critical",
        },
        {
          name: "Approval Workflows",
          description: "Governance for pricing changes",
          timeline: "2-3 weeks",
          priority: "Medium",
        },
        {
          name: "Vendor Rebate Automation",
          description: "Automated rebate calculation",
          timeline: "3-4 weeks",
          priority: "Medium",
        },
      ],
    },
  },
  {
    id: 15,
    title: "Critical Gaps for Production",
    type: "gaps",
    content: {
      critical: [
        {
          name: "Best Deal Logic",
          impact: "Customers may not receive best available price",
          effort: "2-3 weeks",
          risk: "High - Customer trust issue",
        },
        {
          name: "Order System Integration",
          impact: "Pricing engine isolated from order flow",
          effort: "4-6 weeks",
          risk: "Critical - Core requirement",
        },
        {
          name: "ERP Integration",
          impact: "Manual data entry required",
          effort: "4-6 weeks",
          risk: "Critical - Operational efficiency",
        },
      ],
      medium: [
        {
          name: "Volume Pricing Backend",
          impact: "Cannot support multi-tier strategies",
          effort: "3-4 weeks",
        },
        {
          name: "Approval Workflows",
          impact: "No governance for pricing changes",
          effort: "2-3 weeks",
        },
      ],
    },
  },
  {
    id: 16,
    title: "Business Impact & ROI",
    type: "roi",
    content: {
      metrics: [
        {
          category: "Time Savings",
          current: "40 hours/week on pricing",
          future: "4 hours/week",
          savings: "90% reduction",
        },
        {
          category: "Inventory Write-offs",
          current: "$500K+ annually",
          future: "$200K annually",
          savings: "$300K saved",
        },
        {
          category: "Pricing Errors",
          current: "15-20 errors/month",
          future: "<2 errors/month",
          savings: "90% reduction",
        },
        {
          category: "Promotional Revenue",
          current: "Limited capabilities",
          future: "25% increase in AOV",
          savings: "$1M+ revenue",
        },
      ],
      totalROI: "$2M+ annual value",
      paybackPeriod: "6 months",
    },
  },
  {
    id: 17,
    title: "Demo Walkthrough",
    type: "demo",
    content: {
      sections: [
        {
          name: "Customer Discounts",
          duration: "5 minutes",
          url: "/customer-discounts/new",
          highlights: [
            "Step-by-step wizard interface",
            "Brand/category/size level configuration",
            "Customer assignment",
            "Date range management",
          ],
        },
        {
          name: "Inventory Automation",
          duration: "5 minutes",
          url: "/inventory-discounts/new",
          highlights: [
            "Expiration-based rules",
            "THC percentage rules",
            "Automatic application",
            "Batch-level granularity",
          ],
        },
        {
          name: "BOGO & Bundles",
          duration: "5 minutes",
          url: "/promotions/new",
          highlights: [
            "BOGO creation wizard",
            "Bundle configuration",
            "Promotional scheduling",
            "Performance tracking",
          ],
        },
        {
          name: "Analytics Dashboard",
          duration: "5 minutes",
          url: "/analytics",
          highlights: [
            "Discount effectiveness",
            "Customer segments",
            "Promotional performance",
            "Real-time monitoring",
          ],
        },
      ],
    },
  },
  {
    id: 18,
    title: "Next Steps & Timeline",
    type: "timeline",
    content: {
      immediate: {
        title: "Next 2-4 Weeks",
        items: [
          "Complete best deal logic implementation",
          "Finish volume pricing backend",
          "Pilot market selection and preparation",
          "User training materials development",
        ],
      },
      shortTerm: {
        title: "Next 4-8 Weeks",
        items: [
          "Order system integration",
          "ERP synchronization",
          "Approval workflow implementation",
          "Pilot market deployment",
        ],
      },
      mediumTerm: {
        title: "Next 12-16 Weeks",
        items: [
          "Multi-market rollout",
          "Advanced analytics features",
          "Mobile optimization",
          "Third-party integrations",
        ],
      },
    },
  },
  {
    id: 19,
    title: "Questions & Discussion",
    type: "qa",
    content: {
      topics: [
        "Feature priorities and sequencing",
        "Integration requirements and timelines",
        "Pilot market selection",
        "Training and change management",
        "Success metrics and KPIs",
        "Budget and resource allocation",
      ],
    },
  },
]

export default function DemoPresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Slide Container */}
        <Card className="relative aspect-[16/9] overflow-hidden bg-white shadow-2xl">
          {/* Slide Content */}
          <div className="flex h-full flex-col overflow-y-auto p-12">
            {slide.type === "title" && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <h1 className="mb-4 text-6xl font-bold text-slate-900">{slide.title}</h1>
                <p className="mb-8 text-2xl text-slate-600">{slide.subtitle}</p>
                <div className="mt-12 space-y-2 text-slate-500">
                  <p className="text-lg">{slide.content.presenter}</p>
                  <p className="text-lg">{slide.content.date}</p>
                </div>
                <div className="mt-8 rounded-lg bg-emerald-50 px-6 py-3">
                  <p className="text-lg font-medium text-emerald-700">{slide.content.tagline}</p>
                </div>
              </div>
            )}

            {slide.type === "kpi" && (
              <>
                <h2 className="mb-6 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <p className="mb-6 text-lg text-slate-600">{slide.content.headline}</p>
                <div className="grid flex-1 grid-cols-2 gap-4">
                  {slide.content.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border-2 p-4 ${
                        kpi.status === "exceeding"
                          ? "border-emerald-200 bg-emerald-50"
                          : kpi.status === "improving"
                            ? "border-blue-200 bg-blue-50"
                            : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-600">{kpi.category}</p>
                          <h3 className="text-sm font-semibold text-slate-900">{kpi.metric}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {kpi.status === "improving" && <TrendingUp className="h-4 w-4 text-blue-600" />}
                          {kpi.status === "exceeding" && <Check className="h-4 w-4 text-emerald-600" />}
                          <span
                            className={`text-xs font-bold ${
                              kpi.status === "exceeding"
                                ? "text-emerald-700"
                                : kpi.status === "improving"
                                  ? "text-blue-700"
                                  : "text-amber-700"
                            }`}
                          >
                            {kpi.change}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-slate-500">Baseline</p>
                          <p className="font-medium text-slate-700">{kpi.current}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Target</p>
                          <p className="font-medium text-slate-700">{kpi.target}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Current</p>
                          <p
                            className={`font-bold ${
                              kpi.status === "exceeding"
                                ? "text-emerald-700"
                                : kpi.status === "improving"
                                  ? "text-blue-700"
                                  : "text-amber-700"
                            }`}
                          >
                            {kpi.actual}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slide.type === "page-inventory" && (
              <>
                <h2 className="mb-4 text-3xl font-bold text-slate-900">{slide.title}</h2>
                <p className="mb-4 text-sm text-slate-600">{slide.content.headline}</p>
                <div className="pb-4">
                  <div className="space-y-3">
                    {slide.content.pages.map((page, idx) => (
                      <div key={idx} className="rounded-lg border bg-slate-50 p-3">
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">{page.name}</h3>
                              <code className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                                {page.path}
                              </code>
                            </div>
                            <p className="mb-2 text-xs text-slate-600">{page.overview}</p>
                          </div>
                          <a
                            href={page.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                          >
                            View
                          </a>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <p className="font-medium text-slate-700">Functionality</p>
                            <p className="text-slate-600">{page.functionality}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Roles</p>
                            <p className="text-slate-600">{page.roles.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Dependencies</p>
                            <p className="text-slate-600">{page.dependencies.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Data</p>
                            <p className="text-slate-600">{page.data.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slide.type === "problem" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="grid flex-1 grid-cols-2 gap-6">
                  {slide.content.problems.map((problem, idx) => (
                    <div key={idx} className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
                      <h3 className="mb-2 text-xl font-semibold text-red-900">{problem.title}</h3>
                      <p className="mb-3 text-sm text-red-700">{problem.description}</p>
                      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {problem.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slide.type === "solution" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="mb-8 rounded-lg bg-emerald-50 p-6">
                  <h3 className="text-2xl font-semibold text-emerald-900">{slide.content.headline}</h3>
                </div>
                <div className="mb-8 flex-1 space-y-3">
                  {slide.content.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="mt-1 h-6 w-6 flex-shrink-0 text-emerald-600" />
                      <p className="text-lg text-slate-700">{benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-sm font-medium text-blue-600">Time to Value</p>
                    <p className="text-2xl font-bold text-blue-900">{slide.content.roi.timeToValue}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-4 text-center">
                    <p className="text-sm font-medium text-emerald-600">Expected Savings</p>
                    <p className="text-2xl font-bold text-emerald-900">{slide.content.roi.expectedSavings}</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-4 text-center">
                    <p className="text-sm font-medium text-amber-600">Efficiency Gain</p>
                    <p className="text-2xl font-bold text-amber-900">{slide.content.roi.efficiency}</p>
                  </div>
                </div>
              </>
            )}

            {slide.type === "status" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="mb-8 text-center">
                  <p className="text-6xl font-bold text-emerald-600">{slide.content.overall}</p>
                  <p className="text-lg text-slate-600">Overall Progress</p>
                </div>
                <div className="space-y-4">
                  {slide.content.phases.map((phase, idx) => (
                    <div key={idx} className="rounded-lg border bg-white p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {phase.status === "complete" && <Check className="h-5 w-5 text-emerald-600" />}
                          {phase.status === "partial" && <AlertCircle className="h-5 w-5 text-amber-600" />}
                          {phase.status === "pending" && <X className="h-5 w-5 text-slate-400" />}
                          <span className="font-semibold text-slate-900">{phase.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-600">{phase.priority}</span>
                          <span className="font-bold text-slate-900">{phase.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full ${
                            phase.status === "complete"
                              ? "bg-emerald-600"
                              : phase.status === "partial"
                                ? "bg-amber-600"
                                : "bg-slate-400"
                          }`}
                          style={{ width: `${phase.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slide.type === "feature" && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-4xl font-bold text-slate-900">{slide.title}</h2>
                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    {slide.content.status}
                  </span>
                </div>
                <p className="mb-6 text-lg text-slate-600">{slide.content.description}</p>
                <div className="mb-6 flex-1 space-y-2">
                  {slide.content.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <p className="text-slate-700">{capability}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-600">Business Impact</p>
                  <p className="text-blue-900">{slide.content.businessImpact}</p>
                </div>
                <div className="mt-4 rounded-lg bg-slate-100 p-3">
                  <p className="text-sm text-slate-600">
                    Demo Path: <code className="font-mono text-slate-900">{slide.content.demoPath}</code>
                  </p>
                </div>
              </>
            )}

            {slide.type === "technical" && (
              <>
                <h2 className="mb-6 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Current Architecture</h3>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {slide.content.components.map((component, idx) => (
                    <div key={idx} className="rounded-lg border bg-slate-50 p-3">
                      <h4 className="mb-1 text-sm font-semibold text-slate-900">{component.name}</h4>
                      <p className="mb-1 text-xs text-slate-600">{component.description}</p>
                      <p className="text-xs text-slate-500">{component.details}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <p className="text-xs font-medium text-emerald-600">API Response Time</p>
                    <p className="text-xl font-bold text-emerald-900">{slide.content.performance.apiResponseTime}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-xs font-medium text-blue-600">Uptime</p>
                    <p className="text-xl font-bold text-blue-900">{slide.content.performance.uptime}</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-center">
                    <p className="text-xs font-medium text-amber-600">Concurrent Users</p>
                    <p className="text-xl font-bold text-amber-900">{slide.content.performance.concurrentUsers}</p>
                  </div>
                </div>
              </>
            )}

            {slide.type === "migration-roadmap" && (
              <>
                <h2 className="mb-6 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <p className="mb-6 text-lg text-slate-600">{slide.content.headline}</p>
                <div className="grid grid-cols-2 gap-6">
                  {slide.content.phases.map((phase, idx) => (
                    <div key={idx} className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-blue-900">{phase.name}</h3>
                        <span className="rounded-full bg-blue-200 px-3 py-1 text-sm font-medium text-blue-800">
                          {phase.timeline}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="mb-2 text-sm font-semibold text-blue-800">Components:</p>
                        <ul className="space-y-1">
                          {phase.components.map((component, cIdx) => (
                            <li key={cIdx} className="text-sm text-blue-700">
                              • {component}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-semibold text-blue-800">Benefits:</p>
                        <ul className="space-y-1">
                          {phase.benefits.map((benefit, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2 text-sm text-blue-700">
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slide.type === "delivered" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="mb-6 grid flex-1 grid-cols-2 gap-4">
                  {slide.content.features.map((feature, idx) => (
                    <div key={idx} className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-emerald-900">{feature.name}</h3>
                        <Check className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="mb-1 text-sm text-emerald-700">{feature.status}</p>
                      <p className="text-xs text-emerald-600">{feature.coverage} Coverage</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-emerald-100 p-6 text-center">
                  <p className="text-xl font-semibold text-emerald-900">{slide.content.readiness}</p>
                </div>
              </>
            )}

            {slide.type === "roadmap" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold text-slate-900">In Progress</h3>
                  <div className="space-y-3">
                    {slide.content.inProgress.map((item, idx) => (
                      <div key={idx} className="rounded-lg border bg-amber-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-amber-900">{item.name}</h4>
                          <span className="text-sm font-medium text-amber-700">{item.priority}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-amber-700">{item.status}</span>
                          <span className="text-amber-600">{item.timeline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-slate-900">Planned</h3>
                  <div className="space-y-3">
                    {slide.content.planned.map((item, idx) => (
                      <div key={idx} className="rounded-lg border bg-slate-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">{item.name}</h4>
                          <span className="text-sm font-medium text-slate-600">{item.priority}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{item.description}</span>
                          <span className="text-slate-500">{item.timeline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slide.type === "gaps" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-semibold text-red-900">Critical Gaps</h3>
                  <div className="space-y-3">
                    {slide.content.critical.map((gap, idx) => (
                      <div key={idx} className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-red-900">{gap.name}</h4>
                          <span className="text-sm font-medium text-red-700">{gap.effort}</span>
                        </div>
                        <p className="mb-2 text-sm text-red-700">{gap.impact}</p>
                        <p className="text-xs font-medium text-red-600">{gap.risk}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-amber-900">Medium Priority</h3>
                  <div className="space-y-3">
                    {slide.content.medium.map((gap, idx) => (
                      <div key={idx} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold text-amber-900">{gap.name}</h4>
                          <span className="text-sm font-medium text-amber-700">{gap.effort}</span>
                        </div>
                        <p className="text-sm text-amber-700">{gap.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {slide.type === "roi" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="mb-6 flex-1 space-y-4">
                  {slide.content.metrics.map((metric, idx) => (
                    <div key={idx} className="rounded-lg border bg-white p-4">
                      <h3 className="mb-3 font-semibold text-slate-900">{metric.category}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Current</p>
                          <p className="font-medium text-red-600">{metric.current}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Future</p>
                          <p className="font-medium text-emerald-600">{metric.future}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Impact</p>
                          <p className="font-bold text-blue-600">{metric.savings}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-emerald-50 p-6 text-center">
                    <p className="text-sm font-medium text-emerald-600">Total Annual ROI</p>
                    <p className="text-3xl font-bold text-emerald-900">{slide.content.totalROI}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-6 text-center">
                    <p className="text-sm font-medium text-blue-600">Payback Period</p>
                    <p className="text-3xl font-bold text-blue-900">{slide.content.paybackPeriod}</p>
                  </div>
                </div>
              </>
            )}

            {slide.type === "demo" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="space-y-4">
                  {slide.content.sections.map((section, idx) => (
                    <div key={idx} className="rounded-lg border bg-white p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900">{section.name}</h3>
                        <span className="text-sm text-slate-600">{section.duration}</span>
                      </div>
                      <div className="mb-3 rounded bg-slate-100 p-2">
                        <code className="text-sm text-slate-700">{section.url}</code>
                      </div>
                      <ul className="space-y-1">
                        {section.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-blue-600">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            )}

            {slide.type === "timeline" && (
              <>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">{slide.title}</h2>
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-emerald-900">{slide.content.immediate.title}</h3>
                    <ul className="space-y-2">
                      {slide.content.immediate.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-800">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-blue-900">{slide.content.shortTerm.title}</h3>
                    <ul className="space-y-2">
                      {slide.content.shortTerm.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-blue-800">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-amber-900">{slide.content.mediumTerm.title}</h3>
                    <ul className="space-y-2">
                      {slide.content.mediumTerm.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-amber-800">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}

            {slide.type === "qa" && (
              <>
                <h2 className="mb-8 text-center text-5xl font-bold text-slate-900">{slide.title}</h2>
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div className="mb-8 grid grid-cols-2 gap-4">
                    {slide.content.topics.map((topic, idx) => (
                      <div key={idx} className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center">
                        <p className="font-medium text-blue-900">{topic}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl text-slate-600">Let's discuss your questions and priorities</p>
                </div>
              </>
            )}

            {/* Slide Number */}
            <div className="sticky bottom-0 right-0 mt-4 flex justify-end bg-white/80 py-2 backdrop-blur-sm">
              <span className="text-sm text-slate-400">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button onClick={prevSlide} disabled={currentSlide === 0} variant="outline" size="lg">
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentSlide ? "w-8 bg-blue-600" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <Button onClick={nextSlide} disabled={currentSlide === slides.length - 1} variant="outline" size="lg">
            Next
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Export Instructions */}
        <Card className="mt-6 bg-blue-50 p-6">
          <h3 className="mb-2 font-semibold text-blue-900">Export to Google Slides</h3>
          <p className="text-sm text-blue-700">
            Use the navigation to view each slide, then recreate in Google Slides using the same layout and content. All
            text, metrics, and structure are designed for easy manual transfer.
          </p>
        </Card>
      </div>
    </div>
  )
}
