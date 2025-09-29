"use client"

import { useEffect } from "react"

import { useState } from "react"

// Module Registry System for GTI Pricing Engine
// Provides controlled feature rollout and dependency management

export type ModuleRiskLevel = "low" | "medium" | "high"
export type ModuleDomain = "core" | "pricing" | "analytics" | "admin" | "auth"
export type ModuleStatus = "enabled" | "disabled" | "error" | "loading"

export interface ModuleConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  dependencies: string[]
  riskLevel: ModuleRiskLevel
  domain: ModuleDomain
  components: string[]
  routes: string[]
  version: string
  status: ModuleStatus
  lastUpdated: Date
  errorMessage?: string
}

export interface ModuleRegistry {
  modules: Record<string, ModuleConfig>
  enabledModules: Set<string>
  loadedModules: Set<string>
}

// Core modules that are always enabled
export const CORE_MODULES: Record<string, Omit<ModuleConfig, "status" | "lastUpdated">> = {
  "error-handling": {
    id: "error-handling",
    name: "Error Handling",
    description: "Global error boundaries and error prevention infrastructure",
    enabled: true,
    dependencies: [],
    riskLevel: "low",
    domain: "core",
    components: ["ErrorBoundary", "ErrorFallback", "GlobalErrorHandler"],
    routes: [],
    version: "1.0.0",
  },
  "ui-atoms": {
    id: "ui-atoms",
    name: "UI Atoms",
    description: "Basic UI components (Button, Input, Card, etc.)",
    enabled: true,
    dependencies: ["error-handling"],
    riskLevel: "low",
    domain: "core",
    components: ["Button", "Input", "Card", "Badge", "Loading"],
    routes: [],
    version: "1.0.0",
  },
  "layout-system": {
    id: "layout-system",
    name: "Layout System",
    description: "Application layout and navigation components",
    enabled: true,
    dependencies: ["ui-atoms"],
    riskLevel: "low",
    domain: "core",
    components: ["AppLayout", "Header", "Sidebar", "Navigation"],
    routes: ["/"],
    version: "1.0.0",
  },
  "settings-system": {
    id: "settings-system",
    name: "Settings System",
    description: "Application configuration and settings management",
    enabled: true,
    dependencies: ["layout-system"],
    riskLevel: "medium",
    domain: "core",
    components: ["SettingsPage", "SettingsSidebar", "SettingsSection"],
    routes: ["/settings"],
    version: "1.0.0",
  },
}

// Business modules that can be enabled/disabled
export const BUSINESS_MODULES: Record<string, Omit<ModuleConfig, "status" | "lastUpdated">> = {
  authentication: {
    id: "authentication",
    name: "Authentication",
    description: "User authentication and authorization system",
    enabled: false, // Start disabled for safety
    dependencies: ["settings-system"],
    riskLevel: "medium",
    domain: "auth",
    components: ["LoginForm", "UserMenu", "ProtectedRoute", "AuthProvider"],
    routes: ["/login", "/logout", "/profile"],
    version: "1.0.0",
  },
  "pricing-engine": {
    id: "pricing-engine",
    name: "Pricing Engine",
    description: "Core pricing calculation and management system",
    enabled: false,
    dependencies: ["authentication"],
    riskLevel: "high",
    domain: "pricing",
    components: ["ProductList", "PricingCalculator", "PriceHistory"],
    routes: ["/pricing", "/products", "/pricing-history"],
    version: "1.0.0",
  },
  "customer-discounts": {
    id: "customer-discounts",
    name: "Customer Discounts",
    description: "Customer-specific discount management",
    enabled: false,
    dependencies: ["pricing-engine"],
    riskLevel: "high",
    domain: "pricing",
    components: ["CustomerDiscountList", "CustomerDiscountWizard", "DiscountAssignment"],
    routes: ["/customer-discounts"],
    version: "1.0.0",
  },
  "inventory-discounts": {
    id: "inventory-discounts",
    name: "Inventory Discounts",
    description: "Automated inventory-based discount system",
    enabled: false,
    dependencies: ["pricing-engine"],
    riskLevel: "high",
    domain: "pricing",
    components: ["InventoryDiscountList", "AutoDiscountWizard", "InventoryMonitor"],
    routes: ["/inventory-discounts"],
    version: "1.0.0",
  },
  promotions: {
    id: "promotions",
    name: "Promotions",
    description: "BOGO and bundle promotion management",
    enabled: false,
    dependencies: ["customer-discounts"],
    riskLevel: "high",
    domain: "pricing",
    components: ["PromotionList", "BOGOWizard", "BundleWizard"],
    routes: ["/promotions", "/bogo", "/bundles"],
    version: "1.0.0",
  },
  analytics: {
    id: "analytics",
    name: "Analytics",
    description: "Business intelligence and reporting system",
    enabled: false,
    dependencies: ["pricing-engine"],
    riskLevel: "high",
    domain: "analytics",
    components: ["Dashboard", "Reports", "Analytics", "Charts"],
    routes: ["/analytics", "/reports", "/dashboard"],
    version: "1.0.0",
  },
  "admin-tools": {
    id: "admin-tools",
    name: "Admin Tools",
    description: "System administration and management tools",
    enabled: false,
    dependencies: ["analytics"],
    riskLevel: "high",
    domain: "admin",
    components: ["UserManagement", "SystemSettings", "AuditLog"],
    routes: ["/admin", "/users", "/system"],
    version: "1.0.0",
  },
  "real-time-features": {
    id: "real-time-features",
    name: "Real-time Features",
    description: "WebSocket-based real-time updates and notifications",
    enabled: false,
    dependencies: ["admin-tools"],
    riskLevel: "high",
    domain: "core",
    components: ["WebSocketProvider", "LiveNotifications", "RealTimeUpdates"],
    routes: [],
    version: "1.0.0",
  },
}

