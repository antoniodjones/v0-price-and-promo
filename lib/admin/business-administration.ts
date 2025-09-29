import { createClient } from "@/lib/supabase/client"
import { logInfo, logError } from "@/lib/logger"

export interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  status: "active" | "inactive" | "suspended"
  subscription_tier: "basic" | "professional" | "enterprise"
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface BusinessRule {
  id: string
  tenant_id: string
  rule_type: string
  name: string
  description?: string
  conditions: Record<string, any>
  actions: Record<string, any>
  priority: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface ExternalIntegration {
  id: string
  tenant_id: string
  integration_type: string
  name: string
  description?: string
  config: Record<string, any>
  status: "active" | "inactive" | "error" | "testing"
  last_sync?: string
  sync_frequency: string
  created_at: string
  updated_at: string
}

export interface DataJob {
  id: string
  tenant_id: string
  job_type: "import" | "export"
  data_type: string
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  file_path?: string
  file_size?: number
  records_processed: number
  records_total: number
  error_message?: string
  metadata: Record<string, any>
  created_by?: string
  created_at: string
  completed_at?: string
}

export interface SystemConfig {
  id: string
  config_key: string
  config_value: any
  description?: string
  category: string
  is_sensitive: boolean
  updated_by?: string
  created_at: string
  updated_at: string
}

export class BusinessAdministrationService {
  private supabase = createClient()

  // Tenant Management
  async getTenants(): Promise<Tenant[]> {
    try {
      const { data, error } = await this.supabase.from("tenants").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      logError("Failed to retrieve tenants", error)
      return []
    }
  }

  async createTenant(tenant: Omit<Tenant, "id" | "created_at" | "updated_at">): Promise<Tenant | null> {
    try {
      const { data, error } = await this.supabase.from("tenants").insert(tenant).select().single()

      if (error) throw error
      logInfo("Tenant created", { tenantId: data.id, name: tenant.name })
      return data
    } catch (error) {
      logError("Failed to create tenant", error)
      return null
    }
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("tenants")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
      logInfo("Tenant updated", { tenantId: id, updates })
      return true
    } catch (error) {
      logError("Failed to update tenant", error)
      return false
    }
  }

  // Business Rules Management
  async getBusinessRules(tenantId?: string): Promise<BusinessRule[]> {
    try {
      let query = this.supabase.from("business_rules").select("*").order("priority", { ascending: false })

      if (tenantId) {
        query = query.eq("tenant_id", tenantId)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      logError("Failed to retrieve business rules", error)
      return []
    }
  }

  async createBusinessRule(rule: Omit<BusinessRule, "id" | "created_at" | "updated_at">): Promise<BusinessRule | null> {
    try {
      const { data, error } = await this.supabase.from("business_rules").insert(rule).select().single()

      if (error) throw error
      logInfo("Business rule created", { ruleId: data.id, name: rule.name })
      return data
    } catch (error) {
      logError("Failed to create business rule", error)
      return null
    }
  }

  async updateBusinessRule(id: string, updates: Partial<BusinessRule>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("business_rules")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
      logInfo("Business rule updated", { ruleId: id, updates })
      return true
    } catch (error) {
      logError("Failed to update business rule", error)
      return false
    }
  }

  async deleteBusinessRule(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("business_rules").delete().eq("id", id)

      if (error) throw error
      logInfo("Business rule deleted", { ruleId: id })
      return true
    } catch (error) {
      logError("Failed to delete business rule", error)
      return false
    }
  }

  // External Integrations Management
  async getExternalIntegrations(tenantId?: string): Promise<ExternalIntegration[]> {
    try {
      let query = this.supabase.from("external_integrations").select("*").order("created_at", { ascending: false })

      if (tenantId) {
        query = query.eq("tenant_id", tenantId)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      logError("Failed to retrieve external integrations", error)
      return []
    }
  }

  async createExternalIntegration(
    integration: Omit<ExternalIntegration, "id" | "created_at" | "updated_at">,
  ): Promise<ExternalIntegration | null> {
    try {
      const { data, error } = await this.supabase.from("external_integrations").insert(integration).select().single()

      if (error) throw error
      logInfo("External integration created", { integrationId: data.id, name: integration.name })
      return data
    } catch (error) {
      logError("Failed to create external integration", error)
      return null
    }
  }

  async updateExternalIntegration(id: string, updates: Partial<ExternalIntegration>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("external_integrations")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
      logInfo("External integration updated", { integrationId: id, updates })
      return true
    } catch (error) {
      logError("Failed to update external integration", error)
      return false
    }
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate integration test
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const success = Math.random() > 0.3 // 70% success rate for demo

      await this.updateExternalIntegration(id, {
        status: success ? "active" : "error",
        last_sync: new Date().toISOString(),
      })

      return {
        success,
        message: success ? "Integration test successful" : "Integration test failed - check configuration",
      }
    } catch (error) {
      logError("Failed to test integration", error)
      return { success: false, message: "Test failed due to system error" }
    }
  }

  // Data Management
  async getDataJobs(tenantId?: string): Promise<DataJob[]> {
    try {
      let query = this.supabase.from("data_jobs").select("*").order("created_at", { ascending: false }).limit(50)

      if (tenantId) {
        query = query.eq("tenant_id", tenantId)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      logError("Failed to retrieve data jobs", error)
      return []
    }
  }

  async createDataJob(job: Omit<DataJob, "id" | "created_at" | "completed_at">): Promise<DataJob | null> {
    try {
      const { data, error } = await this.supabase.from("data_jobs").insert(job).select().single()

      if (error) throw error
      logInfo("Data job created", { jobId: data.id, type: job.job_type, dataType: job.data_type })
      return data
    } catch (error) {
      logError("Failed to create data job", error)
      return null
    }
  }

  async updateDataJob(id: string, updates: Partial<DataJob>): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("data_jobs").update(updates).eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      logError("Failed to update data job", error)
      return false
    }
  }

  // System Configuration
  async getSystemConfig(category?: string): Promise<SystemConfig[]> {
    try {
      let query = this.supabase
        .from("system_config")
        .select("*")
        .order("category", { ascending: true })
        .order("config_key", { ascending: true })

      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      logError("Failed to retrieve system config", error)
      return []
    }
  }

  async updateSystemConfig(configKey: string, configValue: any, updatedBy?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("system_config")
        .update({
          config_value: configValue,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        })
        .eq("config_key", configKey)

      if (error) throw error
      logInfo("System config updated", { configKey, configValue })
      return true
    } catch (error) {
      logError("Failed to update system config", error)
      return false
    }
  }

  async getSystemStats(): Promise<{
    totalTenants: number
    activeIntegrations: number
    runningJobs: number
    businessRules: number
  }> {
    try {
      const [tenants, integrations, jobs, rules] = await Promise.all([
        this.supabase.from("tenants").select("*", { count: "exact", head: true }),
        this.supabase.from("external_integrations").select("*", { count: "exact", head: true }).eq("status", "active"),
        this.supabase.from("data_jobs").select("*", { count: "exact", head: true }).eq("status", "running"),
        this.supabase.from("business_rules").select("*", { count: "exact", head: true }).eq("enabled", true),
      ])

      return {
        totalTenants: tenants.count || 0,
        activeIntegrations: integrations.count || 0,
        runningJobs: jobs.count || 0,
        businessRules: rules.count || 0,
      }
    } catch (error) {
      logError("Failed to get system stats", error)
      return {
        totalTenants: 0,
        activeIntegrations: 0,
        runningJobs: 0,
        businessRules: 0,
      }
    }
  }
}

export const businessAdmin = new BusinessAdministrationService()
