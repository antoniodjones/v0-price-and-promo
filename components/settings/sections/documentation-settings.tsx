"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ExternalLink, Save, RotateCcw, Loader2 } from "lucide-react"
import { documentationConfigService } from "@/lib/services/documentation-config"
import type { DocumentationConfig, DocumentationLink } from "@/lib/types/documentation"
import { DEFAULT_DOCUMENTATION_LINKS } from "@/lib/types/documentation"

export default function DocumentationSettings() {
  const [config, setConfig] = useState<DocumentationConfig>({
    globalEnabled: true,
    links: DEFAULT_DOCUMENTATION_LINKS,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const loadedConfig = await documentationConfigService.getConfig()
      setConfig(loadedConfig)
    } catch (error) {
      console.error("[v0] Error loading documentation config:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGlobalToggle = (enabled: boolean) => {
    setConfig((prev) => ({ ...prev, globalEnabled: enabled }))
    setHasChanges(true)
  }

  const handleLinkToggle = (pageId: string, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      links: prev.links.map((link) => (link.pageId === pageId ? { ...link, enabled } : link)),
    }))
    setHasChanges(true)
  }

  const handleUrlChange = (pageId: string, url: string) => {
    setConfig((prev) => ({
      ...prev,
      links: prev.links.map((link) => (link.pageId === pageId ? { ...link, documentationUrl: url } : link)),
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await documentationConfigService.updateConfig(config)
      setHasChanges(false)
    } catch (error) {
      console.error("[v0] Error saving documentation config:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    loadConfig()
    setHasChanges(false)
  }

  const groupedLinks = config.links.reduce(
    (acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = []
      }
      acc[link.category].push(link)
      return acc
    },
    {} as Record<string, DocumentationLink[]>,
  )

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
      <Card>
        <CardHeader>
          <CardTitle>Contextual Help Configuration</CardTitle>
          <CardDescription>
            Manage documentation links that appear on each page. Users can click the book icon to access relevant user
            guides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-accent/20">
            <div className="space-y-1">
              <Label htmlFor="global-toggle" className="text-base font-semibold">
                Enable Documentation Links
              </Label>
              <p className="text-sm text-muted-foreground">
                Show book icons on all pages (individual pages can still be disabled below)
              </p>
            </div>
            <Switch
              id="global-toggle"
              checked={config.globalEnabled}
              onCheckedChange={handleGlobalToggle}
              className="data-[state=checked]:bg-gti-dark-green"
            />
          </div>

          {/* Save/Reset Buttons */}
          {hasChanges && (
            <div className="flex items-center justify-end space-x-2 p-4 border rounded-lg bg-blue-500/10">
              <p className="text-sm text-muted-foreground mr-auto">You have unsaved changes</p>
              <Button variant="outline" onClick={handleReset} disabled={saving}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Changes
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-gti-dark-green hover:bg-gti-medium-green">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Configuration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-Page Configuration */}
      {Object.entries(groupedLinks).map(([category, links]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
            <CardDescription>{links.length} page(s) in this category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.pageId} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent/50">
                  <div className="flex items-center space-x-3 flex-1">
                    <BookOpen className="h-5 w-5 text-gti-dark-green mt-1" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{link.pageName}</h4>
                            <Badge variant="outline" className={link.enabled ? "bg-green-500/10 text-green-500" : ""}>
                              {link.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          {link.description && <p className="text-sm text-muted-foreground">{link.description}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <a href={link.documentationUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(enabled) => handleLinkToggle(link.pageId, enabled)}
                            className="data-[state=checked]:bg-gti-dark-green"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`url-${link.pageId}`} className="text-xs text-muted-foreground">
                          Documentation URL
                        </Label>
                        <Input
                          id={`url-${link.pageId}`}
                          value={link.documentationUrl}
                          onChange={(e) => handleUrlChange(link.pageId, e.target.value)}
                          placeholder="/docs/user-guide.md"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Info Card */}
      <Card className="bg-accent/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <BookOpen className="h-5 w-5 mt-1 text-gti-dark-green" />
            <div className="space-y-1">
              <h4 className="font-semibold">How It Works</h4>
              <p className="text-sm text-muted-foreground">
                When enabled, a book icon appears in the top-right corner of each page. Clicking it opens the relevant
                user guide in a new tab. You can enable/disable links globally or per-page, and customize the
                documentation URL for each page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
