"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Target, Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, Package, BarChart3 } from "lucide-react"

interface BogoReviewStepProps {
  formData: any
}

export function BogoReviewStep({ formData }: BogoReviewStepProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "item":
        return Target
      case "brand":
        return BarChart3
      case "category":
        return Package
      default:
        return Target
    }
  }

  const getRewardDescription = () => {
    if (formData.rewardType === "free") {
      return "Free"
    } else if (formData.rewardType === "percentage") {
      return `${formData.rewardValue}% off`
    } else {
      return `$${formData.rewardValue} off`
    }
  }

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const TypeIcon = getTypeIcon(formData.type)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gti-dark-green mb-2">Review Campaign</h3>
        <p className="text-muted-foreground">
          Review all campaign details before creating your BOGO promotion. You can edit any section by going back to
          previous steps.
        </p>
      </div>

      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gti-bright-green rounded-lg">
              <TypeIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gti-dark-green">{formData.campaignName}</CardTitle>
              <CardDescription>
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Level BOGO Campaign
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {formData.description && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{formData.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Campaign Logic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Target className="mr-2 h-4 w-4 text-gti-bright-green" />
            Campaign Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trigger */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-blue-600">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Customer Purchases</p>
              <p className="text-sm text-muted-foreground">
                {formData.triggerQuantity} × {formData.triggerTarget}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300" />
          </div>

          {/* Reward */}
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-green-600">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Customer Receives</p>
              <p className="text-sm text-muted-foreground">
                {formData.rewardQuantity} × {formData.rewardTarget} at {getRewardDescription()}
              </p>
              {formData.maxRewardsPerOrder > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  (Up to {formData.maxRewardsPerOrder} times per order)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gti-bright-green" />
            Campaign Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <p className="text-sm font-semibold">
                {formData.startDate ? format(formData.startDate, "MMM dd, yyyy") : "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">End Date</p>
              <p className="text-sm font-semibold">
                {formData.endDate ? format(formData.endDate, "MMM dd, yyyy") : "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {calculateDuration()} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-gti-bright-green" />
            Expected Impact
          </CardTitle>
          <CardDescription>Projected campaign performance based on similar promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gti-dark-green">15-25%</p>
              <p className="text-xs text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gti-dark-green">+35%</p>
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gti-dark-green">2.3x</p>
              <p className="text-xs text-muted-foreground">Purchase Frequency</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gti-dark-green">85%</p>
              <p className="text-xs text-muted-foreground">Customer Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Launch Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-gti-bright-green" />
            Pre-Launch Checklist
          </CardTitle>
          <CardDescription>Ensure everything is ready for campaign launch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Campaign details configured</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Trigger and reward products selected</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Campaign schedule set</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Inventory levels verified (recommended)</span>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Customer communication prepared (recommended)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card className="bg-gti-light-green/10 border-gti-bright-green">
        <CardHeader>
          <CardTitle className="text-base text-gti-dark-green">Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="font-semibold">{formData.campaignName}</span> will run from{" "}
            <span className="font-semibold">{formData.startDate ? format(formData.startDate, "MMM dd") : "TBD"}</span>{" "}
            to{" "}
            <span className="font-semibold">{formData.endDate ? format(formData.endDate, "MMM dd, yyyy") : "TBD"}</span>
            . When customers purchase {formData.triggerQuantity} × {formData.triggerTarget}, they'll receive{" "}
            {formData.rewardQuantity} × {formData.rewardTarget} at {getRewardDescription()}.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
