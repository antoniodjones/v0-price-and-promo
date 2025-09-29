"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"
import type { PromoFormData } from "../promotional-discount-wizard"

interface PromoDateStepProps {
  formData: PromoFormData
  updateFormData: (updates: Partial<PromoFormData>) => void
}

export function PromoDatesStep({ formData, updateFormData }: PromoDateStepProps) {
  const handleStartDateChange = (value: string) => {
    const date = value ? new Date(value) : null
    updateFormData({ startDate: date })
  }

  const handleEndDateChange = (value: string) => {
    const date = value ? new Date(value) : null
    updateFormData({ endDate: date })
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ""
    return date.toISOString().slice(0, 16)
  }

  const getMinEndDate = () => {
    if (!formData.startDate) return ""
    const minDate = new Date(formData.startDate)
    minDate.setHours(minDate.getHours() + 1) // Minimum 1 hour duration
    return minDate.toISOString().slice(0, 16)
  }

  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return ""
    const diff = formData.endDate.getTime() - formData.startDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours > 0 ? `and ${hours} hour${hours > 1 ? "s" : ""}` : ""}`
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Promotion Dates</h2>
        <p className="text-muted-foreground mt-2">Configure when this promotion will be active</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Date */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gti-bright-green" />
              <CardTitle>Start Date & Time</CardTitle>
            </div>
            <CardDescription>When should this promotion begin?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date & Time</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={formatDateForInput(formData.startDate)}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </CardContent>
        </Card>

        {/* End Date */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gti-bright-green" />
              <CardTitle>End Date & Time</CardTitle>
            </div>
            <CardDescription>When should this promotion end?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date & Time</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={formatDateForInput(formData.endDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
                min={getMinEndDate()}
                disabled={!formData.startDate}
              />
              {!formData.startDate && <p className="text-sm text-muted-foreground">Please select a start date first</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duration Summary */}
      {formData.startDate && formData.endDate && (
        <Card className="bg-gti-light-green/10 border-gti-light-green">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gti-bright-green" />
              <CardTitle>Promotion Duration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Start:</strong> {formData.startDate.toLocaleString()}
              </p>
              <p className="text-sm">
                <strong>End:</strong> {formData.endDate.toLocaleString()}
              </p>
              <p className="text-sm">
                <strong>Duration:</strong> {getDuration()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Duration Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Duration Presets</CardTitle>
          <CardDescription>Set common promotion durations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "1 Day", hours: 24 },
              { label: "3 Days", hours: 72 },
              { label: "1 Week", hours: 168 },
              { label: "2 Weeks", hours: 336 },
            ].map((preset) => (
              <button
                key={preset.label}
                className="p-2 text-sm border rounded-md hover:bg-gti-light-green/10 hover:border-gti-light-green transition-colors"
                onClick={() => {
                  const now = new Date()
                  const start = new Date(now.getTime() + 60000) // Start in 1 minute
                  const end = new Date(start.getTime() + preset.hours * 60 * 60 * 1000)
                  updateFormData({ startDate: start, endDate: end })
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Messages */}
      {formData.startDate && formData.endDate && formData.endDate <= formData.startDate && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
          <p className="text-sm text-red-600">End date must be after start date</p>
        </div>
      )}
    </div>
  )
}
