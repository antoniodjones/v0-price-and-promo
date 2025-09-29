import { createClient } from "@/lib/supabase/client"
import { logInfo, logError, logWarn } from "@/lib/logger"

export interface SystemModule {
  id: string
  module_id: string
  name: string
  description?: string
  enabled: boolean
  risk_level: "low" | "medium" | "high"
  domain: "core" | "pricing" | "analytics" | "admin"
  dependencies: string[]
  components: string[]
  routes: string[]
  version: string
  created_at: string
  updated_at: string
}

export interface ModuleAuditLog {
  id: string
  module_id: string
  action: "enabled" | "disabled" | "updated"
  changed_by?: string
  previous_state?: any
  new_state?: any
  reason?: string
  created_at: string
}

export interface ModuleValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  dependencyChain: string[]
}

export class ModuleManagementService {
  private supabase = createClient()

  async getAllModules(): Promise<SystemModule[]> {
    try {
      const { data, error } = await this.supabase
        .from("system_modules")
        .select("*")
        .order("domain", { ascending: true })
        .order("name", { ascending: true })

      if (error) throw error

      logInfo("Retrieved system modules", { count: data?.length || 0 })
      return data || []
    } catch (error) {
      logError("Failed to retrieve system modules", error)
      return []
    }
  }

  async getModulesByDomain(domain: string): Promise<SystemModule[]> {
    try {
      const { data, error } = await this.supabase
        .from("system_modules")
        .select("*")
        .eq("domain", domain)
        .order("name", { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      logError(`Failed to retrieve modules for domain: ${domain}`, error)
      return []
    }
  }

  async getEnabledModules(): Promise<SystemModule[]> {
    try {
      const { data, error } = await this.supabase
        .from("system_modules")
        .select("*")
        .eq("enabled", true)
        .order("domain", { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Failed to retrieve enabled modules", error)
      return []
    }
  }

  async validateModuleDependencies(moduleId: string, targetState: boolean): Promise<ModuleValidationResult> {
    try {
      const modules = await this.getAllModules()
      const targetModule = modules.find((m) => m.module_id === moduleId)

      if (!targetModule) {
        return {
          valid: false,
          errors: [`Module ${moduleId} not found`],
          warnings: [],
          dependencyChain: [],
        }
      }

      const errors: string[] = []
      const warnings: string[] = []
      const dependencyChain: string[] = []

      if (targetState) {
        // Enabling module - check if dependencies are enabled
        const missingDeps = this.findMissingDependencies(targetModule, modules)
        if (missingDeps.length > 0) {
          errors.push(`Missing dependencies: ${missingDeps.join(", ")}`)
        }
        dependencyChain.push(...this.buildDependencyChain(targetModule, modules))
      } else {
        // Disabling module - check if other modules depend on it
        const dependentModules = this.findDependentModules(targetModule, modules)
        if (dependentModules.length > 0) {
          errors.push(`Cannot disable: Required by ${dependentModules.map((m) => m.name).join(", ")}`)
        }

        // Check if it's a core module
        if (targetModule.domain === "core" && targetModule.risk_level === "low") {
          warnings.push("Disabling core modules may cause system instability")
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        dependencyChain,
      }
    } catch (error) {
      logError("Failed to validate module dependencies", error)
      return {
        valid: false,
        errors: ["Validation failed due to system error"],
        warnings: [],
        dependencyChain: [],
      }
    }
  }

  async toggleModule(moduleId: string, enabled: boolean, reason?: string): Promise<boolean> {
    try {
      // Validate dependencies first
      const validation = await this.validateModuleDependencies(moduleId, enabled)
      if (!validation.valid) {
        logWarn(`Module toggle validation failed for ${moduleId}`, { errors: validation.errors })
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
      }

      // Get current state for audit
      const { data: currentModule } = await this.supabase
        .from("system_modules")
        .select("*")
        .eq("module_id", moduleId)
        .single()

      if (!currentModule) {
        throw new Error(`Module ${moduleId} not found`)
      }

      // Update module state
      const { error: updateError } = await this.supabase
        .from("system_modules")
        .update({
          enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("module_id", moduleId)

      if (updateError) throw updateError

      // Log audit entry
      await this.logModuleChange(
        moduleId,
        enabled ? "enabled" : "disabled",
        currentModule,
        { ...currentModule, enabled },
        reason,
      )

      logInfo(`Module ${moduleId} ${enabled ? "enabled" : "disabled"}`, { reason })
      return true
    } catch (error) {
      logError(`Failed to toggle module ${moduleId}`, error)
      throw error
    }
  }

  async updateModule(moduleId: string, updates: Partial<SystemModule>, reason?: string): Promise<boolean> {
    try {
      // Get current state for audit
      const { data: currentModule } = await this.supabase
        .from("system_modules")
        .select("*")
        .eq("module_id", moduleId)
        .single()

      if (!currentModule) {
        throw new Error(`Module ${moduleId} not found`)
      }

      // Update module
      const { error: updateError } = await this.supabase
        .from("system_modules")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("module_id", moduleId)

      if (updateError) throw updateError

      // Log audit entry
      await this.logModuleChange(moduleId, "updated", currentModule, { ...currentModule, ...updates }, reason)

      logInfo(`Module ${moduleId} updated`, { updates, reason })
      return true
    } catch (error) {
      logError(`Failed to update module ${moduleId}`, error)
      throw error
    }
  }

  async getModuleAuditLog(moduleId?: string, limit = 50): Promise<ModuleAuditLog[]> {
    try {
      let query = this.supabase
        .from("system_module_audit")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (moduleId) {
        query = query.eq("module_id", moduleId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      logError("Failed to retrieve module audit log", error)
      return []
    }
  }

  private findMissingDependencies(module: SystemModule, allModules: SystemModule[]): string[] {
    return module.dependencies.filter((depId) => {
      const depModule = allModules.find((m) => m.module_id === depId)
      return !depModule || !depModule.enabled
    })
  }

  private findDependentModules(module: SystemModule, allModules: SystemModule[]): SystemModule[] {
    return allModules.filter(
      (m) => m.enabled && m.dependencies.includes(module.module_id) && m.module_id !== module.module_id,
    )
  }

  private buildDependencyChain(module: SystemModule, allModules: SystemModule[]): string[] {
    const chain: string[] = []
    const visited = new Set<string>()

    const buildChain = (moduleId: string) => {
      if (visited.has(moduleId)) return
      visited.add(moduleId)

      const mod = allModules.find((m) => m.module_id === moduleId)
      if (!mod) return

      chain.push(mod.name)
      mod.dependencies.forEach((depId) => buildChain(depId))
    }

    buildChain(module.module_id)
    return chain
  }

  private async logModuleChange(
    moduleId: string,
    action: "enabled" | "disabled" | "updated",
    previousState: any,
    newState: any,
    reason?: string,
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      await this.supabase.from("system_module_audit").insert({
        module_id: moduleId,
        action,
        changed_by: user?.id,
        previous_state: previousState,
        new_state: newState,
        reason,
      })
    } catch (error) {
      logError("Failed to log module change", error)
      // Don't throw - audit logging failure shouldn't block the operation
    }
  }
}

export const moduleManager = new ModuleManagementService()