// Module registry singleton
class ModuleRegistryManager {
  private registry: ModuleRegistry
  private listeners: Set<(registry: ModuleRegistry) => void> = new Set()

  constructor() {
    this.registry = this.initializeRegistry()
  }

  private initializeRegistry(): ModuleRegistry {
    const modules: Record<string, ModuleConfig> = {}
    const now = new Date()

    // Initialize core modules (always enabled)
    Object.values(CORE_MODULES).forEach((module) => {
      modules[module.id] = {
        ...module,
        status: "enabled",
        lastUpdated: now,
      }
    })

    // Initialize business modules (disabled by default)
    Object.values(BUSINESS_MODULES).forEach((module) => {
      modules[module.id] = {
        ...module,
        status: module.enabled ? "enabled" : "disabled",
        lastUpdated: now,
      }
    })

    return {
      modules,
      enabledModules: new Set(Object.keys(CORE_MODULES)),
      loadedModules: new Set(),
    }
  }

  getRegistry(): ModuleRegistry {
    return { ...this.registry }
  }

  getModule(moduleId: string): ModuleConfig | null {
    return this.registry.modules[moduleId] || null
  }

  isModuleEnabled(moduleId: string): boolean {
    return this.registry.enabledModules.has(moduleId)
  }

  isModuleLoaded(moduleId: string): boolean {
    return this.registry.loadedModules.has(moduleId)
  }

  canEnableModule(moduleId: string): { canEnable: boolean; reason?: string } {
    const module = this.getModule(moduleId)
    if (!module) {
      return { canEnable: false, reason: "Module not found" }
    }

    if (module.status === "enabled") {
      return { canEnable: false, reason: "Module already enabled" }
    }

    // Check dependencies
    for (const depId of module.dependencies) {
      if (!this.isModuleEnabled(depId)) {
        const depModule = this.getModule(depId)
        return {
          canEnable: false,
          reason: `Dependency "${depModule?.name || depId}" is not enabled`,
        }
      }
    }

    return { canEnable: true }
  }

  async enableModule(moduleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const canEnable = this.canEnableModule(moduleId)
      if (!canEnable.canEnable) {
        return { success: false, error: canEnable.reason }
      }

      const module = this.getModule(moduleId)!

      // Update module status
      this.registry.modules[moduleId] = {
        ...module,
        enabled: true,
        status: "loading",
        lastUpdated: new Date(),
      }

      this.registry.enabledModules.add(moduleId)
      this.notifyListeners()

      // Simulate module loading (in real app, this would load components)
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Mark as loaded
      this.registry.modules[moduleId].status = "enabled"
      this.registry.loadedModules.add(moduleId)
      this.notifyListeners()

      console.log(`[v0] Module "${module.name}" enabled successfully`)
      return { success: true }
    } catch (error) {
      const module = this.getModule(moduleId)
      if (module) {
        this.registry.modules[moduleId] = {
          ...module,
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          lastUpdated: new Date(),
        }
      }
      this.notifyListeners()
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async disableModule(moduleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const module = this.getModule(moduleId)
      if (!module) {
        return { success: false, error: "Module not found" }
      }

      // Check if this is a core module
      if (CORE_MODULES[moduleId]) {
        return { success: false, error: "Core modules cannot be disabled" }
      }

      // Check if other modules depend on this one
      const dependentModules = Object.values(this.registry.modules)
        .filter((m) => m.dependencies.includes(moduleId) && this.isModuleEnabled(m.id))
        .map((m) => m.name)

      if (dependentModules.length > 0) {
        return {
          success: false,
          error: `Cannot disable: ${dependentModules.join(", ")} depend on this module`,
        }
      }

      // Disable the module
      this.registry.modules[moduleId] = {
        ...module,
        enabled: false,
        status: "disabled",
        lastUpdated: new Date(),
      }

      this.registry.enabledModules.delete(moduleId)
      this.registry.loadedModules.delete(moduleId)
      this.notifyListeners()

      console.log(`[v0] Module "${module.name}" disabled successfully`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  getModulesByDomain(domain: ModuleDomain): ModuleConfig[] {
    return Object.values(this.registry.modules)
      .filter((module) => module.domain === domain)
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  getEnabledRoutes(): string[] {
    return Object.values(this.registry.modules)
      .filter((module) => this.isModuleEnabled(module.id))
      .flatMap((module) => module.routes)
  }

  subscribe(listener: (registry: ModuleRegistry) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getRegistry())
      } catch (error) {
        console.error("[v0] Error in module registry listener:", error)
      }
    })
  }
}

// Export singleton instance
export const moduleRegistry = new ModuleRegistryManager()

// React hook for using module registry
export function useModuleRegistry() {
  const [registry, setRegistry] = useState<ModuleRegistry>(moduleRegistry.getRegistry())

  useEffect(() => {
    const unsubscribe = moduleRegistry.subscribe(setRegistry)
    return unsubscribe
  }, [])

  return {
    registry,
    isModuleEnabled: (moduleId: string) => moduleRegistry.isModuleEnabled(moduleId),
    isModuleLoaded: (moduleId: string) => moduleRegistry.isModuleLoaded(moduleId),
    enableModule: (moduleId: string) => moduleRegistry.enableModule(moduleId),
    disableModule: (moduleId: string) => moduleRegistry.disableModule(moduleId),
    canEnableModule: (moduleId: string) => moduleRegistry.canEnableModule(moduleId),
    getModule: (moduleId: string) => moduleRegistry.getModule(moduleId),
    getModulesByDomain: (domain: ModuleDomain) => moduleRegistry.getModulesByDomain(domain),
    getEnabledRoutes: () => moduleRegistry.getEnabledRoutes(),
  }
}
