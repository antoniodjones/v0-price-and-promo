"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { TestingSettings } from "@/lib/settings"

interface TestingSettingsProps {
  settings: { testing: TestingSettings }
  updateSetting: (path: string, value: any) => void
}

const availableScenarios = [
  { value: "volume-pricing", label: "Volume Pricing" },
  { value: "expiration-discount", label: "Expiration Discounts" },
  { value: "margin-validation", label: "Margin Validation" },
  { value: "bundle-pricing", label: "Bundle Pricing" },
  { value: "customer-discounts", label: "Customer Discounts" },
]

export default function TestingSettingsComponent({ settings, updateSetting }: TestingSettingsProps) {
  const handleScenarioToggle = (scenarioValue: string, checked: boolean) => {
    const currentScenarios = settings.testing.defaultScenarios
    if (checked) {
      updateSetting("testing.defaultScenarios", [...currentScenarios, scenarioValue])
    } else {
      updateSetting(
        "testing.defaultScenarios",
        currentScenarios.filter((s) => s !== scenarioValue),
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>Configure automated testing parameters</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="testSchedule">Test Schedule</Label>
            <Select
              value={settings.testing.testSchedule}
              onValueChange={(value) => updateSetting("testing.testSchedule", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">How often to run automated tests</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="successThreshold">Success Threshold</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="successThreshold"
                type="number"
                min="0"
                max="100"
                value={settings.testing.successThreshold}
                onChange={(e) => updateSetting("testing.successThreshold", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Minimum pass rate for test success</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTestDuration">Maximum Test Duration</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="maxTestDuration"
                type="number"
                min="1"
                value={settings.testing.maxTestDuration}
                onChange={(e) => updateSetting("testing.maxTestDuration", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum time allowed for test execution</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios</CardTitle>
          <CardDescription>Select which scenarios to include in automated testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {availableScenarios.map((scenario) => (
              <div key={scenario.value} className="flex items-center space-x-2">
                <Checkbox
                  id={scenario.value}
                  checked={settings.testing.defaultScenarios.includes(scenario.value)}
                  onCheckedChange={(checked) => handleScenarioToggle(scenario.value, checked as boolean)}
                />
                <Label htmlFor={scenario.value}>{scenario.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Behavior</CardTitle>
          <CardDescription>Configure how tests are executed and handled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Validation</Label>
              <p className="text-sm text-muted-foreground">Automatically validate pricing rules after changes</p>
            </div>
            <Switch
              checked={settings.testing.autoValidation}
              onCheckedChange={(checked) => updateSetting("testing.autoValidation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Retry Failed Tests</Label>
              <p className="text-sm text-muted-foreground">Automatically retry tests that fail</p>
            </div>
            <Switch
              checked={settings.testing.retryFailedTests}
              onCheckedChange={(checked) => updateSetting("testing.retryFailedTests", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notify on Failure</Label>
              <p className="text-sm text-muted-foreground">Send notifications when tests fail</p>
            </div>
            <Switch
              checked={settings.testing.notifyOnFailure}
              onCheckedChange={(checked) => updateSetting("testing.notifyOnFailure", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
