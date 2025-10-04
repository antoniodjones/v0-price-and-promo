"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Database,
  Users,
  Package,
  Gift,
  Tag,
  Calculator,
  TestTube,
  BarChart3,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  link?: string
  expectedResult: string
  icon: any
}

const checklistItems: ChecklistItem[] = [
  // Database Setup
  {
    id: "db-seed",
    category: "Database Setup",
    title: "Run Seed Data Script",
    description: "Populate database with sample products, customers, and discount rules",
    expectedResult: "Database contains 15 products, 5 customers, and multiple active discounts",
    icon: Database,
  },
  {
    id: "db-verify",
    category: "Database Setup",
    title: "Verify Database Schema",
    description: "Confirm all tables exist with correct structure",
    expectedResult: "All pricing engine tables present and accessible",
    icon: Database,
  },

  // Customer Discounts
  {
    id: "customer-create",
    category: "Customer Discounts",
    title: "Create Customer Discount",
    description: "Add a new customer-specific discount rule",
    link: "/customer-discounts",
    expectedResult: "New discount appears in list and can be applied to orders",
    icon: Users,
  },
  {
    id: "customer-edit",
    category: "Customer Discounts",
    title: "Edit Customer Discount",
    description: "Modify an existing customer discount percentage",
    link: "/customer-discounts",
    expectedResult: "Changes save successfully and reflect in pricing calculations",
    icon: Users,
  },
  {
    id: "customer-delete",
    category: "Customer Discounts",
    title: "Delete Customer Discount",
    description: "Remove an outdated customer discount",
    link: "/customer-discounts",
    expectedResult: "Discount removed from list and no longer applies to orders",
    icon: Users,
  },

  // Tier Management
  {
    id: "tier-create",
    category: "Tier Management",
    title: "Create Tier Discount",
    description: "Set up tier-based pricing rules",
    link: "/tier-management",
    expectedResult: "Tier discount applies to all customers in that tier",
    icon: BarChart3,
  },
  {
    id: "tier-assign",
    category: "Tier Management",
    title: "Assign Customer to Tier",
    description: "Move a customer to a different pricing tier",
    link: "/tier-management",
    expectedResult: "Customer receives tier-appropriate pricing automatically",
    icon: BarChart3,
  },

  // Inventory Discounts
  {
    id: "inventory-create",
    category: "Inventory Discounts",
    title: "Create Inventory Discount",
    description: "Set up automated discounts based on inventory conditions",
    link: "/inventory-discounts",
    expectedResult: "Discount automatically applies when conditions are met",
    icon: Package,
  },
  {
    id: "inventory-expiration",
    category: "Inventory Discounts",
    title: "Test Expiration Discount",
    description: "Verify discounts apply to products nearing expiration",
    link: "/inventory-discounts",
    expectedResult: "Products within expiration window receive correct discount",
    icon: Package,
  },

  // Bundle Deals
  {
    id: "bundle-create",
    category: "Bundle Deals",
    title: "Create Bundle Deal",
    description: "Set up a product bundle with special pricing",
    link: "/bundle-deals",
    expectedResult: "Bundle appears in promotions and applies correct pricing",
    icon: Gift,
  },
  {
    id: "bundle-test",
    category: "Bundle Deals",
    title: "Test Bundle Application",
    description: "Add bundle items to cart and verify pricing",
    link: "/bundle-deals",
    expectedResult: "Bundle discount applies when all items are in cart",
    icon: Gift,
  },

  // Promo Codes
  {
    id: "promo-create",
    category: "Promo Codes",
    title: "Create Promo Code",
    description: "Generate a new promotional code",
    link: "/promo-codes",
    expectedResult: "Code can be applied at checkout for discount",
    icon: Tag,
  },
  {
    id: "promo-limit",
    category: "Promo Codes",
    title: "Test Usage Limits",
    description: "Verify promo code respects usage limits",
    link: "/promo-codes",
    expectedResult: "Code becomes invalid after reaching usage limit",
    icon: Tag,
  },

  // Pricing Calculator
  {
    id: "calc-single",
    category: "Pricing Calculator",
    title: "Calculate Single Product Price",
    description: "Test pricing for one product with customer discount",
    link: "/pricing-simulator",
    expectedResult: "Correct discount applied, final price accurate",
    icon: Calculator,
  },
  {
    id: "calc-multiple",
    category: "Pricing Calculator",
    title: "Calculate Multi-Product Order",
    description: "Test pricing for order with multiple products",
    link: "/pricing-simulator",
    expectedResult: "All applicable discounts applied, best deal selected",
    icon: Calculator,
  },
  {
    id: "calc-conflict",
    category: "Pricing Calculator",
    title: "Test Discount Conflicts",
    description: "Verify no-stacking policy with multiple applicable discounts",
    link: "/pricing-simulator",
    expectedResult: "Only best discount applies, no stacking occurs",
    icon: Calculator,
  },

  // Pricing Simulator
  {
    id: "sim-basic",
    category: "Pricing Simulator",
    title: "Run Basic Simulation",
    description: "Test pricing with sample product and customer",
    link: "/pricing-simulator",
    expectedResult: "Simulator shows correct base price, discount, and final price",
    icon: TestTube,
  },
  {
    id: "sim-edge",
    category: "Pricing Simulator",
    title: "Test Edge Cases",
    description: "Try unusual scenarios (zero quantity, null values, etc.)",
    link: "/pricing-simulator",
    expectedResult: "System handles edge cases gracefully with proper validation",
    icon: TestTube,
  },

  // Dashboard & Reporting
  {
    id: "dash-metrics",
    category: "Dashboard",
    title: "Verify Dashboard Metrics",
    description: "Check that dashboard shows accurate statistics",
    link: "/",
    expectedResult: "All metrics display correctly with real data",
    icon: BarChart3,
  },
  {
    id: "dash-activity",
    category: "Dashboard",
    title: "Check Recent Activity",
    description: "Verify activity feed shows recent changes",
    link: "/",
    expectedResult: "Recent discount creations and applications appear in feed",
    icon: BarChart3,
  },
]

