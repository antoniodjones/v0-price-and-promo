"use client"

import { lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Save, RotateCcw } from "lucide-react"
import { useSettings } from "@/lib/settings"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { useState } from "react"

const DiscountSettings = lazy(() => import("@/components/settings/sections/discount-settings"))
const PricingSettings = lazy(() => import("@/components/settings/sections/pricing-settings"))
const ExpirationSettings = lazy(() => import("@/components/settings/sections/expiration-settings"))
const MarketSettings = lazy(() => import("@/components/settings/sections/market-settings"))
const NotificationSettings = lazy(() => import("@/components/settings/sections/notification-settings"))
const TestingSettings = lazy(() => import("@/components/settings/sections/testing-settings"))
const IntegrationSettings = lazy(() => import("@/components/settings/sections/integration-settings"))
const AnalyticsSettings = lazy(() => import("@/components/settings/sections/analytics-settings"))
const UserSettings = lazy(() => import("@/components/settings/sections/user-settings"))
const SecuritySettings = lazy(() => import("@/components/settings/sections/security-settings"))
const PerformanceSettings = lazy(() => import("@/components/settings/sections/performance-settings"))
const MultiTenantSettings = lazy(() => import("@/components/settings/sections/multi-tenant-settings"))
const AutomationSettings = lazy(() => import("@/components/settings/sections/automation-settings"))
const DisasterRecoverySettings = lazy(() => import("@/components/settings/sections/disaster-recovery-settings"))
const DocumentationSettings = lazy(() => import("@/components/settings/sections/documentation-settings"))
const TaskPlanSettings = lazy(() => import("@/components/settings/sections/task-plan-settings"))
const TestValidationSettings = lazy(() => import("@/components/settings/sections/test-validation-settings"))

const navigationGroups = [
  {
    id: "business",
    label: "Business Rules",
    icon: "DollarSign",
    defaultExpanded: true,
    items: [
      {
        id: "discounts",
        label: "Discounts",
        icon: "Percent",
        description: "Configure discount limits and policies",
      },
      {
        id: "pricing",
        label: "Pricing",
        icon: "DollarSign",
        description: "Set pricing rules and margins",
      },
      {
        id: "expiration",
        label: "Expiration",
        icon: "Clock",
        description: "Manage expiration date handling",
      },
      {
        id: "markets",
        label: "Markets",
        icon: "MapPin",
        description: "Configure market-specific settings",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "Bot",
    defaultExpanded: true,
    items: [
      {
        id: "documentation",
        label: "Documentation",
        icon: "FileCode",
        description: "Manage system documentation",
      },
      {
        id: "task-plan",
        label: "Task Plan",
        icon: "ClipboardList",
        description: "View and manage task plans",
      },
      {
        id: "test-validation",
        label: "Test Validation",
        icon: "TestTube2",
        description: "Configure testing and validation",
      },
      {
        id: "automation",
        label: "Automation",
        icon: "Bot",
        description: "Configure automated workflows",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    icon: "Zap",
    defaultExpanded: false,
    items: [
      {
        id: "notifications",
        label: "Notifications",
        icon: "Bell",
        description: "Configure notification preferences",
      },
      {
        id: "integrations",
        label: "Integrations",
        icon: "Plug",
        description: "Manage third-party integrations",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "BarChart3",
        description: "Configure analytics and reporting",
      },
      {
        id: "performance",
        label: "Performance",
        icon: "Zap",
        description: "Optimize system performance",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Access",
    icon: "Shield",
    defaultExpanded: false,
    items: [
      {
        id: "users",
        label: "Users",
        icon: "Users",
        description: "Manage user accounts",
      },
      {
        id: "security",
        label: "Security",
        icon: "Shield",
        description: "Configure security settings",
      },
      {
        id: "multi-tenant",
        label: "Multi-Tenant",
        icon: "Building",
        description: "Configure multi-tenancy",
      },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: "HardDrive",
    defaultExpanded: false,
    items: [
      {
        id: "testing",
        label: "Testing",
        icon: "TestTube",
        description: "Configure testing environment",
      },
      {
        id: "disaster-recovery",
        label: "Disaster Recovery",
        icon: "HardDrive",
        description: "Configure backup and recovery",
      },
    ],
  },
]

export default function SettingsPage() {
  const { settings, loading, updateSetting } = useSettings()
  const [activeSection, setActiveSection] = useState("discounts")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const renderSettingsSection = () => {
    const componentMap = {
      discounts: <DiscountSettings settings={settings} updateSetting={updateSetting} />,
      pricing: <PricingSettings settings={settings} updateSetting={updateSetting} />,
      expiration: <ExpirationSettings settings={settings} updateSetting={updateSetting} />,
      markets: <MarketSettings settings={settings} updateSetting={updateSetting} />,
      notifications: <NotificationSettings settings={settings} updateSetting={updateSetting} />,
      testing: <TestingSettings settings={settings} updateSetting={updateSetting} />,
      "task-plan": <TaskPlanSettings />,
      "test-validation": <TestValidationSettings />,
      integrations: <IntegrationSettings settings={settings} updateSetting={updateSetting} />,
      analytics: <AnalyticsSettings settings={settings} updateSetting={updateSetting} />,
      users: <UserSettings settings={settings} updateSetting={updateSetting} />,
      security: <SecuritySettings settings={settings} updateSetting={updateSetting} />,
      performance: <PerformanceSettings settings={settings} updateSetting={updateSetting} />,
      "multi-tenant": <MultiTenantSettings settings={settings} updateSetting={updateSetting} />,
      automation: <AutomationSettings settings={settings} updateSetting={updateSetting} />,
      "disaster-recovery": <DisasterRecoverySettings settings={settings} updateSetting={updateSetting} />,
      documentation: <DocumentationSettings />,
    }

    return componentMap[activeSection as keyof typeof componentMap] || null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure business rules and preferences for your pricing engine</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-gti-dark-green hover:bg-gti-medium-green">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[600px]">
        <SettingsSidebar
          navigationGroups={navigationGroups}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex-1 p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            }
          >
            {renderSettingsSection()}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
