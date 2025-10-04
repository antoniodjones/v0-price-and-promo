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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type PricingMode = "volume" | "dollar"
type RuleLevel = "global" | "brand" | "category" | "product"

interface PricingTierWizardProps {
  mode: PricingMode
  onClose: () => void
  editMode?: boolean
  initialData?: any
  ruleId?: string
}

interface TierRow {
  id: string
  minValue: number
  maxValue: number | null
  aTierDiscount: number
  bTierDiscount: number
  cTierDiscount: number
}

interface FormData {
  pricingType: string
  ruleLevel: RuleLevel | ""
  targetSelection: string
  ruleName: string
  startDate: string
  endDate: string
}

const VOLUME_MODE_CONFIG = {
  strategy: "volume" as const,
  wizardTitle: "Volume Pricing Wizard",
  editTitle: "Edit Volume Pricing Rule",
  tierLabel: "Volume Tiers",
  minLabel: "Min Qty",
  maxLabel: "Max Qty",
  unitLabel: "units",
  exampleText: "Discounts based on quantity purchased",
  defaultTiers: [
    { id: "1", minValue: 50, maxValue: 75, aTierDiscount: 4.0, bTierDiscount: 3.0, cTierDiscount: 2.0 },
    { id: "2", minValue: 76, maxValue: 99, aTierDiscount: 5.0, bTierDiscount: 4.0, cTierDiscount: 3.0 },
    { id: "3", minValue: 100, maxValue: null, aTierDiscount: 6.0, bTierDiscount: 5.0, cTierDiscount: 4.0 },
  ],
}

const DOLLAR_MODE_CONFIG = {
  strategy: "tiered" as const,
  wizardTitle: "Dollar-Based Tiered Pricing Wizard",
  editTitle: "Edit Tiered Pricing Rule",
  tierLabel: "Dollar Tiers",
  minLabel: "Min $",
  maxLabel: "Max $",
  unitLabel: "dollars",
  exampleText: "Discounts based on total dollar amount spent",
  defaultTiers: [
    { id: "1", minValue: 0, maxValue: 999, aTierDiscount: 0, bTierDiscount: 0, cTierDiscount: 0 },
    { id: "2", minValue: 1000, maxValue: 4999, aTierDiscount: 5.0, bTierDiscount: 4.0, cTierDiscount: 3.0 },
    { id: "3", minValue: 5000, maxValue: null, aTierDiscount: 10.0, bTierDiscount: 8.0, cTierDiscount: 6.0 },
  ],
}

export function PricingTierWizard({ mode, onClose, editMode = false, initialData, ruleId }: PricingTierWizardProps) {
  const config = mode === "volume" ? VOLUME_MODE_CONFIG : DOLLAR_MODE_CONFIG
  const isDollarMode = mode === "dollar"
  const totalSteps = isDollarMode ? 7 : 6

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    pricingType: mode,
    ruleLevel: initialData?.ruleLevel || "",
    targetSelection: initialData?.targetSelection || "",
    ruleName: initialData?.name || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  })

  const [tiers, setTiers] = useState<TierRow[]>(() => initializeTiers(initialData, config.defaultTiers))
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const progress = (currentStep / totalSteps) * 100

  const addTier = () => {
    const newTier: TierRow = {
      id: Date.now().toString(),
      minValue: 0,
      maxValue: null,
      aTierDiscount: 0,
      bTierDiscount: 0,
      cTierDiscount: 0,
    }
    setTiers([...tiers, newTier])
  }

  const removeTier = (id: string) => {
    if (tiers.length <= 1) return
    setTiers(tiers.filter((tier) => tier.id !== id))
  }

  const updateTier = (id: string, field: keyof TierRow, value: number | null) => {
    setTiers(tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)))
  }

  const handleCreateRule = async () => {
    if (!validateRuleName(formData.ruleName)) {
      setSaveError("Rule name is required")
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      const apiData = buildApiPayload(formData, tiers, config.strategy, initialData?.market)
      const response = await submitRule(apiData, editMode, ruleId)

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || `Failed to ${editMode ? "update" : "create"} rule`)
      }

      showSuccessToast(formData.ruleName, editMode, toast)
      onClose()
      router.push("/market-pricing")
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : `Failed to ${editMode ? "update" : "create"} rule`)
    } finally {
      setIsSaving(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPricingTypeStep(formData, setFormData, config, isDollarMode)
      case 2:
        return renderRuleLevelStep(formData, setFormData)
      case 3:
        return renderTargetSelectionStep(formData, setFormData)
      case 4:
        return renderTierConfigurationStep(tiers, updateTier, removeTier, addTier, config)
      case 5:
        return isDollarMode
          ? renderDateConfigurationStep(formData, setFormData)
          : renderDateAndNameStep(formData, setFormData)
      case 6:
        return isDollarMode
          ? renderCustomerAssignmentStep()
          : renderReviewStep(formData, tiers, config, saveError, editMode)
      case 7:
        return renderReviewStep(formData, tiers, config, saveError, editMode)
      default:
        return null
    }
  }

  const canProceedToNextStep = (): boolean => {
    if (currentStep === 2 && !formData.ruleLevel) return false
    if (currentStep === 3 && formData.ruleLevel !== "global" && !formData.targetSelection) return false
    return true
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
            <h1 className="text-3xl font-bold text-gray-900">{editMode ? config.editTitle : config.wizardTitle}</h1>
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
            disabled={!canProceedToNextStep()}
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
                ? `Update ${config.tierLabel} Rule`
                : `Create ${config.tierLabel} Rule`}
          </Button>
        )}
      </div>
    </div>
  )
}

