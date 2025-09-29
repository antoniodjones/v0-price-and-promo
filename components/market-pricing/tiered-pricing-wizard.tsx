"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Plus, Trash2, X } from "lucide-react"

interface TieredPricingWizardProps {
  onClose: () => void
  editMode?: boolean
  initialData?: any
  ruleId?: string
}

interface TierRow {
  id: string
  minDollarAmount: number
  maxDollarAmount: number | null
  aTierDiscount: number
  bTierDiscount: number
  cTierDiscount: number
}

export function TieredPricingWizard({ onClose, editMode = false, initialData, ruleId }: TieredPricingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    pricingType: "dollar",
    ruleLevel: initialData?.ruleLevel || "",
    targetSelection: initialData?.targetSelection || "",
    ruleName: initialData?.name || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  })

  // Initialize tiers from existing data or use defaults
  const [tiers, setTiers] = useState<TierRow[]>(() => {
    if (initialData?.tiers && Array.isArray(initialData.tiers)) {
      return initialData.tiers.map((tier: any, index: number) => ({
        id: (index + 1).toString(),
        minDollarAmount: tier.minDollarAmount || 0,
        maxDollarAmount: tier.maxDollarAmount,
        aTierDiscount: tier.aTierDiscount || 0,
        bTierDiscount: tier.bTierDiscount || 0,
        cTierDiscount: tier.cTierDiscount || 0,
      }))
    }
    return [
      { id: "1", minDollarAmount: 0, maxDollarAmount: 999, aTierDiscount: 0, bTierDiscount: 0, cTierDiscount: 0 },
      {
        id: "2",
        minDollarAmount: 1000,
        maxDollarAmount: 4999,
        aTierDiscount: 5.0,
        bTierDiscount: 4.0,
        cTierDiscount: 3.0,
      },
      {
        id: "3",
        minDollarAmount: 5000,
        maxDollarAmount: null,
        aTierDiscount: 10.0,
        bTierDiscount: 8.0,
        cTierDiscount: 6.0,
      },
    ]
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const addTier = () => {
    const newTier: TierRow = {
      id: Date.now().toString(),
      minDollarAmount: 0,
      maxDollarAmount: null,
      aTierDiscount: 0,
      bTierDiscount: 0,
      cTierDiscount: 0,
    }
    setTiers([...tiers, newTier])
  }

  const removeTier = (id: string) => {
    setTiers(tiers.filter((tier) => tier.id !== id))
  }

  const updateTier = (id: string, field: keyof TierRow, value: number | null) => {
    setTiers(tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)))
  }

  const handleCreateRule = async () => {
    console.log(`[v0] TieredPricingWizard: Starting rule ${editMode ? "update" : "creation"}`, {
      formData,
      tiers,
      ruleId,
    })

    if (!formData.ruleName.trim()) {
      setSaveError("Rule name is required")
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // Transform wizard data to API format
      const apiData = {
        market: initialData?.market || "Massachusetts",
        strategy: "tiered",
        name: formData.ruleName,
        ruleLevel: formData.ruleLevel,
        targetSelection: formData.targetSelection,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tiers: tiers.map((tier) => ({
          minDollarAmount: tier.minDollarAmount,
          maxDollarAmount: tier.maxDollarAmount,
          aTierDiscount: tier.aTierDiscount,
          bTierDiscount: tier.bTierDiscount,
          cTierDiscount: tier.cTierDiscount,
        })),
        customerGroups: ["A", "B", "C"],
        status: "active",
      }

      console.log(`[v0] TieredPricingWizard: Sending API request for ${editMode ? "update" : "create"}`, apiData)

      const url = editMode && ruleId ? `/api/pricing/market/${ruleId}` : "/api/pricing/market"
      const method = editMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()
      console.log("[v0] TieredPricingWizard: API response", { response: response.status, result })

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${editMode ? "update" : "create"} rule`)
      }

      console.log(`[v0] TieredPricingWizard: Rule ${editMode ? "updated" : "created"} successfully`, result.data)

      // Close the wizard on success
      onClose()

      // Trigger a page refresh to show the updated rule
      window.location.reload()
    } catch (error) {
      console.error(`[v0] TieredPricingWizard: Error ${editMode ? "updating" : "creating"} rule`, error)
      setSaveError(error instanceof Error ? error.message : `Failed to ${editMode ? "update" : "create"} rule`)
    } finally {
      setIsSaving(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Choose Pricing Type</Label>
              <p className="text-sm text-gray-600 mb-4">
                Dollar-based tiered pricing uses total order value to determine discounts
              </p>
              <div className="p-4 border-2 border-gti-dark-green bg-gti-dark-green/5 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Dollar Total Tiered Pricing</h3>
                <p className="text-sm text-gray-600">Discounts based on total dollar amount spent on the order</p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800">Selected</Badge>
                  <span className="text-sm text-gray-500">This wizard creates dollar-based pricing tiers</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Choose Rule Level</Label>
              <p className="text-sm text-gray-600 mb-4">Select the scope for this tiered pricing rule</p>
              <div className="space-y-3">
                {[
                  { value: "global", label: "Global Rule", desc: "Applies to total order value across all products" },
                  { value: "brand", label: "Brand Level", desc: "Applies to total spending on specific brand" },
                  {
                    value: "category",
                    label: "Category Level",
                    desc: "Applies to total spending in specific category",
                  },
                  { value: "product", label: "Product Level", desc: "Applies to total spending on specific products" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.ruleLevel === option.value
                        ? "border-gti-dark-green bg-gti-dark-green/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormData({ ...formData, ruleLevel: option.value })}
                  >
                    <h3 className="font-medium text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select Target</Label>
              <p className="text-sm text-gray-600 mb-4">Choose the specific {formData.ruleLevel} for this rule</p>
              {formData.ruleLevel === "global" ? (
                <div className="p-4 border-2 border-gti-dark-green bg-gti-dark-green/5 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">All Products</h3>
                  <p className="text-sm text-gray-600">
                    This rule will apply to the total order value across all products
                  </p>
                </div>
              ) : (
                <Select
                  value={formData.targetSelection}
                  onValueChange={(value) => setFormData({ ...formData, targetSelection: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${formData.ruleLevel}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.ruleLevel === "brand" && (
                      <>
                        <SelectItem value="incredibles">Incredibles</SelectItem>
                        <SelectItem value="premium-cannabis">Premium Cannabis Co</SelectItem>
                        <SelectItem value="rise-flower">RISE Flower</SelectItem>
                      </>
                    )}
                    {formData.ruleLevel === "category" && (
                      <>
                        <SelectItem value="flower">Flower</SelectItem>
                        <SelectItem value="edibles">Edibles</SelectItem>
                        <SelectItem value="concentrates">Concentrates</SelectItem>
                        <SelectItem value="vapes">Vapes</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Build Dollar Tiers</Label>
              <p className="text-sm text-gray-600 mb-4">
                Configure dollar amount ranges and discount percentages for each customer tier
              </p>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-700">
                    <div>Tier</div>
                    <div>Min $</div>
                    <div>Max $</div>
                    <div>A Tier %</div>
                    <div>B Tier %</div>
                    <div>C Tier %</div>
                    <div>Actions</div>
                  </div>
                </div>

                <div className="divide-y">
                  {tiers.map((tier, index) => (
                    <div key={tier.id} className="p-3">
                      <div className="grid grid-cols-7 gap-2 items-center">
                        <div className="text-sm font-medium">{index + 1}</div>
                        <Input
                          type="number"
                          value={tier.minDollarAmount}
                          onChange={(e) => updateTier(tier.id, "minDollarAmount", Number.parseInt(e.target.value))}
                          className="h-8"
                          placeholder="0"
                        />
                        <Input
                          type="number"
                          value={tier.maxDollarAmount || ""}
                          onChange={(e) =>
                            updateTier(
                              tier.id,
                              "maxDollarAmount",
                              e.target.value ? Number.parseInt(e.target.value) : null,
                            )
                          }
                          placeholder="∞"
                          className="h-8"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={tier.aTierDiscount}
                          onChange={(e) => updateTier(tier.id, "aTierDiscount", Number.parseFloat(e.target.value))}
                          className="h-8"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={tier.bTierDiscount}
                          onChange={(e) => updateTier(tier.id, "bTierDiscount", Number.parseFloat(e.target.value))}
                          className="h-8"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={tier.cTierDiscount}
                          onChange={(e) => updateTier(tier.id, "cTierDiscount", Number.parseFloat(e.target.value))}
                          className="h-8"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTier(tier.id)}
                          disabled={tiers.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={addTier} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Example Tier Structure</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Tier 1: $0 - $999 → No discount (0%)</p>
                  <p>• Tier 2: $1,000 - $4,999 → A: 5%, B: 4%, C: 3%</p>
                  <p>• Tier 3: $5,000+ → A: 10%, B: 8%, C: 6%</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Set Start and End Dates</Label>
              <p className="text-sm text-gray-600 mb-4">Configure when this rule is active</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">When this pricing rule becomes active</p>
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for no planned end date</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Assign Customers to Tiers</Label>
              <p className="text-sm text-gray-600 mb-4">Select which customers belong to each tier for this rule</p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">A Tier Customers</h3>
                      <p className="text-sm text-gray-600">Highest discount tier</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Premium</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Customers in this tier will receive the highest discount percentages configured in your tiers
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">B Tier Customers</h3>
                      <p className="text-sm text-gray-600">Standard discount tier</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Standard</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Customers in this tier will receive mid-level discount percentages
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">C Tier Customers</h3>
                      <p className="text-sm text-gray-600">Basic discount tier</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Basic</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Customers in this tier will receive the lowest discount percentages
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Customer tier assignments are managed per rule. The same customer can be in
                  different tiers for different pricing rules.
                </p>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Create Rule Name & Review</Label>
              <p className="text-sm text-gray-600 mb-4">
                Name your rule and review the configuration before {editMode ? "updating" : "creating"}
              </p>

              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{saveError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input
                    id="ruleName"
                    value={formData.ruleName}
                    onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                    placeholder="e.g., Total Order Dollar Tiers - Massachusetts"
                  />
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Rule Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rule Name:</span>
                      <span className="font-medium">{formData.ruleName || "Unnamed Rule"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pricing Type:</span>
                      <Badge className="bg-purple-100 text-purple-800">Dollar-Based Tiered</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rule Level:</span>
                      <Badge variant="outline">{formData.ruleLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">{formData.targetSelection || "All Products"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiers:</span>
                      <span className="font-medium">{tiers.length} dollar tiers configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formData.startDate || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{formData.endDate || "No end date"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tier Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tiers.map((tier, index) => (
                        <div key={tier.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            Tier {index + 1}: ${tier.minDollarAmount.toLocaleString()} - $
                            {tier.maxDollarAmount?.toLocaleString() || "∞"}
                          </span>
                          <div className="flex gap-2 text-sm">
                            <span className="text-green-600">A: {tier.aTierDiscount}%</span>
                            <span className="text-blue-600">B: {tier.bTierDiscount}%</span>
                            <span className="text-purple-600">C: {tier.cTierDiscount}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editMode ? "Edit Tiered Pricing Rule" : "Dollar-Based Tiered Pricing Wizard"}
            </h1>
            <p className="text-gray-600 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            className="bg-gti-dark-green hover:bg-gti-medium-green"
            disabled={
              (currentStep === 2 && !formData.ruleLevel) ||
              (currentStep === 3 && formData.ruleLevel !== "global" && !formData.targetSelection)
            }
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleCreateRule}
            className="bg-gti-dark-green hover:bg-gti-medium-green"
            disabled={isSaving}
          >
            {isSaving
              ? editMode
                ? "Updating..."
                : "Creating..."
              : editMode
                ? "Update Tiered Pricing Rule"
                : "Create Tiered Pricing Rule"}
          </Button>
        )}
      </div>
    </div>
  )
}
