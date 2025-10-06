"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Package, BarChart3, Calendar } from "lucide-react"
import { NumberField } from "@/lib/form-helpers"

const bogoTriggerSchema = z.object({
  triggerQuantity: z.number().min(1, "Trigger quantity must be at least 1"),
  triggerTarget: z.string().min(1, "Please select a trigger target"),
  triggerLevel: z.string().min(1, "Trigger level is required"),
})

type BogoTriggerFormData = z.infer<typeof bogoTriggerSchema>

interface BogoTriggerStepProps {
  formData: any
  updateFormData: (updates: any) => void
}

const mockItems = [
  { id: "1", name: "Premium Gummies - 10mg", sku: "PG-10", category: "Edibles", brand: "Premium Cannabis" },
  { id: "2", name: "Blue Dream Flower - 1oz", sku: "BD-1OZ", category: "Flower", brand: "Premium Cannabis" },
  { id: "3", name: "Chocolate Bar - 100mg", sku: "CB-100", category: "Edibles", brand: "Incredibles" },
]

const mockBrands = [
  { id: "1", name: "Premium Cannabis", productCount: 45 },
  { id: "2", name: "Incredibles", productCount: 23 },
  { id: "3", name: "Green Thumb", productCount: 67 },
]

const mockCategories = [
  { id: "1", name: "Edibles", productCount: 89, subcategories: ["Gummies", "Chocolates", "Beverages"] },
  { id: "2", name: "Flower", productCount: 156, subcategories: ["Indoor", "Outdoor", "Hybrid"] },
  { id: "3", name: "Concentrates", productCount: 78, subcategories: ["Wax", "Shatter", "Live Resin"] },
]

export function BogoTriggerStep({ formData, updateFormData }: BogoTriggerStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])

  const form = useForm<BogoTriggerFormData>({
    resolver: zodResolver(bogoTriggerSchema),
    defaultValues: {
      triggerQuantity: formData.triggerQuantity || 1,
      triggerTarget: formData.triggerTarget || "",
      triggerLevel: formData.triggerLevel || formData.type || "",
    },
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      updateFormData(values)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  const triggerTarget = form.watch("triggerTarget")

  const getSelectionData = () => {
    switch (formData.type) {
      case "item":
        return mockItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      case "brand":
        return mockBrands.filter((brand) => brand.name.toLowerCase().includes(searchTerm.toLowerCase()))
      case "category":
        return mockCategories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      default:
        return []
    }
  }

  const getIcon = () => {
    switch (formData.type) {
      case "item":
        return Package
      case "brand":
        return BarChart3
      case "category":
        return Calendar
      default:
        return Package
    }
  }

  const handleSelection = (item: any) => {
    form.setValue("triggerTarget", item.name)
    form.setValue("triggerLevel", formData.type)
  }

  const toggleSubcategory = (subcategory: string) => {
    const updated = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((s) => s !== subcategory)
      : [...selectedSubcategories, subcategory]
    setSelectedSubcategories(updated)
  }

  const Icon = getIcon()

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gti-dark-green mb-2">
            Select Trigger {formData.type?.charAt(0).toUpperCase() + formData.type?.slice(1)}
          </h3>
          <p className="text-muted-foreground">
            Choose the {formData.type} that customers must purchase to trigger the BOGO offer.
          </p>
        </div>

        {/* Trigger Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            form={form}
            name="triggerQuantity"
            label="Trigger Quantity"
            description="How many items must be purchased to trigger the offer"
            required
          />
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Search {formData.type?.charAt(0).toUpperCase() + formData.type?.slice(1)}s</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${formData.type}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Selection List */}
        <div className="space-y-3">
          <Label>Available {formData.type?.charAt(0).toUpperCase() + formData.type?.slice(1)}s</Label>
          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {getSelectionData().map((item: any) => (
              <div
                key={item.id}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                  triggerTarget === item.name ? "bg-gti-light-green/10 border-l-4 border-l-gti-bright-green" : ""
                }`}
                onClick={() => handleSelection(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-gti-dark-green" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {formData.type === "item" && (
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku} • {item.category} • {item.brand}
                        </p>
                      )}
                      {formData.type === "brand" && (
                        <p className="text-sm text-muted-foreground">{item.productCount} products</p>
                      )}
                      {formData.type === "category" && (
                        <p className="text-sm text-muted-foreground">{item.productCount} products</p>
                      )}
                    </div>
                  </div>
                  {triggerTarget === item.name && (
                    <div className="w-5 h-5 bg-gti-bright-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategory Selection for Categories */}
        {formData.type === "category" && triggerTarget && (
          <div className="space-y-3">
            <Label>Subcategories (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Narrow down to specific subcategories within {triggerTarget}
            </p>
            <div className="flex flex-wrap gap-2">
              {mockCategories
                .find((cat) => cat.name === triggerTarget)
                ?.subcategories.map((sub) => (
                  <Badge
                    key={sub}
                    variant={selectedSubcategories.includes(sub) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedSubcategories.includes(sub)
                        ? "bg-gti-bright-green hover:bg-gti-medium-green"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleSubcategory(sub)}
                  >
                    {sub}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Selected Summary */}
        {triggerTarget && (
          <Card className="bg-gti-light-green/10 border-gti-bright-green">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gti-dark-green">Trigger Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                When customers purchase <span className="font-semibold">{form.watch("triggerQuantity")}</span> of{" "}
                <span className="font-semibold text-gti-dark-green">{triggerTarget}</span>
                {selectedSubcategories.length > 0 && <span> (specifically: {selectedSubcategories.join(", ")})</span>},
                they will be eligible for the BOGO reward.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Form>
  )
}
