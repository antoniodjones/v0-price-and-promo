"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EnterpriseSettings } from "@/lib/settings"

interface AutomationSettingsProps {
  settings: { enterprise: EnterpriseSettings }
  updateSetting: (path: string, value: any) => void
}

export default function AutomationSettingsComponent({ settings, updateSetting }: AutomationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Rule Engine</CardTitle>
          <CardDescription>Configure advanced business rule automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Custom Rule Engine</Label>
              <p className="text-sm text-muted-foreground">Allow creation of custom business rules</p>
            </div>
            <Switch
              checked={settings.enterprise.automation.customRuleEngine.enabled}
              onCheckedChange={(checked) => updateSetting("enterprise.automation.customRuleEngine.enabled", checked)}
            />
          </div>

          {settings.enterprise.automation.customRuleEngine.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="maxRules">Maximum Rules</Label>
                <Input
                  id="maxRules"
                  type="number"
                  min="1"
                  value={settings.enterprise.automation.customRuleEngine.maxRules}
                  onChange={(e) =>
                    updateSetting("enterprise.automation.customRuleEngine.maxRules", Number.parseInt(e.target.value))
                  }
                />
                <p className="text-sm text-muted-foreground">Maximum number of custom rules allowed</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Complex Logic</Label>
                  <p className="text-sm text-muted-foreground">Enable complex conditional logic in rules</p>
                </div>
                <Switch
                  checked={settings.enterprise.automation.customRuleEngine.allowComplexLogic}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.automation.customRuleEngine.allowComplexLogic", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Scheduled Rules</Label>
                  <p className="text-sm text-muted-foreground">Allow rules to run on schedules</p>
                </div>
                <Switch
                  checked={settings.enterprise.automation.customRuleEngine.enableScheduledRules}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.automation.customRuleEngine.enableScheduledRules", checked)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI/ML Preferences</CardTitle>
          <CardDescription>Configure artificial intelligence and machine learning features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI/ML Features</Label>
              <p className="text-sm text-muted-foreground">Use AI for pricing optimization and predictions</p>
            </div>
            <Switch
              checked={settings.enterprise.automation.aiMlPreferences.enabled}
              onCheckedChange={(checked) => updateSetting("enterprise.automation.aiMlPreferences.enabled", checked)}
            />
          </div>

          {settings.enterprise.automation.aiMlPreferences.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredProvider">Preferred Provider</Label>
                  <Select
                    value={settings.enterprise.automation.aiMlPreferences.preferredProvider}
                    onValueChange={(value) =>
                      updateSetting("enterprise.automation.aiMlPreferences.preferredProvider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google AI</SelectItem>
                      <SelectItem value="azure">Azure AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelVersion">Model Version</Label>
                  <Input
                    id="modelVersion"
                    value={settings.enterprise.automation.aiMlPreferences.modelVersion}
                    onChange={(e) =>
                      updateSetting("enterprise.automation.aiMlPreferences.modelVersion", e.target.value)
                    }
                    placeholder="gpt-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="confidenceThreshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.enterprise.automation.aiMlPreferences.confidenceThreshold}
                    onChange={(e) =>
                      updateSetting(
                        "enterprise.automation.aiMlPreferences.confidenceThreshold",
                        Number.parseFloat(e.target.value),
                      )
                    }
                  />
                  <span className="text-sm text-muted-foreground">(0.0 - 1.0)</span>
                </div>
                <p className="text-sm text-muted-foreground">Minimum confidence level for AI recommendations</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Retraining</Label>
                  <p className="text-sm text-muted-foreground">Automatically retrain models with new data</p>
                </div>
                <Switch
                  checked={settings.enterprise.automation.aiMlPreferences.autoRetraining}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.automation.aiMlPreferences.autoRetraining", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataPrivacy">Data Privacy Level</Label>
                <Select
                  value={settings.enterprise.automation.aiMlPreferences.dataPrivacy}
                  onValueChange={(value) => updateSetting("enterprise.automation.aiMlPreferences.dataPrivacy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict (No data sharing)</SelectItem>
                    <SelectItem value="moderate">Moderate (Anonymized data)</SelectItem>
                    <SelectItem value="permissive">Permissive (Full data sharing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Automation</CardTitle>
          <CardDescription>Configure automated workflow processes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Workflow Automation</Label>
              <p className="text-sm text-muted-foreground">Automate business processes with workflows</p>
            </div>
            <Switch
              checked={settings.enterprise.automation.workflowAutomation.enabled}
              onCheckedChange={(checked) => updateSetting("enterprise.automation.workflowAutomation.enabled", checked)}
            />
          </div>

          {settings.enterprise.automation.workflowAutomation.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="maxWorkflows">Maximum Workflows</Label>
                <Input
                  id="maxWorkflows"
                  type="number"
                  min="1"
                  value={settings.enterprise.automation.workflowAutomation.maxWorkflows}
                  onChange={(e) =>
                    updateSetting(
                      "enterprise.automation.workflowAutomation.maxWorkflows",
                      Number.parseInt(e.target.value),
                    )
                  }
                />
                <p className="text-sm text-muted-foreground">Maximum number of active workflows</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow External Triggers</Label>
                  <p className="text-sm text-muted-foreground">Allow workflows to be triggered by external systems</p>
                </div>
                <Switch
                  checked={settings.enterprise.automation.workflowAutomation.allowExternalTriggers}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.automation.workflowAutomation.allowExternalTriggers", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Conditional Logic</Label>
                  <p className="text-sm text-muted-foreground">Allow complex conditional logic in workflows</p>
                </div>
                <Switch
                  checked={settings.enterprise.automation.workflowAutomation.enableConditionalLogic}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.automation.workflowAutomation.enableConditionalLogic", checked)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
