"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { createCheckboxField } from "@/lib/form-helpers"
import type { DiscountFormData } from "../customer-discount-wizard"

const dateSchema = z
  .object({
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date().nullable(),
    noEndDate: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.noEndDate && data.endDate && data.startDate) {
        return data.endDate > data.startDate
      }
      return true
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

type DateFormValues = z.infer<typeof dateSchema>

interface DiscountDatesStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

export function DiscountDatesStep({ formData, updateFormData }: DiscountDatesStepProps) {
  const form = useForm<DateFormValues>({
    resolver: zodResolver(dateSchema),
    defaultValues: {
      startDate: formData.startDate || undefined,
      endDate: formData.endDate,
      noEndDate: formData.endDate ? formData.endDate.getFullYear() > new Date().getFullYear() + 5 : false,
    },
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData({
        startDate: value.startDate || null,
        endDate: value.noEndDate
          ? (() => {
              const farFuture = new Date()
              farFuture.setFullYear(farFuture.getFullYear() + 10)
              return farFuture
            })()
          : value.endDate,
      })
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  const noEndDate = form.watch("noEndDate")

  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const setQuickStartDate = (date: Date) => {
    form.setValue("startDate", date, { shouldValidate: true })
  }

  const setQuickEndDate = (monthsFromStart: number) => {
    const startDate = form.getValues("startDate")
    if (startDate) {
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + monthsFromStart)
      form.setValue("endDate", endDate, { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Discount Period</h2>
        <p className="text-muted-foreground mt-2">Configure when this discount rule will be active</p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
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
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effective Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={formatDateForInput(field.value)}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quick date options */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => setQuickStartDate(new Date())}>
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date()
                        tomorrow.setDate(tomorrow.getDate() + 1)
                        setQuickStartDate(tomorrow)
                      }}
                    >
                      Tomorrow
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const nextWeek = new Date()
                        nextWeek.setDate(nextWeek.getDate() + 7)
                        setQuickStartDate(nextWeek)
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
                  {createCheckboxField(form, "noEndDate", "No planned end date (runs indefinitely)")}

                  {!noEndDate && (
                    <>
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Effective End Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                value={formatDateForInput(field.value)}
                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Quick end date options */}
                      {form.getValues("startDate") && (
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" type="button" onClick={() => setQuickEndDate(1)}>
                            1 Month
                          </Button>
                          <Button variant="outline" size="sm" type="button" onClick={() => setQuickEndDate(3)}>
                            3 Months
                          </Button>
                          <Button variant="outline" size="sm" type="button" onClick={() => setQuickEndDate(6)}>
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

          {/* Date Validation Error */}
          {form.formState.errors.endDate && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm font-medium text-red-800">Invalid Date Range</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.endDate.message}</p>
            </div>
          )}

          {/* Summary */}
          {form.getValues("startDate") && (
            <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
                <p className="text-sm font-medium text-gti-dark-green">Discount Period</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Active from {format(form.getValues("startDate"), "PPP")}
                {noEndDate
                  ? " with no planned end date"
                  : form.getValues("endDate")
                    ? ` until ${format(form.getValues("endDate")!, "PPP")}`
                    : " (end date required)"}
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