function initializeTiers(initialData: any, defaultTiers: TierRow[]): TierRow[] {
  if (initialData?.tiers && Array.isArray(initialData.tiers)) {
    return initialData.tiers.map((tier: any, index: number) => ({
      id: (index + 1).toString(),
      minValue: tier.minQuantity || tier.minDollarAmount || 0,
      maxValue: tier.maxQuantity ?? tier.maxDollarAmount ?? null,
      aTierDiscount: tier.aTierDiscount || 0,
      bTierDiscount: tier.bTierDiscount || 0,
      cTierDiscount: tier.cTierDiscount || 0,
    }))
  }
  return defaultTiers
}

function validateRuleName(ruleName: string): boolean {
  return ruleName.trim().length > 0
}

function buildApiPayload(formData: FormData, tiers: TierRow[], strategy: "volume" | "tiered", market?: string) {
  const isVolume = strategy === "volume"
  return {
    market: market || "Massachusetts",
    strategy,
    name: formData.ruleName,
    ruleLevel: formData.ruleLevel,
    targetSelection: formData.targetSelection,
    startDate: formData.startDate,
    endDate: formData.endDate,
    tiers: tiers.map((tier) => ({
      ...(isVolume
        ? { minQuantity: tier.minValue, maxQuantity: tier.maxValue }
        : { minDollarAmount: tier.minValue, maxDollarAmount: tier.maxValue }),
      aTierDiscount: tier.aTierDiscount,
      bTierDiscount: tier.bTierDiscount,
      cTierDiscount: tier.cTierDiscount,
    })),
    customerGroups: ["A", "B", "C"],
    status: "active",
  }
}

async function submitRule(apiData: any, editMode: boolean, ruleId?: string) {
  const url = editMode && ruleId ? `/api/pricing/market/${ruleId}` : "/api/pricing/market"
  const method = editMode ? "PUT" : "POST"

  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiData),
  })
}

function showSuccessToast(ruleName: string, editMode: boolean, toast: any) {
  toast({
    title: `Pricing Rule ${editMode ? "Updated" : "Created"}!`,
    description: `${ruleName} has been ${editMode ? "updated" : "created"} successfully.`,
  })
}

