import { createBrowserClient } from "@supabase/ssr"
import type { DocumentationConfig, DocumentationLink } from "@/lib/types/documentation"
import { DEFAULT_DOCUMENTATION_LINKS } from "@/lib/types/documentation"

export class DocumentationConfigService {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  async getConfig(): Promise<DocumentationConfig> {
    try {
      const { data, error } = await this.supabase
        .from("system_config")
        .select("config_value")
        .eq("config_key", "documentation_links")
        .single()

      if (error || !data) {
        // Return default config if not found
        return {
          globalEnabled: true,
          links: DEFAULT_DOCUMENTATION_LINKS,
        }
      }

      return data.config_value as DocumentationConfig
    } catch (error) {
      console.error("[v0] Error fetching documentation config:", error)
      return {
        globalEnabled: true,
        links: DEFAULT_DOCUMENTATION_LINKS,
      }
    }
  }

  async updateConfig(config: DocumentationConfig): Promise<void> {
    try {
      const { error } = await this.supabase.from("system_config").upsert({
        config_key: "documentation_links",
        config_value: config,
        category: "documentation",
        description: "Configuration for contextual help documentation links",
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("[v0] Error updating documentation config:", error)
      throw error
    }
  }

  async toggleGlobal(enabled: boolean): Promise<void> {
    const config = await this.getConfig()
    config.globalEnabled = enabled
    await this.updateConfig(config)
  }

  async togglePageLink(pageId: string, enabled: boolean): Promise<void> {
    const config = await this.getConfig()
    const linkIndex = config.links.findIndex((link) => link.pageId === pageId)

    if (linkIndex !== -1) {
      config.links[linkIndex].enabled = enabled
      await this.updateConfig(config)
    }
  }

  async getPageLink(pageId: string): Promise<DocumentationLink | null> {
    const config = await this.getConfig()
    return config.links.find((link) => link.pageId === pageId) || null
  }
}

export const documentationConfigService = new DocumentationConfigService()
