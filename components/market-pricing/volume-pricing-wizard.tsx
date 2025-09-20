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

interface VolumePricingWizardProps {
  onClose: () => void
}

interface TierRow {
  id: string
  minQuantity: number
  maxQuantity: number | null
  aTierDiscount: number
  bTierDiscount: number
  cTierDiscount: number
}

export function VolumePricingWizard({ onClose }: VolumePricingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    pricingType: "",
    ruleLevel: "",
    targetSelection: "",
    ruleName: "",
    startDate: "",
    endDate: "",
  })

  const [tiers, setTiers] = useState<TierRow[]>([
    { id: "1", minQuantity: 50, maxQuantity: 75, aTierDiscount: 4.0, bTierDiscount: 3.0, cTierDiscount: 2.0 },
    { id: "2", minQuantity: 76, maxQuantity: 99, aTierDiscount: 5.0, bTierDiscount: 4.0, cTierDiscount: 3.0 },
    { id: "3", minQuantity: 100, maxQuantity: null, aTierDiscount: 6.0, bTierDiscount: 5.0, cTierDiscount: 4.0 },
  ])

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const addTier = () => {
    const newTier: TierRow = {
      id: Date.now().toString(),
      minQuantity: 0,
      maxQuantity: null,
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
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

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Choose Rule Level</Label>
              <p className="text-sm text-gray-600 mb-4">Select the scope for this volume pricing rule</p>
              <div className="space-y-3">
                {[
                  { value: "global", label: "Global Rule", desc: "Applies to all products" },
                  { value: "brand", label: "Brand Level", desc: "Applies to specific brand products" },
                  { value: "category", label: "Category Level", desc: "Applies to specific category products" },
                  { value: "product", label: "Product Level", desc: "Applies to specific products" },
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
                  {formData.ruleLevel === "global" && <SelectItem value="all-products">All Products</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Build Volume Tiers</Label>
              <p className="text-sm text-gray-600 mb-4">
                Configure quantity ranges and discount percentages for each customer tier
              </p>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-700">
                    <div>Tier</div>
                    <div>Min Qty</div>
                    <div>Max Qty</div>
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
                          value={tier.minQuantity}
                          onChange={(e) => updateTier(tier.id, "minQuantity", Number.parseInt(e.target.value))}
                          className="h-8"
                        />
                        <Input
                          type="number"
                          value={tier.maxQuantity || ""}
                          onChange={(e) =>
                            updateTier(tier.id, "maxQuantity", e.target.value ? Number.parseInt(e.target.value) : null)
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
            </div>
          </div>
        )

      case 5:
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

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Review & Create</Label>
              <p className="text-sm text-gray-600 mb-4">Review your volume pricing configuration before creating</p>

              <div className="space-y-4">
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
                      <Badge>{formData.pricingType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rule Level:</span>
                      <Badge variant="outline">{formData.ruleLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-medium">{formData.targetSelection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiers:</span>
                      <span className="font-medium">{tiers.length} tiers configured</span>
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
                            Tier {index + 1}: {tier.minQuantity}-{tier.maxQuantity || "∞"} units
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
            <h1 className="text-3xl font-bold text-gray-900">Volume Pricing Wizard</h1>
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
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onClose} className="bg-gti-dark-green hover:bg-gti-medium-green">
            Create Volume Pricing Rule
          </Button>
        )}
      </div>
    </div>
  )
}
