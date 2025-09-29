"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, Infinity } from "lucide-react"

interface BundleDatesStepProps {
  data: any
  onChange: (data: any) => void
}

export function BundleDatesStep({ data, onChange }: BundleDatesStepProps) {
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-6">
      {/* Bundle Context */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Schedule & Limits</h4>
        <p className="text-sm text-muted-foreground">Set the active dates and usage limits for your bundle deal</p>
      </div>

      {/* Schedule Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <Calendar className="w-5 h-5" />
            Bundle Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={data.startDate || ""}
                onChange={(e) => onChange({ startDate: e.target.value })}
                min={today}
              />
              <p className="text-xs text-muted-foreground">When the bundle becomes available</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={data.endDate || ""}
                onChange={(e) => onChange({ endDate: e.target.value })}
                min={data.startDate || today}
              />
              <p className="text-xs text-muted-foreground">Leave empty for no end date</p>
            </div>
          </div>

          {data.startDate && data.endDate && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  Bundle will be active for{" "}
                  {Math.ceil(
                    (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <Users className="w-5 h-5" />
            Usage Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Total Usage Limit (Optional)</Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="Unlimited"
                value={data.usageLimit || ""}
                onChange={(e) => onChange({ usageLimit: Number.parseInt(e.target.value) || null })}
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of times this bundle can be purchased by all customers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perCustomerLimit">Per Customer Limit (Optional)</Label>
              <Input
                id="perCustomerLimit"
                type="number"
                placeholder="Unlimited"
                value={data.perCustomerLimit || ""}
                onChange={(e) => onChange({ perCustomerLimit: Number.parseInt(e.target.value) || null })}
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of times each customer can purchase this bundle
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      {data.startDate && (
        <div className="p-4 bg-gti-light-green rounded-lg">
          <h4 className="font-medium text-gti-dark-green mb-3">Schedule Summary</h4>
          <div className="space-y-2 text-sm text-gti-dark-green">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Active from {new Date(data.startDate).toLocaleDateString()}
                {data.endDate ? ` to ${new Date(data.endDate).toLocaleDateString()}` : " (no end date)"}
              </span>
            </div>

            {data.usageLimit && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Total usage limit: {data.usageLimit} purchases</span>
              </div>
            )}

            {data.perCustomerLimit && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Per customer limit: {data.perCustomerLimit} purchases</span>
              </div>
            )}

            {!data.usageLimit && !data.perCustomerLimit && (
              <div className="flex items-center gap-2">
                <Infinity className="w-4 h-4" />
                <span>No usage limits set</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
