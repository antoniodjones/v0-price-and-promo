"use client"

import { useState, useEffect } from "react"

export interface DiscountSettings {
  customerDiscountMax: number
  inventoryDiscountMax: number
  bundleDiscountMax: number
  volumeDiscountMax: number
  requireApproval: boolean
  stackDiscounts: boolean
}

export interface PricingSettings {
  minimumMargin: number
  bulkThreshold: number
  premiumMarkup: number
  currency: string
}

export interface ExpirationSettings {
  warningDays: number
  criticalDays: number
  warningDiscount: number
  criticalDiscount: number
  autoApply: boolean
  emailNotifications: boolean
}

export interface MarketSettings {
  primaryMarket: string
  taxRate: number
  activeMarkets: string[]
}

export interface NotificationSettings {
  emailAlerts: boolean
  lowMarginThreshold: number
  failedTestAlerts: boolean
  approvalRequests: boolean
  dailyReports: boolean
  weeklyReports: boolean
  reportEmail: string
  approvalEmail: string
}

export interface TestingSettings {
  defaultScenarios: string[]
  autoValidation: boolean
  testSchedule: string
  successThreshold: number
  maxTestDuration: number
  retryFailedTests: boolean
  notifyOnFailure: boolean
}

export interface IntegrationSettings {
  apiConnections: {
    enabled: boolean
    baseUrl: string
    apiKey: string
    timeout: number
    retryAttempts: number
  }
  webhooks: {
    enabled: boolean
    endpoints: Array<{
      id: string
      name: string
      url: string
      events: string[]
      active: boolean
    }>
    secretKey: string
  }
  externalDataSources: {
    inventorySync: boolean
    priceFeeds: boolean
    marketData: boolean
    syncInterval: string
  }
}

export interface AnalyticsSettings {
  dashboardPreferences: {
    defaultView: string
    refreshInterval: number
    showAdvancedMetrics: boolean
    customWidgets: string[]
  }
  reportScheduling: {
    enabled: boolean
    frequency: string
    recipients: string[]
    includeCharts: boolean
    format: string
  }
  dataExport: {
    autoExport: boolean
    exportFormat: string
    retentionDays: number
    includeRawData: boolean
  }
}

export interface UserManagementSettings {
  roleBasedPermissions: {
    enabled: boolean
    defaultRole: string
    requireApproval: boolean
  }
  teamAccess: {
    maxUsers: number
    sessionTimeout: number
    requireMFA: boolean
    allowGuestAccess: boolean
  }
  approvalWorkflows: {
    enabled: boolean
    approvalLevels: number
    escalationTime: number
    notifyApprovers: boolean
  }
}

export interface SecuritySettings {
  authentication: {
    sessionTimeout: number
    maxLoginAttempts: number
    lockoutDuration: number
    requirePasswordChange: boolean
    passwordChangeInterval: number
  }
  accessControl: {
    enableIPWhitelist: boolean
    allowedIPs: string[]
    requireSSL: boolean
    enableAuditLog: boolean
  }
  dataProtection: {
    encryptSensitiveData: boolean
    dataRetentionDays: number
    enableBackups: boolean
    backupFrequency: string
  }
}

export interface PerformanceSettings {
  systemMonitoring: {
    enableMonitoring: boolean
    cpuThreshold: number
    memoryThreshold: number
    diskThreshold: number
    responseTimeThreshold: number
  }
  autoScaling: {
    enabled: boolean
    minInstances: number
    maxInstances: number
    scaleUpThreshold: number
    scaleDownThreshold: number
  }
  resourceManagement: {
    maxConcurrentRequests: number
    requestTimeout: number
    cacheEnabled: boolean
    cacheTTL: number
  }
}

export interface EnterpriseSettings {
  multiTenant: {
    enabled: boolean
    organizationName: string
    customDomain: string
    whiteLabeling: {
      enabled: boolean
      logoUrl: string
      primaryColor: string
      secondaryColor: string
      customCSS: string
    }
    tenantIsolation: {
      dataIsolation: boolean
      resourceIsolation: boolean
      networkIsolation: boolean
    }
  }
  automation: {
    customRuleEngine: {
      enabled: boolean
      maxRules: number
      allowComplexLogic: boolean
      enableScheduledRules: boolean
    }
    aiMlPreferences: {
      enabled: boolean
      preferredProvider: string
      modelVersion: string
      confidenceThreshold: number
      autoRetraining: boolean
      dataPrivacy: string
    }
    workflowAutomation: {
      enabled: boolean
      maxWorkflows: number
      allowExternalTriggers: boolean
      enableConditionalLogic: boolean
    }
  }
  disasterRecovery: {
    backupStrategy: {
      enabled: boolean
      frequency: string
      retentionPeriod: number
      offSiteBackup: boolean
      encryptBackups: boolean
    }
    failoverConfiguration: {
      enabled: boolean
      primaryRegion: string
      secondaryRegion: string
      autoFailover: boolean
      failoverThreshold: number
      recoveryTimeObjective: number
    }
    businessContinuity: {
      emergencyContacts: string[]
      escalationProcedure: string
      communicationPlan: string
      testSchedule: string
    }
  }
}

