"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, AlertCircle, Zap } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

interface AutoDiscountDatesStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

export function AutoDiscountDatesStep({ formData, updateFormData }: AutoDiscountDatesStepProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    updateFormData({ startDate: date || null })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    updateFormData({ endDate: date || null })
  }

  const handleNoEndDateChange = (checked: boolean) => {
    if (checked) {
      updateFormData({ endDate: null })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Schedule Automatic Discounts</h2>
        <p className="text-muted-foreground mt-2">Configure when this automatic discount rule will be active</p>
      </div>

      {/* Important Note */}
      <Card className="border-gti-bright-green bg-gti-light-green/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-gti-bright-green mt-0.5" />
            <div>
              <p className="font-medium text-gti-dark-green">Automatic Processing</p>
              <p className="text-sm text-muted-foreground">
                Once active, this rule will automatically monitor inventory and apply discounts in real-time when
                trigger conditions are met. No manual intervention required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gti-bright-green" />
              <span>Activation Date</span>
            </CardTitle>
            <CardDescription>When should automatic monitoring begin?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="auto-start-date">Rule Activation Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="auto-start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick activation date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate || undefined}
                    onSelect={handleStartDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Quick date options */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleStartDateChange(new Date())}>
                  Start Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    handleStartDateChange(tomorrow)
                  }}
                >
                  Start Tomorrow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextWeek = new Date()
                    nextWeek.setDate(nextWeek.getDate() + 7)
                    handleStartDateChange(nextWeek)
                  }}
                >
                  Start Next Week
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* End Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gti-bright-green" />
              <span>Deactivation Date</span>
            </CardTitle>
            <CardDescription>When should automatic monitoring stop? (Optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-no-end-date"
                  checked={formData.endDate === null}
                  onCheckedChange={handleNoEndDateChange}
                />
                <Label htmlFor="auto-no-end-date" className="text-sm">
                  Run indefinitely (recommended for inventory management)
                </Label>
              </div>

              {formData.endDate !== null && (
                <>
                  <Label htmlFor="auto-end-date">Rule Deactivation Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="auto-end-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick deactivation date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate || undefined}
                        onSelect={handleEndDateChange}
                        disabled={(date) => date < new Date() || (formData.startDate && date <= formData.startDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Quick end date options */}
                  {formData.startDate && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const threeMonths = new Date(formData.startDate!)
                          threeMonths.setMonth(threeMonths.getMonth() + 3)
                          handleEndDateChange(threeMonths)
                        }}
                      >
                        3 Months
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const sixMonths = new Date(formData.startDate!)
                          sixMonths.setMonth(sixMonths.getMonth() + 6)
                          handleEndDateChange(sixMonths)
                        }}
                      >
                        6 Months
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const oneYear = new Date(formData.startDate!)
                          oneYear.setFullYear(oneYear.getFullYear() + 1)
                          handleEndDateChange(oneYear)
                        }}
                      >
                        1 Year
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Validation */}
      {formData.startDate && formData.endDate && formData.endDate <= formData.startDate && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm font-medium text-red-800">Invalid Date Range</p>
          </div>
          <p className="text-sm text-red-600 mt-1">Deactivation date must be after the activation date</p>
        </div>
      )}

      {/* Processing Timeline */}
      {formData.startDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Timeline</CardTitle>
            <CardDescription>How this automatic rule will work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gti-bright-green rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Rule Activation</p>
                  <p className="text-sm text-muted-foreground">
                    {format(formData.startDate, "PPP")} - System begins monitoring inventory
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gti-medium-green rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Real-time Processing</p>
                  <p className="text-sm text-muted-foreground">
                    Continuous batch monitoring for {formData.triggerType} conditions
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gti-light-green rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Automatic Application</p>
                  <p className="text-sm text-muted-foreground">
                    Discounts applied instantly when trigger conditions are met
                  </p>
                </div>
              </div>
              {formData.endDate && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Rule Deactivation</p>
                    <p className="text-sm text-muted-foreground">
                      {format(formData.endDate, "PPP")} - Automatic monitoring stops
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {formData.startDate && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">Automatic Rule Schedule</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Active from {format(formData.startDate, "PPP")}
            {formData.endDate ? ` until ${format(formData.endDate, "PPP")}` : " with no planned end date"}
          </p>
        </div>
      )}
    </div>
  )
}
