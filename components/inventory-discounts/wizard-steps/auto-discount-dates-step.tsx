"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Zap } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

interface AutoDiscountDatesStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

const datesSchema = z
  .object({
    startDate: z.date({
      required_error: "Activation date is required",
    }),
    endDate: z.date().nullable(),
  })
  .refine(
    (data) => {
      if (data.endDate === null) return true
      return data.endDate > data.startDate
    },
    {
      message: "Deactivation date must be after activation date",
      path: ["endDate"],
    },
  )

type DatesFormValues = z.infer<typeof datesSchema>

export function AutoDiscountDatesStep({ formData, updateFormData }: AutoDiscountDatesStepProps) {
  const form = useForm<DatesFormValues>({
    resolver: zodResolver(datesSchema),
    defaultValues: {
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || null,
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
      endDate: formData.endDate || null,
    })
  }, [formData, form])

  return (
    <Form {...form}>
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
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Activation Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick activation date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />

                    {/* Quick date options */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(new Date())}>
                        Start Today
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const tomorrow = new Date()
                          tomorrow.setDate(tomorrow.getDate() + 1)
                          field.onChange(tomorrow)
                        }}
                      >
                        Start Tomorrow
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const nextWeek = new Date()
                          nextWeek.setDate(nextWeek.getDate() + 7)
                          field.onChange(nextWeek)
                        }}
                      >
                        Start Next Week
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="auto-no-end-date"
                        checked={field.value === null}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange(null)
                          }
                        }}
                      />
                      <FormLabel htmlFor="auto-no-end-date" className="text-sm font-normal">
                        Run indefinitely (recommended for inventory management)
                      </FormLabel>
                    </div>

                    {field.value !== null && (
                      <>
                        <FormLabel>Rule Deactivation Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick deactivation date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || (form.watch("startDate") && date <= form.watch("startDate"))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />

                        {/* Quick end date options */}
                        {form.watch("startDate") && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const threeMonths = new Date(form.watch("startDate")!)
                                threeMonths.setMonth(threeMonths.getMonth() + 3)
                                field.onChange(threeMonths)
                              }}
                            >
                              3 Months
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const sixMonths = new Date(form.watch("startDate")!)
                                sixMonths.setMonth(sixMonths.getMonth() + 6)
                                field.onChange(sixMonths)
                              }}
                            >
                              6 Months
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const oneYear = new Date(form.watch("startDate")!)
                                oneYear.setFullYear(oneYear.getFullYear() + 1)
                                field.onChange(oneYear)
                              }}
                            >
                              1 Year
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Processing Timeline */}
        {form.watch("startDate") && (
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
                      {format(form.watch("startDate")!, "PPP")} - System begins monitoring inventory
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
                {form.watch("endDate") && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Rule Deactivation</p>
                      <p className="text-sm text-muted-foreground">
                        {format(form.watch("endDate")!, "PPP")} - Automatic monitoring stops
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {form.watch("startDate") && (
          <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
              <p className="text-sm font-medium text-gti-dark-green">Automatic Rule Schedule</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active from {format(form.watch("startDate")!, "PPP")}
              {form.watch("endDate") ? ` until ${format(form.watch("endDate")!, "PPP")}` : " with no planned end date"}
            </p>
          </div>
        )}
      </div>
    </Form>
  )
}