export function TestingChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Load checked items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pricing-engine-checklist")
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)))
    }
    // Expand all categories by default
    const categories = new Set(checklistItems.map((item) => item.category))
    setExpandedCategories(categories)
  }, [])

  // Save checked items to localStorage
  useEffect(() => {
    localStorage.setItem("pricing-engine-checklist", JSON.stringify(Array.from(checkedItems)))
  }, [checkedItems])

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const resetChecklist = () => {
    setCheckedItems(new Set())
    localStorage.removeItem("pricing-engine-checklist")
  }

  const categories = Array.from(new Set(checklistItems.map((item) => item.category)))
  const totalItems = checklistItems.length
  const completedItems = checkedItems.size
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  const getCategoryIcon = (category: string) => {
    const item = checklistItems.find((i) => i.category === category)
    return item?.icon || CheckCircle
  }

  const getCategoryProgress = (category: string) => {
    const categoryItems = checklistItems.filter((item) => item.category === category)
    const completedCategoryItems = categoryItems.filter((item) => checkedItems.has(item.id))
    return {
      completed: completedCategoryItems.length,
      total: categoryItems.length,
      percentage: Math.round((completedCategoryItems.length / categoryItems.length) * 100),
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-gti-green" />
                Testing Checklist
              </CardTitle>
              <CardDescription>Comprehensive validation guide for the pricing engine</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetChecklist}>
              Reset Progress
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gti-dark-green">
                  {completedItems} / {totalItems}
                </div>
                <div className="text-sm text-muted-foreground">Tests Completed</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gti-green">{progressPercentage}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 [&>div]:bg-gti-green" />
          </div>
        </CardContent>
      </Card>

      {/* Category Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const progress = getCategoryProgress(category)
          const CategoryIcon = getCategoryIcon(category)
          const isComplete = progress.completed === progress.total

          return (
            <Card key={category} className={isComplete ? "border-gti-green bg-gti-green/5" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className={`h-4 w-4 ${isComplete ? "text-gti-green" : "text-gray-500"}`} />
                    <span className="font-medium text-sm">{category}</span>
                  </div>
                  {isComplete && <CheckCircle className="h-4 w-4 text-gti-green" />}
                </div>
                <div className="text-2xl font-bold text-gti-dark-green mb-1">
                  {progress.completed} / {progress.total}
                </div>
                <Progress value={progress.percentage} className="h-2 [&>div]:bg-gti-green" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Checklist by Category */}
      {categories.map((category) => {
        const categoryItems = checklistItems.filter((item) => item.category === category)
        const isExpanded = expandedCategories.has(category)
        const CategoryIcon = getCategoryIcon(category)
        const progress = getCategoryProgress(category)

        return (
          <Card key={category}>
            <CardHeader className="cursor-pointer hover:bg-gray-50" onClick={() => toggleCategory(category)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gti-green/10 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-gti-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>
                      {progress.completed} of {progress.total} tests completed
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={progress.completed === progress.total ? "default" : "outline"}
                  className={progress.completed === progress.total ? "bg-gti-green hover:bg-gti-green/90" : ""}
                >
                  {progress.percentage}%
                </Badge>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-4">
                {categoryItems.map((item) => {
                  const isChecked = checkedItems.has(item.id)

                  return (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg ${isChecked ? "bg-green-50 border-green-200" : "bg-white"}`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={item.id}
                          checked={isChecked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={item.id}
                            className={`font-medium cursor-pointer ${isChecked ? "text-green-900" : "text-gray-900"}`}
                          >
                            {item.title}
                          </label>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <span className="font-medium text-blue-900">Expected Result: </span>
                            <span className="text-blue-800">{item.expectedResult}</span>
                          </div>
                          {item.link && (
                            <Link href={item.link}>
                              <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-gti-green">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Go to {category}
                              </Button>
                            </Link>
                          )}
                        </div>
                        {isChecked && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Completion Message */}
      {completedItems === totalItems && (
        <Card className="border-gti-green bg-gti-green/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-gti-green" />
              <div>
                <div className="font-bold text-lg text-gti-dark-green">All Tests Completed!</div>
                <div className="text-sm text-gray-600">
                  Your pricing engine has been fully validated and is ready for production use.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="h-5 w-5" />
            Testing Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-amber-900">
          <p>• Complete tests in order within each category for best results</p>
          <p>• Document any unexpected behavior or edge cases you discover</p>
          <p>• Test with realistic data that matches your production scenarios</p>
          <p>• Verify all changes in the pricing simulator before deploying to production</p>
          <p>• Keep the seed data script updated as you add new products and rules</p>
        </CardContent>
      </Card>
    </div>
  )
}
