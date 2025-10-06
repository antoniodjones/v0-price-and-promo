"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Search, Package, Percent, DollarSign, Gift } from "lucide-react"

interface BogoRewardStepProps {
  formData: any
  updateFormData: (updates: any) => void
}

const rewardTypes = [
  {
    id: "percentage",
    name: "Percentage Off",
    description: "Give a percentage discount on the reward item",
    icon: Percent,
    example: "50% off second item",
  },
  {
    id: "dollar",
    name: "Dollar Amount Off",
    description: "Give a fixed dollar discount on the reward item",
    icon: DollarSign,
    example: "$10 off second item",
  },
  {
    id: "free",
    name: "Free Item",
    description: "Give the reward item completely free",
    icon: Gift,
    example: "Second item free",
  },
]

// Mock reward items based on trigger selection
const getRewardOptions = (triggerTarget: string, type: string) => {
  if (type === "item") {
    return [
      { id: "1", name: "Premium Gummies - 5mg", sku: "PG-5", category: "Edibles" },
      { id: "2", name: "Premium Gummies - 10mg", sku: "PG-10", category: "Edibles" },
      { id: "3", name: "Premium Gummies - 20mg", sku: "PG-20", category: "Edibles" },
    ]
  } else if (type === "brand") {
    return [{ id: "any", name: "Any Second Product from Same Brand", description: "Customer chooses second item" }]
  } else {
    return [{ id: "any", name: "Any Second Product from Same Category", description: "Customer chooses second item" }]
  }
}

const rewardSchema = z
  .object({
    rewardType: z.enum(["percentage", "dollar", "free"], {
      required_error: "Please select a reward type",
    }),
    rewardValue: z.number().min(0, "Value must be positive").optional(),
    rewardTarget: z.string().min(1, "Please select a reward product"),
    rewardQuantity: z.number().int().min(1, "Quantity must be at least 1"),
    maxRewardsPerOrder: z.number().int().min(1, "Must allow at least 1 reward per order"),
  })
  .refine(
    (data) => {
      if (data.rewardType === "percentage") {
        return data.rewardValue !== undefined && data.rewardValue > 0 && data.rewardValue <= 100
      }
      if (data.rewardType === "dollar") {
        return data.rewardValue !== undefined && data.rewardValue > 0
      }
      return true
    },
    {
      message: "Invalid reward value for selected type",
      path: ["rewardValue"],
    },
  )

type RewardFormValues = z.infer<typeof rewardSchema>

export function BogoRewardStep({ formData, updateFormData }: BogoRewardStepProps) {
  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      rewardType: formData.rewardType || undefined,
      rewardValue: formData.rewardValue || 0,
      rewardTarget: formData.rewardTarget || "",
      rewardQuantity: formData.rewardQuantity || 1,
      maxRewardsPerOrder: formData.maxRewardsPerOrder || 1,
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
      rewardType: formData.rewardType || undefined,
      rewardValue: formData.rewardValue || 0,
      rewardTarget: formData.rewardTarget || "",
      rewardQuantity: formData.rewardQuantity || 1,
      maxRewardsPerOrder: formData.maxRewardsPerOrder || 1,
    })
  }, [formData, form])

  const rewardOptions = getRewardOptions(formData.triggerTarget, formData.type)

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gti-dark-green mb-2">Configure Reward</h3>
          <p className="text-muted-foreground">Set up what customers will receive when they trigger the BOGO offer.</p>
        </div>

        {/* Reward Type Selection */}
        <FormField
          control={form.control}
          name="rewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Reward Type *</FormLabel>
              <FormControl>
                <div className="grid gap-3">
                  {rewardTypes.map((type) => {
                    const Icon = type.icon
                    const isSelected = field.value === type.id

                    return (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? "ring-2 ring-gti-bright-green bg-gti-light-green/10" : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          field.onChange(type.id)
                          if (type.id === "free") {
                            form.setValue("rewardValue", 100)
                          }
                        }}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected ? "bg-gti-bright-green text-white" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-sm">{type.name}</CardTitle>
                              <CardDescription className="text-xs">{type.description}</CardDescription>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 bg-gti-bright-green rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-gray-600">{type.example}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reward Value */}
        {form.watch("rewardType") && form.watch("rewardType") !== "free" && (
          <FormField
            control={form.control}
            name="rewardValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("rewardType") === "percentage" ? "Discount Percentage" : "Discount Amount"} *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max={form.watch("rewardType") === "percentage" ? 100 : undefined}
                      step={form.watch("rewardType") === "percentage" ? 1 : 0.01}
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                      className={form.watch("rewardType") === "percentage" ? "pr-8" : "pl-8"}
                    />
                    {form.watch("rewardType") === "percentage" && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</div>
                    )}
                    {form.watch("rewardType") === "dollar" && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Reward Product Selection */}
        <FormField
          control={form.control}
          name="rewardTarget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Reward Product *</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {formData.type === "item" ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Search reward products..." className="pl-10" />
                      </div>
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {rewardOptions.map((item: any) => (
                          <div
                            key={item.id}
                            className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                              field.value === item.name
                                ? "bg-gti-light-green/10 border-l-4 border-l-gti-bright-green"
                                : ""
                            }`}
                            onClick={() => field.onChange(item.name)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Package className="h-4 w-4 text-gti-dark-green" />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  {item.sku && (
                                    <p className="text-sm text-muted-foreground">
                                      SKU: {item.sku} • {item.category}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {field.value === item.name && (
                                <div className="w-5 h-5 bg-gti-bright-green rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Gift className="h-5 w-5 text-gti-bright-green" />
                          <div>
                            <p className="font-medium">Flexible Reward Selection</p>
                            <p className="text-sm text-muted-foreground">
                              Customers can choose any second product from the same {formData.type} for their reward
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Advanced Settings */}
        <div className="space-y-4">
          <FormLabel className="text-base font-medium">Advanced Settings</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rewardQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>How many reward items customer receives</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxRewardsPerOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Rewards Per Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>Limit how many times BOGO can apply per order</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Reward Summary */}
        {form.watch("rewardType") && form.watch("rewardTarget") && (
          <Card className="bg-gti-light-green/10 border-gti-bright-green">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gti-dark-green">Reward Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Customers will receive{" "}
                <span className="font-semibold text-gti-dark-green">
                  {form.watch("rewardQuantity")} × {form.watch("rewardTarget")}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-gti-dark-green">
                  {form.watch("rewardType") === "free"
                    ? "no cost (free)"
                    : form.watch("rewardType") === "percentage"
                      ? `${form.watch("rewardValue")}% off`
                      : `$${form.watch("rewardValue")} off`}
                </span>
                {form.watch("maxRewardsPerOrder") > 1 && (
                  <span>, up to {form.watch("maxRewardsPerOrder")} times per order</span>
                )}
                .
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Form>
  )
}