export interface SettingsData {
  discounts: DiscountSettings
  pricing: PricingSettings
  expiration: ExpirationSettings
  markets: MarketSettings
  notifications: NotificationSettings
  testing: TestingSettings
  integrations: IntegrationSettings
  analytics: AnalyticsSettings
  userManagement: UserManagementSettings
  security: SecuritySettings
  performance: PerformanceSettings
  enterprise: EnterpriseSettings
}

// Default settings
export const defaultSettings: SettingsData = {
  discounts: {
    customerDiscountMax: 25,
    inventoryDiscountMax: 40,
    bundleDiscountMax: 30,
    volumeDiscountMax: 20,
    requireApproval: true,
    stackDiscounts: false,
  },
  pricing: {
    minimumMargin: 15,
    bulkThreshold: 500,
    premiumMarkup: 35,
    currency: "usd",
  },
  expiration: {
    warningDays: 30,
    criticalDays: 7,
    warningDiscount: 15,
    criticalDiscount: 35,
    autoApply: true,
    emailNotifications: false,
  },
  markets: {
    primaryMarket: "massachusetts",
    taxRate: 6.25,
    activeMarkets: ["massachusetts", "california"],
  },
  notifications: {
    emailAlerts: true,
    lowMarginThreshold: 10,
    failedTestAlerts: true,
    approvalRequests: true,
    dailyReports: false,
    weeklyReports: true,
    reportEmail: "",
    approvalEmail: "",
  },
  testing: {
    defaultScenarios: ["volume-pricing", "expiration-discount", "margin-validation"],
    autoValidation: true,
    testSchedule: "daily",
    successThreshold: 95,
    maxTestDuration: 30,
    retryFailedTests: true,
    notifyOnFailure: true,
  },
  integrations: {
    apiConnections: {
      enabled: false,
      baseUrl: "",
      apiKey: "",
      timeout: 30,
      retryAttempts: 3,
    },
    webhooks: {
      enabled: false,
      endpoints: [],
      secretKey: "",
    },
    externalDataSources: {
      inventorySync: false,
      priceFeeds: false,
      marketData: false,
      syncInterval: "hourly",
    },
  },
  analytics: {
    dashboardPreferences: {
      defaultView: "overview",
      refreshInterval: 300,
      showAdvancedMetrics: false,
      customWidgets: ["pricing-trends", "margin-analysis"],
    },
    reportScheduling: {
      enabled: false,
      frequency: "weekly",
      recipients: [],
      includeCharts: true,
      format: "pdf",
    },
    dataExport: {
      autoExport: false,
      exportFormat: "csv",
      retentionDays: 90,
      includeRawData: false,
    },
  },
  userManagement: {
    roleBasedPermissions: {
      enabled: false,
      defaultRole: "viewer",
      requireApproval: true,
    },
    teamAccess: {
      maxUsers: 10,
      sessionTimeout: 480,
      requireMFA: false,
      allowGuestAccess: false,
    },
    approvalWorkflows: {
      enabled: true,
      approvalLevels: 2,
      escalationTime: 24,
      notifyApprovers: true,
    },
  },
  security: {
    authentication: {
      sessionTimeout: 480,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      requirePasswordChange: true,
      passwordChangeInterval: 90,
    },
    accessControl: {
      enableIPWhitelist: false,
      allowedIPs: [],
      requireSSL: true,
      enableAuditLog: true,
    },
    dataProtection: {
      encryptSensitiveData: true,
      dataRetentionDays: 365,
      enableBackups: true,
      backupFrequency: "daily",
    },
  },
  performance: {
    systemMonitoring: {
      enableMonitoring: true,
      cpuThreshold: 80,
      memoryThreshold: 85,
      diskThreshold: 90,
      responseTimeThreshold: 2000,
    },
    autoScaling: {
      enabled: false,
      minInstances: 1,
      maxInstances: 10,
      scaleUpThreshold: 75,
      scaleDownThreshold: 25,
    },
    resourceManagement: {
      maxConcurrentRequests: 1000,
      requestTimeout: 30,
      cacheEnabled: true,
      cacheTTL: 300,
    },
  },
  enterprise: {
    multiTenant: {
      enabled: false,
      organizationName: "",
      customDomain: "",
      whiteLabeling: {
        enabled: false,
        logoUrl: "",
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        customCSS: "",
      },
      tenantIsolation: {
        dataIsolation: true,
        resourceIsolation: false,
        networkIsolation: false,
      },
    },
    automation: {
      customRuleEngine: {
        enabled: false,
        maxRules: 100,
        allowComplexLogic: false,
        enableScheduledRules: false,
      },
      aiMlPreferences: {
        enabled: false,
        preferredProvider: "openai",
        modelVersion: "gpt-4",
        confidenceThreshold: 0.8,
        autoRetraining: false,
        dataPrivacy: "strict",
      },
      workflowAutomation: {
        enabled: false,
        maxWorkflows: 50,
        allowExternalTriggers: false,
        enableConditionalLogic: false,
      },
    },
    disasterRecovery: {
      backupStrategy: {
        enabled: true,
        frequency: "daily",
        retentionPeriod: 30,
        offSiteBackup: false,
        encryptBackups: true,
      },
      failoverConfiguration: {
        enabled: false,
        primaryRegion: "us-east-1",
        secondaryRegion: "us-west-2",
        autoFailover: false,
        failoverThreshold: 5,
        recoveryTimeObjective: 60,
      },
      businessContinuity: {
        emergencyContacts: [],
        escalationProcedure: "",
        communicationPlan: "",
        testSchedule: "quarterly",
      },
    },
  },
}

