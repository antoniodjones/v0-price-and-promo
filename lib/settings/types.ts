"use client"

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
