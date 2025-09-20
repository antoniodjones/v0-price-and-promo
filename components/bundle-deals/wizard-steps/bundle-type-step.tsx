"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Package, Layers, TrendingUp, Shuffle } from "lucide-react"

interface BundleTypeStepProps {
  data: any
  onChange: (data: any) => void
}

const bundleTypes = [
  {
    id: "fixed",
    title: "Fixed Product Bundle",
    description: "Specific products bundled together at a set price",
    icon: Package,
    example: "Blue Dream 1/8 + Vape Pen + Gummies = $89.99",
  },
  {
    id: "category",
    title: "Category Bundle",
    description: "Buy X from category Y, get discount on additional items",
    icon: Layers,
    example: "Buy 2 flower products, get 3rd at 50% off",
  },
  {
    id: "mix-match",
    title: "Mix & Match",
    description: "Choose any products from selected categories",
    icon: Shuffle,
    example: "Pick any 3 edibles, save $15",
  },
  {
    id: "tiered",
    title: "Tiered Bundle",
    description: "Increasing discounts based on quantity purchased",
    icon: TrendingUp,
    example: "2-3 items: 10% off, 4-5 items: 15% off, 6+: 20% off",
  },
]

export function BundleTypeStep({ data, onChange }: BundleTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Bundle Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Flower Power Bundle"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the bundle offer..."
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Bundle Type *</Label>
        <RadioGroup value={data.bundleType} onValueChange={(value) => onChange({ bundleType: value })}>
          <div className="grid gap-4 md:grid-cols-2">
            {bundleTypes.map((type) => (
              <div key={type.id}>
                <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                <Label htmlFor={type.id} className="flex cursor-pointer">
                  <Card className="w-full peer-checked:ring-2 peer-checked:ring-gti-bright-green hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gti-light-green rounded-lg">
                          <type.icon className="w-5 h-5 text-gti-dark-green" />
                        </div>
                        <CardTitle className="text-base text-gti-dark-green">{type.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                      <div className="p-2 bg-muted rounded text-xs">
                        <strong>Example:</strong> {type.example}
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {data.bundleType && (
        <div className="p-4 bg-gti-light-green rounded-lg">
          <h4 className="font-medium text-gti-dark-green mb-2">
            Selected: {bundleTypes.find((t) => t.id === data.bundleType)?.title}
          </h4>
          <p className="text-sm text-gti-dark-green">
            {bundleTypes.find((t) => t.id === data.bundleType)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