// Storage functions
const STORAGE_KEY = "gti-business-settings"

async function getSettings(): Promise<SettingsData> {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        return { ...defaultSettings, ...settings }
      }
    }
    return defaultSettings
  } catch (error) {
    console.error("Failed to load settings:", error)
    return defaultSettings
  }
}

async function saveSettings(settings: SettingsData): Promise<boolean> {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      return true
    }
    return false
  } catch (error) {
    console.error("Failed to save settings:", error)
    return false
  }
}

// Validation function
export function validateSettings(settings: Partial<SettingsData>): string[] {
  const errors: string[] = []

  if (settings.discounts) {
    const { customerDiscountMax, inventoryDiscountMax, bundleDiscountMax, volumeDiscountMax } = settings.discounts
    const discounts = [
      { value: customerDiscountMax, name: "Customer discount" },
      { value: inventoryDiscountMax, name: "Inventory discount" },
      { value: bundleDiscountMax, name: "Bundle discount" },
      { value: volumeDiscountMax, name: "Volume discount" },
    ]

    discounts.forEach(({ value, name }) => {
      if (value && (value < 0 || value > 100)) {
        errors.push(`${name} must be between 0% and 100%`)
      }
    })
  }

  if (settings.pricing) {
    const { minimumMargin, bulkThreshold, premiumMarkup } = settings.pricing
    if (minimumMargin && (minimumMargin < 0 || minimumMargin > 100)) {
      errors.push("Minimum margin must be between 0% and 100%")
    }
    if (bulkThreshold && bulkThreshold < 1) {
      errors.push("Bulk threshold must be at least 1 unit")
    }
    if (premiumMarkup && (premiumMarkup < 0 || premiumMarkup > 200)) {
      errors.push("Premium markup must be between 0% and 200%")
    }
  }

  if (settings.expiration) {
    const { warningDays, criticalDays, warningDiscount, criticalDiscount } = settings.expiration
    if (warningDays && warningDays < 1) errors.push("Warning period must be at least 1 day")
    if (criticalDays && criticalDays < 1) errors.push("Critical period must be at least 1 day")
    if (warningDays && criticalDays && warningDays <= criticalDays) {
      errors.push("Warning period must be longer than critical period")
    }
    if (warningDiscount && (warningDiscount < 0 || warningDiscount > 100)) {
      errors.push("Warning discount must be between 0% and 100%")
    }
    if (criticalDiscount && (criticalDiscount < 0 || criticalDiscount > 100)) {
      errors.push("Critical discount must be between 0% and 100%")
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (settings.notifications) {
    const { lowMarginThreshold, reportEmail, approvalEmail } = settings.notifications
    if (lowMarginThreshold && (lowMarginThreshold < 0 || lowMarginThreshold > 100)) {
      errors.push("Low margin threshold must be between 0% and 100%")
    }
    if (reportEmail && !emailRegex.test(reportEmail)) {
      errors.push("Report email must be a valid email address")
    }
    if (approvalEmail && !emailRegex.test(approvalEmail)) {
      errors.push("Approval email must be a valid email address")
    }
  }

  return errors
}

// Settings hook
export function useSettings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await getSettings()
        setSettings(loadedSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSetting = async (path: string, value: any) => {
    try {
      const keys = path.split(".")
      const newSettings = { ...settings }
      let current: any = newSettings

      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      // Set the value
      current[keys[keys.length - 1]] = value

      // Validate the settings
      const errors = validateSettings(newSettings)
      if (errors.length > 0) {
        console.warn("Settings validation warnings:", errors)
      }

      // Save and update state
      await saveSettings(newSettings)
      setSettings(newSettings)
    } catch (error) {
      console.error("Failed to update setting:", error)
    }
  }

  return {
    settings,
    loading,
    updateSetting,
  }
}
