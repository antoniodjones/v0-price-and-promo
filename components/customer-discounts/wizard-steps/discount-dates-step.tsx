"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountDatesStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

export function DiscountDatesStep({ formData, updateFormData }: DiscountDatesStepProps) {
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
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Discount Period</h2>
        <p className="text-muted-foreground mt-2">Configure when this discount rule will be active</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gti-bright-green" />
              <span>Start Date</span>
            </CardTitle>
            <CardDescription>When should this discount become active?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="start-date">Effective Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a start date</span>}
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
                  Today
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
                  Tomorrow
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
                  Next Week
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
              <span>End Date</span>
            </CardTitle>
            <CardDescription>When should this discount expire? (Optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-end-date"
                  checked={formData.endDate === null}
                  onCheckedChange={handleNoEndDateChange}
                />
                <Label htmlFor="no-end-date" className="text-sm">
                  No planned end date (runs indefinitely)
                </Label>
              </div>

              {formData.endDate !== null && (
                <>
                  <Label htmlFor="end-date">Effective End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick an end date</span>}
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
                          const oneMonth = new Date(formData.startDate!)
                          oneMonth.setMonth(oneMonth.getMonth() + 1)
                          handleEndDateChange(oneMonth)
                        }}
                      >
                        1 Month
                      </Button>
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
          <p className="text-sm text-red-600 mt-1">End date must be after the start date</p>
        </div>
      )}

      {/* Summary */}
      {formData.startDate && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">Discount Period</p>
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
