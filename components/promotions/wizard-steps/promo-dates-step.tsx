"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar, Clock } from "lucide-react"
import type { PromoFormData } from "../promotional-discount-wizard"

interface PromoDateStepProps {
  formData: PromoFormData
  updateFormData: (updates: Partial<PromoFormData>) => void
}

const datesSchema = z
  .object({
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const diff = data.endDate.getTime() - data.startDate.getTime()
      const hours = diff / (1000 * 60 * 60)
      return hours >= 1
    },
    {
      message: "Promotion must be at least 1 hour long",
      path: ["endDate"],
    },
  )

type DatesFormValues = z.infer<typeof datesSchema>

export function PromoDatesStep({ formData, updateFormData }: PromoDateStepProps) {
  const form = useForm<DatesFormValues>({
    resolver: zodResolver(datesSchema),
    defaultValues: {
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    },
  })

  // Sync form values with parent state
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateFormData(values as any)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  // Update form when parent data changes
  useEffect(() => {
    form.reset({
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    })
  }, [formData, form])

  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return ""
    return date.toISOString().slice(0, 16)
  }

  const getMinEndDate = () => {
    const startDate = form.watch("startDate")
    if (!startDate) return ""
    const minDate = new Date(startDate)
    minDate.setHours(minDate.getHours() + 1)
    return minDate.toISOString().slice(0, 16)
  }

  const getDuration = () => {
    const startDate = form.watch("startDate")
    const endDate = form.watch("endDate")
    if (!startDate || !endDate) return ""
    const diff = endDate.getTime() - startDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours > 0 ? `and ${hours} hour${hours > 1 ? "s" : ""}` : ""}`
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""}`
    }
  }

  return (
    <Form {...form}>
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
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={formatDateForInput(field.value)}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={formatDateForInput(field.value)}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        min={getMinEndDate()}
                        disabled={!form.watch("startDate")}
                      />
                    </FormControl>
                    {!form.watch("startDate") && <FormDescription>Please select a start date first</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Duration Summary */}
        {form.watch("startDate") && form.watch("endDate") && (
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
                  <strong>Start:</strong> {form.watch("startDate")?.toLocaleString()}
                </p>
                <p className="text-sm">
                  <strong>End:</strong> {form.watch("endDate")?.toLocaleString()}
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
                  type="button"
                  className="p-2 text-sm border rounded-md hover:bg-gti-light-green/10 hover:border-gti-light-green transition-colors"
                  onClick={() => {
                    const now = new Date()
                    const start = new Date(now.getTime() + 60000)
                    const end = new Date(start.getTime() + preset.hours * 60 * 60 * 1000)
                    form.setValue("startDate", start)
                    form.setValue("endDate", end)
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