function renderPricingTypeStep(
  formData: FormData,
  setFormData: (data: FormData) => void,
  config: typeof VOLUME_MODE_CONFIG | typeof DOLLAR_MODE_CONFIG,
  isDollarMode: boolean,
) {
  if (isDollarMode) {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Choose Pricing Type</Label>
          <p className="text-sm text-gray-600 mb-4">
            Dollar-based tiered pricing uses total order value to determine discounts
          </p>
          <div className="p-4 border-2 border-gti-dark-green bg-gti-dark-green/5 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Dollar Total Tiered Pricing</h3>
            <p className="text-sm text-gray-600">{config.exampleText}</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">Selected</Badge>
              <span className="text-sm text-gray-500">This wizard creates dollar-based pricing tiers</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Choose Pricing Type</Label>
        <p className="text-sm text-gray-600 mb-4">Select whether to base discounts on volume or dollar amounts</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.pricingType === "volume"
                ? "border-gti-dark-green bg-gti-dark-green/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setFormData({ ...formData, pricingType: "volume" })}
          >
            <h3 className="font-medium text-gray-900 mb-2">Volume (Units/Cases)</h3>
            <p className="text-sm text-gray-600">Discounts based on quantity purchased</p>
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.pricingType === "dollar"
                ? "border-gti-dark-green bg-gti-dark-green/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setFormData({ ...formData, pricingType: "dollar" })}
          >
            <h3 className="font-medium text-gray-900 mb-2">Dollar Total</h3>
            <p className="text-sm text-gray-600">Discounts based on dollar amount spent</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderRuleLevelStep(formData: FormData, setFormData: (data: FormData) => void) {
  const ruleLevelOptions = [
    { value: "global" as const, label: "Global Rule", desc: "Applies to all products" },
    { value: "brand" as const, label: "Brand Level", desc: "Applies to specific brand products" },
    { value: "category" as const, label: "Category Level", desc: "Applies to specific category products" },
    { value: "product" as const, label: "Product Level", desc: "Applies to specific products" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Choose Rule Level</Label>
        <p className="text-sm text-gray-600 mb-4">Select the scope for this pricing rule</p>
        <div className="space-y-3">
          {ruleLevelOptions.map((option) => (
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
}

function renderTargetSelectionStep(formData: FormData, setFormData: (data: FormData) => void) {
  if (formData.ruleLevel === "global") {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium">Select Target</Label>
          <p className="text-sm text-gray-600 mb-4">Global rule applies to all products</p>
          <div className="p-4 border-2 border-gti-dark-green bg-gti-dark-green/5 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">All Products</h3>
            <p className="text-sm text-gray-600">This rule will apply to the total order value across all products</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Select Target</Label>
        <p className="text-sm text-gray-600 mb-4">Choose the specific {formData.ruleLevel} for this rule</p>
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
      </div>
    </div>
  )
}

function renderTierConfigurationStep(
  tiers: TierRow[],
  updateTier: (id: string, field: keyof TierRow, value: number | null) => void,
  removeTier: (id: string) => void,
  addTier: () => void,
  config: typeof VOLUME_MODE_CONFIG | typeof DOLLAR_MODE_CONFIG,
) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Build {config.tierLabel}</Label>
        <p className="text-sm text-gray-600 mb-4">
          Configure {config.unitLabel} ranges and discount percentages for each customer tier
        </p>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-700">
              <div>Tier</div>
              <div>{config.minLabel}</div>
              <div>{config.maxLabel}</div>
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
                    value={tier.minValue}
                    onChange={(e) => updateTier(tier.id, "minValue", Number.parseInt(e.target.value))}
                    className="h-8"
                  />
                  <Input
                    type="number"
                    value={tier.maxValue || ""}
                    onChange={(e) =>
                      updateTier(tier.id, "maxValue", e.target.value ? Number.parseInt(e.target.value) : null)
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
                  <Button size="sm" variant="outline" onClick={() => removeTier(tier.id)} disabled={tiers.length <= 1}>
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
      </div>
    </div>
  )
}

function renderDateConfigurationStep(formData: FormData, setFormData: (data: FormData) => void) {
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
}

function renderDateAndNameStep(formData: FormData, setFormData: (data: FormData) => void) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Set Dates & Name</Label>
        <p className="text-sm text-gray-600 mb-4">Configure when this rule is active and give it a name</p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input
              id="ruleName"
              value={formData.ruleName}
              onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              placeholder="e.g., Total Order Volume - Massachusetts"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderCustomerAssignmentStep() {
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
            <p className="text-sm text-gray-500">Customers in this tier will receive mid-level discount percentages</p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">C Tier Customers</h3>
                <p className="text-sm text-gray-600">Basic discount tier</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Basic</Badge>
            </div>
            <p className="text-sm text-gray-500">Customers in this tier will receive the lowest discount percentages</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Customer tier assignments are managed per rule. The same customer can be in different
            tiers for different pricing rules.
          </p>
        </div>
      </div>
    </div>
  )
}

function renderReviewStep(
  formData: FormData,
  tiers: TierRow[],
  config: typeof VOLUME_MODE_CONFIG | typeof DOLLAR_MODE_CONFIG,
  saveError: string | null,
  editMode: boolean,
) {
  const isDollar = config.strategy === "tiered"

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">{isDollar ? "Create Rule Name & Review" : "Review & Create"}</Label>
        <p className="text-sm text-gray-600 mb-4">
          {isDollar ? "Name your rule and review the configuration" : "Review your pricing configuration"} before{" "}
          {editMode ? "updating" : "creating"}
        </p>

        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{saveError}</p>
          </div>
        )}

        <div className="space-y-4">
          {isDollar && (
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                value={formData.ruleName}
                onChange={(e) => {
                  formData.ruleName = e.target.value
                }}
                placeholder="e.g., Total Order Dollar Tiers - Massachusetts"
              />
            </div>
          )}

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
                <Badge className={isDollar ? "bg-purple-100 text-purple-800" : ""}>
                  {isDollar ? "Dollar-Based Tiered" : formData.pricingType}
                </Badge>
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
                <span className="font-medium">
                  {tiers.length} {config.unitLabel} tiers configured
                </span>
              </div>
              {isDollar && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formData.startDate || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formData.endDate || "No end date"}</span>
                  </div>
                </>
              )}
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
                      Tier {index + 1}:{" "}
                      {isDollar
                        ? `$${tier.minValue.toLocaleString()} - $${tier.maxValue?.toLocaleString() || "∞"}`
                        : `${tier.minValue}-${tier.maxValue || "∞"} units`}
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
}
