"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BogoDateStepProps {
  formData: any
  updateFormData: (updates: any) => void
}

export function BogoDatesStep({ formData, updateFormData }: BogoDateStepProps) {
  const today = new Date()
  const isValidDateRange = formData.startDate && formData.endDate && formData.startDate < formData.endDate

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null
    const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const duration = calculateDuration()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gti-dark-green mb-2">Campaign Schedule</h3>
        <p className="text-muted-foreground">
          Set the start and end dates for your BOGO campaign. The campaign will automatically activate and deactivate on
          these dates.
        </p>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Campaign Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => updateFormData({ startDate: date })}
                disabled={(date) => date < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">Campaign will become active at 12:00 AM on this date</p>
        </div>

        {/* End Date */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Campaign End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : "Select end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => updateFormData({ endDate: date })}
                disabled={(date) => date < (formData.startDate || today)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">Campaign will end at 11:59 PM on this date</p>
        </div>
      </div>

      {/* Date Validation */}
      {formData.startDate && formData.endDate && !isValidDateRange && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">End date must be after start date. Please adjust your selection.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Duration Summary */}
      {isValidDateRange && duration && (
        <Card className="bg-gti-light-green/10 border-gti-bright-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gti-dark-green flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Campaign Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Duration:</span> {duration} days
              </p>
              <p className="text-sm">
                <span className="font-semibold">Start:</span> {format(formData.startDate, "EEEE, MMMM do, yyyy")} at
                12:00 AM
              </p>
              <p className="text-sm">
                <span className="font-semibold">End:</span> {format(formData.endDate, "EEEE, MMMM do, yyyy")} at 11:59
                PM
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Timeline Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Timeline Recommendations</CardTitle>
          <CardDescription>Best practices for BOGO campaign scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium">Optimal Duration</p>
              <p className="text-xs text-muted-foreground">
                2-4 weeks provides enough time for customer awareness and purchasing decisions
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium">Advance Notice</p>
              <p className="text-xs text-muted-foreground">
                Start campaigns at least 3-5 days in the future to allow for customer communication
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full mt-2" />
            <div>
              <p className="text-sm font-medium">Seasonal Timing</p>
              <p className="text-xs text-muted-foreground">
                Consider holidays, industry events, and customer buying patterns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
