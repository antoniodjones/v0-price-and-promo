"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Zap, Calendar, Percent } from "lucide-react"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

interface TriggerValueStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

export function TriggerValueStep({ formData, updateFormData }: TriggerValueStepProps) {
  const handleValueChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 0
    updateFormData({ triggerValue: numValue })
  }

  const handleUnitChange = (unit: string) => {
    updateFormData({ triggerUnit: unit })
  }

  const isExpiration = formData.triggerType === "expiration"
  const isTHC = formData.triggerType === "thc"

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Configure Trigger Conditions</h2>
        <p className="text-muted-foreground mt-2">
          Set when the {formData.triggerType} discount should be automatically applied
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            {isExpiration ? <Clock className="h-4 w-4 text-orange-500" /> : <Zap className="h-4 w-4 text-gti-purple" />}
            <span>{isExpiration ? "Expiration Date Trigger" : "THC Percentage Trigger"}</span>
          </CardTitle>
          <CardDescription>
            {isExpiration
              ? "Products will be discounted when they approach their expiration date"
              : "Products will be discounted when their THC percentage is below the threshold"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isExpiration ? (
            <>
              {/* Expiration Trigger Configuration */}
              <div className="space-y-4">
                <Label htmlFor="trigger-value">Days Before Expiration</Label>
                <div className="relative max-w-xs">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="trigger-value"
                    type="number"
                    placeholder="30"
                    value={formData.triggerValue || ""}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="pl-10"
                    min="1"
                    max="365"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    days
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Products will be automatically discounted when they are within this many days of expiration
                </p>
              </div>

              {/* Quick Presets */}
              <div className="space-y-3">
                <Label>Common Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {[7, 14, 30, 45, 60].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => {
                        updateFormData({ triggerValue: days, triggerUnit: "days" })
                      }}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        formData.triggerValue === days
                          ? "bg-gti-bright-green text-white border-gti-bright-green"
                          : "hover:border-gti-light-green"
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* THC Trigger Configuration */}
              <div className="space-y-4">
                <Label htmlFor="thc-threshold">THC Percentage Threshold</Label>
                <div className="relative max-w-xs">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="thc-threshold"
                    type="number"
                    placeholder="15"
                    value={formData.triggerValue || ""}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="pl-10"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Products with THC percentage below this threshold will be automatically discounted
                </p>
              </div>

              {/* THC Category Presets */}
              <div className="space-y-3">
                <Label>Category-Specific Presets</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <Card className="p-3">
                    <div className="text-sm font-medium">Flower Products</div>
                    <div className="flex gap-2 mt-2">
                      {[12, 15, 18].map((thc) => (
                        <button
                          key={thc}
                          type="button"
                          onClick={() => {
                            updateFormData({ triggerValue: thc, triggerUnit: "percent" })
                          }}
                          className={`px-2 py-1 text-xs border rounded transition-colors ${
                            formData.triggerValue === thc
                              ? "bg-gti-bright-green text-white border-gti-bright-green"
                              : "hover:border-gti-light-green"
                          }`}
                        >
                          {thc}%
                        </button>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-sm font-medium">Concentrates</div>
                    <div className="flex gap-2 mt-2">
                      {[60, 70, 80].map((thc) => (
                        <button
                          key={thc}
                          type="button"
                          onClick={() => {
                            updateFormData({ triggerValue: thc, triggerUnit: "percent" })
                          }}
                          className={`px-2 py-1 text-xs border rounded transition-colors ${
                            formData.triggerValue === thc
                              ? "bg-gti-bright-green text-white border-gti-bright-green"
                              : "hover:border-gti-light-green"
                          }`}
                        >
                          {thc}%
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Auto-set trigger unit */}
          {formData.triggerValue > 0 && !formData.triggerUnit && (
            <>{updateFormData({ triggerUnit: isExpiration ? "days" : "percent" })}</>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {formData.triggerValue > 0 && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">Trigger Condition</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isExpiration
              ? `Products will be automatically discounted when they are within ${formData.triggerValue} days of expiration`
              : `Products with THC percentage below ${formData.triggerValue}% will be automatically discounted`}
          </p>

          {/* Example */}
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Example:</p>
            <div className="text-xs text-muted-foreground">
              {isExpiration ? (
                <>
                  • Batch expires on Dec 15, 2025
                  <br />• Discount automatically applies on{" "}
                  {new Date(Date.now() + formData.triggerValue * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  <br />• Real-time monitoring ensures immediate application
                </>
              ) : (
                <>
                  • Batch has {formData.triggerValue - 2}% THC (below {formData.triggerValue}% threshold)
                  <br />• Discount automatically applies to this batch
                  <br />• Higher THC batches remain at regular price
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
