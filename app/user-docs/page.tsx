"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Info, Lightbulb, Users, Settings, Upload, BarChart3 } from "lucide-react"

export default function UserDocsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Tier Management User Guide</h1>
        <p className="text-lg text-muted-foreground">
          Complete guide to managing customer tiers, discount rules, and pricing strategies in the GTI Pricing Engine.
          Learn how to create tiered pricing, assign customers, and optimize your discount programs.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="creating-rules">Creating Rules</TabsTrigger>
          <TabsTrigger value="managing-tiers">Managing Tiers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="bulk-operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Tier Management?</CardTitle>
              <CardDescription>
                Tier management allows you to create sophisticated discount programs based on customer segments,
                purchase history, loyalty status, or any custom criteria you define.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-accent-blue mt-1" />
                    <div>
                      <h4 className="font-semibold">Customer Segmentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Organize customers into tiers (Bronze, Silver, Gold, etc.) based on their value, loyalty, or
                        purchase behavior.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-accent-green mt-1" />
                    <div>
                      <h4 className="font-semibold">Flexible Discount Rules</h4>
                      <p className="text-sm text-muted-foreground">
                        Create discount rules with multiple tiers, each offering different discount percentages or fixed
                        amounts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-accent-purple mt-1" />
                    <div>
                      <h4 className="font-semibold">Performance Tracking</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor how your tier-based discounts perform with detailed analytics and customer insights.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Upload className="h-5 w-5 text-accent-yellow mt-1" />
                    <div>
                      <h4 className="font-semibold">Bulk Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload CSV files to assign hundreds or thousands of customers to tiers in seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Automatic Application</h4>
                      <p className="text-sm text-muted-foreground">
                        Once configured, tier discounts automatically apply at checkout based on customer assignments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">No Stacking Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        The system automatically selects the best available discount for each customer to maximize
                        savings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Key Concepts
                </h5>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>
                    <strong>Discount Rule:</strong> A named discount program (e.g., "VIP Customer Program") that
                    contains multiple tiers
                  </div>
                  <div>
                    <strong>Tier:</strong> A level within a discount rule (e.g., Bronze, Silver, Gold) with specific
                    discount values
                  </div>
                  <div>
                    <strong>Customer Assignment:</strong> The association between a customer and a specific tier within
                    a discount rule
                  </div>
                  <div>
                    <strong>Tier Priority:</strong> When multiple discounts apply, the system chooses the one that saves
                    the customer the most money
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-accent-blue">Loyalty Programs</h4>
                  <p className="text-sm text-muted-foreground">
                    Reward repeat customers with increasing discounts as they move up loyalty tiers based on lifetime
                    spend or visit frequency.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Example: Bronze (5% off), Silver (10% off), Gold (15% off), Platinum (20% off)
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-accent-green">Wholesale Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    Offer different pricing tiers for retail customers, small businesses, and large wholesale buyers.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Example: Retail (0%), Small Business (15%), Wholesale (25%)
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-accent-purple">Medical vs Recreational</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide special pricing for medical cardholders while maintaining standard pricing for recreational
                    customers.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Example: Recreational (0%), Medical (10% off), Medical Senior (15% off)
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-accent-yellow">Employee & Partner Discounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Create special pricing tiers for employees, industry partners, and affiliated organizations.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Example: Standard (0%), Partner (20%), Employee (30%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Get up and running with tier management in 5 simple steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Navigate to Discount Rules</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      From the main dashboard, click on "Promotions" in the sidebar, then select "Discount Rules" from
                      the dropdown menu.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Path:</strong> Dashboard → Promotions → Discount Rules
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-green text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Create Your First Discount Rule</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Click the "Create Discount Rule" button to launch the wizard. Give your rule a descriptive name
                      like "VIP Loyalty Program" or "Wholesale Pricing Tiers".
                    </p>
                    <div className="bg-muted p-3 rounded text-sm space-y-1">
                      <div>
                        <strong>Rule Name:</strong> Choose something clear and descriptive
                      </div>
                      <div>
                        <strong>Description:</strong> Explain the purpose and target audience
                      </div>
                      <div>
                        <strong>Status:</strong> Start as "Draft" to test before activating
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-purple text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Configure Your Tiers</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add 2-5 tiers with different discount levels. Common tier names include Bronze/Silver/Gold or
                      Basic/Premium/Elite.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <div className="grid grid-cols-3 gap-2 font-semibold mb-2">
                        <div>Tier Name</div>
                        <div>Discount Type</div>
                        <div>Discount Value</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>Bronze</div>
                        <div>Percentage</div>
                        <div>5%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>Silver</div>
                        <div>Percentage</div>
                        <div>10%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>Gold</div>
                        <div>Percentage</div>
                        <div>15%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-yellow text-black flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Assign Customers to Tiers</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use the customer assignment interface to select customers and assign them to appropriate tiers.
                      You can search by name, email, or customer ID.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm space-y-2">
                      <div>
                        <strong>Manual Assignment:</strong> Search and select individual customers
                      </div>
                      <div>
                        <strong>Bulk Upload:</strong> Use CSV import for large customer lists
                      </div>
                      <div>
                        <strong>Filters:</strong> Use customer attributes to find the right segments
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Review and Activate</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Review your configuration, set start and end dates, then activate your discount rule. The system
                      will automatically apply tier discounts at checkout.
                    </p>
                    <div className="bg-green-50 border border-green-200 p-3 rounded text-sm text-green-700">
                      <strong>✓ Pro Tip:</strong> Test with a small group of customers first before rolling out to your
                      entire customer base.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Tutorial</CardTitle>
              <CardDescription>Watch a 5-minute walkthrough of creating your first tier-based discount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🎥</div>
                  <div className="text-sm text-muted-foreground">Video tutorial coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creating-rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creating Discount Rules</CardTitle>
              <CardDescription>Step-by-step guide to the discount rule creation wizard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-blue pl-4 space-y-3">
                <h4 className="font-semibold text-lg">Step 1: Rule Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Define the basic information for your discount rule. This information helps you and your team
                  understand the purpose and scope of the rule.
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Rule Name</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Choose a clear, descriptive name that explains the purpose of the rule.
                    </p>
                    <div className="bg-muted p-2 rounded text-sm">
                      <div className="text-green-600">✓ Good: "VIP Loyalty Program - 2024"</div>
                      <div className="text-green-600">✓ Good: "Wholesale Pricing Tiers"</div>
                      <div className="text-red-600">✗ Bad: "Discount 1"</div>
                      <div className="text-red-600">✗ Bad: "Test"</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Description</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Provide details about who this rule is for and what it accomplishes.
                    </p>
                    <div className="bg-muted p-2 rounded text-sm italic">
                      "Tiered discount program for loyal customers based on lifetime spend. Bronze tier for $500+,
                      Silver for $2,000+, Gold for $5,000+."
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Rule Type</h5>
                    <p className="text-sm text-muted-foreground mb-2">Select the type of discount rule:</p>
                    <div className="space-y-2">
                      <div className="bg-muted p-2 rounded text-sm">
                        <strong>Tiered Discount:</strong> Multiple tiers with different discount levels (most common)
                      </div>
                      <div className="bg-muted p-2 rounded text-sm">
                        <strong>Single Tier:</strong> One discount level for all assigned customers
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Status</h5>
                    <p className="text-sm text-muted-foreground mb-2">Choose the initial status:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Draft</Badge>
                        <span className="text-sm">Rule is saved but not active (recommended for new rules)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Active</Badge>
                        <span className="text-sm">Rule is live and discounts are being applied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Scheduled</Badge>
                        <span className="text-sm">Rule will activate automatically on the start date</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-accent-green pl-4 space-y-3">
                <h4 className="font-semibold text-lg">Step 2: Tier Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Create your discount tiers. Each tier represents a different level of discount that customers can
                  receive.
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Adding Tiers</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Click "Add Tier" to create each tier level. Most programs have 3-4 tiers.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Tier Name</h5>
                    <p className="text-sm text-muted-foreground mb-2">Common naming conventions:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted p-2 rounded">Bronze / Silver / Gold / Platinum</div>
                      <div className="bg-muted p-2 rounded">Basic / Premium / Elite</div>
                      <div className="bg-muted p-2 rounded">Tier 1 / Tier 2 / Tier 3</div>
                      <div className="bg-muted p-2 rounded">Standard / Plus / Pro</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Discount Type</h5>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <div className="font-semibold text-sm mb-1">Percentage Discount</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Discount as a percentage of the product price (e.g., 10% off)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Best for: General loyalty programs, consistent discounts across all products
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded">
                        <div className="font-semibold text-sm mb-1">Fixed Amount Discount</div>
                        <div className="text-sm text-muted-foreground mb-2">Fixed dollar amount off (e.g., $5 off)</div>
                        <div className="text-xs text-muted-foreground">
                          Best for: Specific promotions, uniform savings regardless of price
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Discount Value</h5>
                    <p className="text-sm text-muted-foreground mb-2">Enter the discount amount:</p>
                    <div className="bg-muted p-3 rounded text-sm space-y-1">
                      <div>
                        <strong>Percentage:</strong> Enter 5 for 5%, 10 for 10%, etc. (0-100)
                      </div>
                      <div>
                        <strong>Fixed Amount:</strong> Enter dollar amount like 5.00 for $5 off
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-700">
                        <strong>Tip:</strong> Create a clear progression in your tiers. For example: Bronze (5%), Silver
                        (10%), Gold (15%), Platinum (20%). This encourages customers to move up tiers.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-accent-purple pl-4 space-y-3">
                <h4 className="font-semibold text-lg">Step 3: Customer Assignment</h4>
                <p className="text-sm text-muted-foreground">
                  Assign customers to the tiers you've created. You can do this manually or use bulk upload.
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Manual Assignment</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Use the search bar to find customers by name, email, or ID</li>
                      <li>Select the tier from the dropdown next to each customer</li>
                      <li>Click "Assign" to save the assignment</li>
                      <li>Repeat for additional customers</li>
                    </ol>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Bulk Assignment (CSV Upload)</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      For large customer lists, use the CSV upload feature. See the "Bulk Operations" tab for detailed
                      instructions.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Assignment Matrix View</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      The matrix view shows all customers and their tier assignments in a grid format, making it easy to
                      see the distribution across tiers.
                    </p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <div className="grid grid-cols-4 gap-2 font-semibold mb-2">
                        <div>Customer</div>
                        <div>Bronze</div>
                        <div>Silver</div>
                        <div>Gold</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>John Doe</div>
                        <div>○</div>
                        <div>●</div>
                        <div>○</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>Jane Smith</div>
                        <div>○</div>
                        <div>○</div>
                        <div>●</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-accent-yellow pl-4 space-y-3">
                <h4 className="font-semibold text-lg">Step 4: Dates & Review</h4>
                <p className="text-sm text-muted-foreground">
                  Set the active dates for your discount rule and review all settings before activation.
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-sm mb-1">Start Date</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      When should this discount rule become active? Leave blank to activate immediately upon saving.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">End Date</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      When should this discount rule expire? Leave blank for no expiration (ongoing program).
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-1">Review Summary</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      The review screen shows a summary of your configuration:
                    </p>
                    <div className="bg-muted p-3 rounded text-sm space-y-1">
                      <div>• Rule name and description</div>
                      <div>• Number of tiers configured</div>
                      <div>• Total customers assigned</div>
                      <div>• Customers per tier breakdown</div>
                      <div>• Active date range</div>
                      <div>• Estimated discount impact</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <strong>Before Activating:</strong> Double-check your tier assignments and discount values. Once
                        active, changes may affect customer pricing immediately.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managing-tiers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Managing Tiers</CardTitle>
              <CardDescription>How to edit, update, and optimize your tier configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Editing Existing Tiers</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You can modify tier names, discount types, and discount values at any time. Changes take effect
                    immediately for active rules.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-700">
                    <strong>⚠ Warning:</strong> Changing discount values on active rules will immediately affect
                    customer pricing. Consider creating a new rule version for major changes.
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Adding New Tiers</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click "Add Tier" to create additional tiers within an existing rule. This is useful when expanding
                    your loyalty program or adding new customer segments.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>Example:</strong> You start with Bronze/Silver/Gold tiers, then add a Platinum tier for your
                    highest-value customers.
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Removing Tiers</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    To remove a tier, click the delete icon next to the tier name. You'll be prompted to reassign any
                    customers currently in that tier.
                  </p>
                  <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                    <strong>Important:</strong> You cannot delete a tier that has customers assigned to it without first
                    reassigning those customers to another tier.
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Reordering Tiers</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use the drag handles to reorder tiers. The order affects how tiers are displayed in the UI and
                    reports, but doesn't affect discount application.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tier Performance Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    View performance metrics for each tier to understand usage and impact:
                  </p>
                  <div className="bg-muted p-3 rounded text-sm space-y-2">
                    <div className="grid grid-cols-4 gap-2 font-semibold">
                      <div>Tier</div>
                      <div>Customers</div>
                      <div>Avg Discount</div>
                      <div>Total Savings</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>Bronze</div>
                      <div>234</div>
                      <div>$4.50</div>
                      <div>$1,053</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>Silver</div>
                      <div>156</div>
                      <div>$9.20</div>
                      <div>$1,435</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>Gold</div>
                      <div>89</div>
                      <div>$14.75</div>
                      <div>$1,313</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Tier Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Keep it Simple</h5>
                    <p className="text-sm text-muted-foreground">
                      3-4 tiers is optimal. Too many tiers can confuse customers and complicate management.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Clear Progression</h5>
                    <p className="text-sm text-muted-foreground">
                      Make the value difference between tiers meaningful enough to motivate customers to move up (at
                      least 5% difference).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Consistent Naming</h5>
                    <p className="text-sm text-muted-foreground">
                      Use the same tier naming convention across all your discount rules for consistency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Regular Review</h5>
                    <p className="text-sm text-muted-foreground">
                      Review tier performance quarterly and adjust discount values based on customer behavior and
                      business goals.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Tier Assignments</CardTitle>
              <CardDescription>
                Managing individual customer tier assignments and viewing assignment history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Assigning Individual Customers</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Navigate to the discount rule you want to manage</li>
                    <li>Click on the "Customer Assignments" tab</li>
                    <li>Use the search bar to find a customer by name, email, or customer ID</li>
                    <li>Click "Assign to Tier" next to the customer's name</li>
                    <li>Select the appropriate tier from the dropdown</li>
                    <li>Click "Save Assignment"</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Changing Customer Tiers</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    To move a customer to a different tier, find them in the assignments list and click "Change Tier".
                    Select the new tier and save. The change takes effect immediately.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-700">
                    <strong>Note:</strong> All tier changes are logged in the customer's history for audit purposes.
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Removing Customer Assignments</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    To remove a customer from a tier, click the "Remove" button next to their assignment. The customer
                    will no longer receive discounts from this rule.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Viewing Customer Tier History</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click on any customer to view their tier assignment history, including:
                  </p>
                  <div className="bg-muted p-3 rounded text-sm space-y-1">
                    <div>• Date of each tier assignment</div>
                    <div>• Previous and new tier levels</div>
                    <div>• User who made the change</div>
                    <div>• Total savings from tier discounts</div>
                    <div>• Number of orders with tier discounts applied</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Filtering and Sorting</h4>
                  <p className="text-sm text-muted-foreground mb-3">Use filters to find specific customer segments:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Filter by Tier:</strong> Show only customers in a specific tier
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Filter by Status:</strong> Active, inactive, or expired assignments
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Sort by Name:</strong> Alphabetical order
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Sort by Date:</strong> Most recent assignments first
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Assignment Matrix View</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The matrix view provides a visual overview of all customer assignments across tiers. This is useful
                    for:
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• Quickly seeing tier distribution</div>
                    <div>• Identifying customers who need tier updates</div>
                    <div>• Bulk selecting customers for tier changes</div>
                    <div>• Exporting assignment data</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Tier Dashboard</CardTitle>
              <CardDescription>Overview of all customer tier assignments across your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Customer Tier Dashboard provides a centralized view of all tier assignments, allowing you to:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">View All Assignments</h5>
                    <p className="text-sm text-muted-foreground">
                      See every customer's tier assignments across all discount rules in one place.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Track Performance</h5>
                    <p className="text-sm text-muted-foreground">
                      Monitor how tier discounts are performing with real-time analytics and savings data.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Identify Opportunities</h5>
                    <p className="text-sm text-muted-foreground">
                      Find customers who qualify for tier upgrades based on purchase history and behavior.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Export Reports</h5>
                    <p className="text-sm text-muted-foreground">
                      Generate CSV exports of tier assignments for analysis or integration with other systems.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded">
                  <h5 className="font-semibold mb-2">Access the Dashboard</h5>
                  <p className="text-sm text-muted-foreground">
                    Navigate to: <strong>Dashboard → Customers → Tier Dashboard</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Tier Assignment</CardTitle>
              <CardDescription>
                Upload CSV files to assign hundreds or thousands of customers to tiers at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">When to Use Bulk Upload</h4>
                  <p className="text-sm text-muted-foreground mb-3">Bulk upload is ideal for:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-muted p-3 rounded text-sm">
                      • Initial setup of a new tier program with many customers
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">
                      • Quarterly or annual tier updates based on customer performance
                    </div>
                    <div className="bg-muted p-3 rounded text-sm">• Migrating from another system or spreadsheet</div>
                    <div className="bg-muted p-3 rounded text-sm">
                      • Bulk tier changes based on external data analysis
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">CSV File Format</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your CSV file must include the following columns in this exact order:
                  </p>
                  <div className="bg-muted p-4 rounded">
                    <pre className="text-xs overflow-x-auto">
                      {`customer_id,tier_name,start_date,end_date,notes
cust_001,Gold,2024-01-01,,VIP customer
cust_002,Silver,2024-01-01,2024-12-31,Annual review
cust_003,Bronze,2024-01-15,,New loyalty member`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Column Descriptions</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-accent-blue pl-3">
                      <h5 className="font-semibold text-sm">customer_id (Required)</h5>
                      <p className="text-sm text-muted-foreground">
                        The unique identifier for the customer in your system. This can be an email address, customer
                        number, or internal ID.
                      </p>
                    </div>

                    <div className="border-l-4 border-accent-green pl-3">
                      <h5 className="font-semibold text-sm">tier_name (Required)</h5>
                      <p className="text-sm text-muted-foreground">
                        The exact name of the tier as configured in your discount rule (case-sensitive). Must match
                        exactly: "Gold" not "gold".
                      </p>
                    </div>

                    <div className="border-l-4 border-accent-purple pl-3">
                      <h5 className="font-semibold text-sm">start_date (Optional)</h5>
                      <p className="text-sm text-muted-foreground">
                        When the tier assignment should begin. Format: YYYY-MM-DD. Leave blank to start immediately.
                      </p>
                    </div>

                    <div className="border-l-4 border-accent-yellow pl-3">
                      <h5 className="font-semibold text-sm">end_date (Optional)</h5>
                      <p className="text-sm text-muted-foreground">
                        When the tier assignment should expire. Format: YYYY-MM-DD. Leave blank for no expiration.
                      </p>
                    </div>

                    <div className="border-l-4 border-gray-400 pl-3">
                      <h5 className="font-semibold text-sm">notes (Optional)</h5>
                      <p className="text-sm text-muted-foreground">
                        Internal notes about the assignment. Not visible to customers.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Upload Process</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Navigate to the discount rule where you want to upload assignments</li>
                    <li>Click the "Bulk Upload" button in the Customer Assignments section</li>
                    <li>Click "Choose File" and select your CSV file</li>
                    <li>Click "Validate" to check for errors before uploading</li>
                    <li>Review the validation results and fix any errors in your CSV</li>
                    <li>Click "Upload" to process the assignments</li>
                    <li>Wait for the confirmation message (large files may take a few minutes)</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Validation and Error Handling</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The system validates your CSV before processing. Common errors include:
                  </p>
                  <div className="space-y-2">
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                      <strong className="text-red-700">Customer Not Found:</strong>
                      <span className="text-red-600">
                        {" "}
                        The customer_id doesn't exist in the system. Check for typos or create the customer first.
                      </span>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                      <strong className="text-red-700">Invalid Tier Name:</strong>
                      <span className="text-red-600">
                        {" "}
                        The tier_name doesn't match any configured tiers. Check spelling and capitalization.
                      </span>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                      <strong className="text-red-700">Invalid Date Format:</strong>
                      <span className="text-red-600"> Dates must be in YYYY-MM-DD format (e.g., 2024-01-15).</span>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                      <strong className="text-red-700">Duplicate Entries:</strong>
                      <span className="text-red-600">
                        {" "}
                        The same customer appears multiple times. Each customer can only be assigned once per rule.
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Download Template</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click the "Download CSV Template" button to get a pre-formatted CSV file with the correct column
                    headers and example data.
                  </p>
                  <div className="bg-green-50 border border-green-200 p-3 rounded text-sm text-green-700">
                    <strong>Tip:</strong> Start with the template and fill in your customer data to ensure proper
                    formatting.
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Processing Large Files</h4>
                  <p className="text-sm text-muted-foreground mb-3">For files with 1,000+ customers:</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• Upload during off-peak hours to minimize system load</div>
                    <div>• The upload processes in batches of 500 customers</div>
                    <div>• You'll receive an email when processing is complete</div>
                    <div>• Check the upload history to see progress and results</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Export</CardTitle>
              <CardDescription>Export current tier assignments to CSV for analysis or backup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Export your current tier assignments to a CSV file for:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-muted p-3 rounded text-sm">• Backup and record-keeping</div>
                  <div className="bg-muted p-3 rounded text-sm">• Analysis in Excel or other tools</div>
                  <div className="bg-muted p-3 rounded text-sm">• Sharing with team members</div>
                  <div className="bg-muted p-3 rounded text-sm">• Integration with external systems</div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">How to Export</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Navigate to the discount rule you want to export</li>
                    <li>Click the "Export" button in the Customer Assignments section</li>
                    <li>Choose export options (all customers or filtered subset)</li>
                    <li>Click "Download CSV"</li>
                  </ol>
                </div>

                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Export Format:</strong> The exported CSV uses the same format as the bulk upload template,
                  making it easy to modify and re-upload.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Tier Management</CardTitle>
              <CardDescription>Tips and strategies for effective tier-based discount programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-accent-blue pl-4">
                  <h4 className="font-semibold mb-2">Program Design</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Start Simple:</strong> Begin with 3 tiers and expand as needed. Too many tiers can
                        confuse customers and complicate management.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Clear Value Proposition:</strong> Make the benefits of each tier obvious. Customers
                        should understand what they get at each level.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Meaningful Differences:</strong> Ensure at least 5% difference between tier discount
                        levels to motivate customers to move up.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Attainable Goals:</strong> Set tier qualification criteria that are challenging but
                        achievable for your customer base.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-accent-green pl-4">
                  <h4 className="font-semibold mb-2">Customer Communication</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Announce New Programs:</strong> Send email announcements when launching new tier
                        programs or making significant changes.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Tier Upgrade Notifications:</strong> Congratulate customers when they move to a higher
                        tier to reinforce positive behavior.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Progress Updates:</strong> Show customers how close they are to the next tier to
                        encourage additional purchases.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Clear Terms:</strong> Make tier benefits, qualification criteria, and expiration dates
                        easily accessible to customers.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-accent-purple pl-4">
                  <h4 className="font-semibold mb-2">Operational Excellence</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Regular Reviews:</strong> Analyze tier performance quarterly and adjust discount values
                        based on business goals and customer behavior.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Test Before Launch:</strong> Use draft status to test new rules with a small group
                        before rolling out to all customers.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Document Changes:</strong> Use the notes field to document why tier assignments or
                        discount values were changed.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Monitor Impact:</strong> Track key metrics like average order value, customer retention,
                        and discount ROI.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-accent-yellow pl-4">
                  <h4 className="font-semibold mb-2">Data Management</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Regular Backups:</strong> Export tier assignments monthly as a backup and for
                        record-keeping.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Clean Data:</strong> Regularly review and remove inactive customer assignments to keep
                        your data clean.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Audit Trail:</strong> Use the assignment history feature to track changes and maintain
                        accountability.
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Bulk Operations:</strong> Use CSV uploads for large-scale changes to save time and
                        reduce errors.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Pitfalls to Avoid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm">Too Many Tiers</h5>
                    <p className="text-sm text-muted-foreground">
                      More than 5 tiers becomes difficult to manage and confusing for customers. Keep it simple.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm">Insufficient Differentiation</h5>
                    <p className="text-sm text-muted-foreground">
                      If tier benefits are too similar (e.g., 5% vs 6%), customers won't be motivated to move up.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm">Ignoring Performance Data</h5>
                    <p className="text-sm text-muted-foreground">
                      Failing to review tier performance regularly can lead to unprofitable discount programs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm">Unclear Qualification Criteria</h5>
                    <p className="text-sm text-muted-foreground">
                      Customers should understand how to qualify for each tier. Ambiguous criteria leads to frustration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm">No Expiration Strategy</h5>
                    <p className="text-sm text-muted-foreground">
                      Consider whether tier assignments should expire to encourage ongoing engagement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
              <CardDescription>Solutions to common issues and questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Discount Not Applying at Checkout
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Possible Causes:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>The discount rule is not active (check status)</li>
                      <li>The customer is not assigned to any tier in the rule</li>
                      <li>The rule has expired (check end date)</li>
                      <li>Another discount with higher value is being applied instead</li>
                      <li>Product exclusions are preventing the discount</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Solution:</strong> Verify the rule status, customer assignment, and date range. Check the
                      pricing calculation logs to see which discount was selected.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    CSV Upload Failing
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Common Issues:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Column headers don't match exactly (case-sensitive)</li>
                      <li>Customer IDs don't exist in the system</li>
                      <li>Tier names don't match configured tiers exactly</li>
                      <li>Date format is incorrect (must be YYYY-MM-DD)</li>
                      <li>File encoding issues (use UTF-8)</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Solution:</strong> Download the CSV template and use it as a starting point. Run the
                      validation step before uploading to identify specific errors.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Customer Assigned to Multiple Tiers
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Explanation:</strong>
                    </p>
                    <p>
                      A customer can be assigned to different tiers in different discount rules. For example, they might
                      be "Gold" in the loyalty program and "Wholesale" in the business pricing rule.
                    </p>
                    <p className="mt-2">
                      <strong>Discount Selection:</strong> When multiple tier discounts apply, the system automatically
                      selects the one that saves the customer the most money.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Can't Delete a Tier
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Reason:</strong>
                    </p>
                    <p>
                      You cannot delete a tier that has customers currently assigned to it. This prevents accidental
                      removal of active customer benefits.
                    </p>
                    <p className="mt-2">
                      <strong>Solution:</strong> First reassign all customers from that tier to another tier, then you
                      can delete the empty tier.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Tier Discount Lower Than Expected
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Possible Causes:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Product has a maximum discount limit configured</li>
                      <li>Another promotion is being applied instead (no stacking)</li>
                      <li>Discount is calculated on sale price, not original price</li>
                      <li>Minimum purchase requirements not met</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Solution:</strong> Check the pricing calculation breakdown to see exactly how the discount
                      was calculated and which rules were applied.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Performance Issues with Large Customer Lists
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Optimization Tips:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Use filters to narrow down customer lists before loading</li>
                      <li>Export and work with CSV files for bulk operations</li>
                      <li>Schedule large bulk uploads during off-peak hours</li>
                      <li>Break very large uploads (10,000+) into smaller batches</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Need to Undo Recent Changes
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Solution:</strong>
                    </p>
                    <p>
                      Use the assignment history feature to see previous tier assignments. You can export the history as
                      CSV and use bulk upload to restore previous assignments.
                    </p>
                    <p className="mt-2">
                      <strong>Prevention:</strong> Always export current assignments before making large-scale changes
                      to have a backup.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">If you need additional assistance:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Technical Support</h5>
                    <p className="text-sm text-muted-foreground mb-2">For technical issues, bugs, or system errors</p>
                    <div className="text-sm">
                      <strong>Email:</strong> support@gtipricing.com
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Customer Success</h5>
                    <p className="text-sm text-muted-foreground mb-2">For strategy advice and best practices</p>
                    <div className="text-sm">
                      <strong>Email:</strong> success@gtipricing.com
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Documentation</h5>
                    <p className="text-sm text-muted-foreground mb-2">Additional guides and resources</p>
                    <div className="text-sm">
                      <strong>Link:</strong> docs.gtipricing.com
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Community Forum</h5>
                    <p className="text-sm text-muted-foreground mb-2">Connect with other users</p>
                    <div className="text-sm">
                      <strong>Link:</strong> community.gtipricing.com
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <h5 className="font-semibold text-blue-800 mb-2">When Contacting Support</h5>
                  <p className="text-sm text-blue-700 mb-2">Please include:</p>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Discount rule name and ID</li>
                    <li>Customer ID (if applicable)</li>
                    <li>Screenshots of the issue</li>
                    <li>Steps to reproduce the problem</li>
                    <li>Any error messages you received</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
