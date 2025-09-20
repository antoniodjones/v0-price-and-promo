"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Percent, Calendar, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Promotions Hub</h2>
          <p className="text-muted-foreground">
            Manage all promotional campaigns: discounts, BOGO deals, and attribute-based promotions
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/customer-discounts/new">
            <Button className="bg-gti-bright-green hover:bg-gti-medium-green">
              <Percent className="mr-2 h-4 w-4" />
              Create Discount
            </Button>
          </Link>
          <Link href="/promotions/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create BOGO
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Target className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">28</div>
            <p className="text-xs text-muted-foreground">Across all types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">$47,320</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">22.8%</div>
            <p className="text-xs text-muted-foreground">+5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Calendar className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">$398</div>
            <p className="text-xs text-muted-foreground">+18% with promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search all promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="discounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discounts">💰 Discounts (MVP)</TabsTrigger>
          <TabsTrigger value="attributes">⏰ Attribute-Based</TabsTrigger>
          <TabsTrigger value="bogo">🎁 BOGO Deals</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="discounts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-gti-bright-green/20">
              <CardHeader>
                <CardTitle className="text-lg">💰 Item-Level Discounts</CardTitle>
                <p className="text-sm text-muted-foreground">Percentage or dollar off specific products</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gti-dark-green">12</span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <Link href="/customer-discounts">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Item Discounts
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gti-bright-green/20">
              <CardHeader>
                <CardTitle className="text-lg">🏷️ Brand-Level Discounts</CardTitle>
                <p className="text-sm text-muted-foreground">Discounts across entire brands</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gti-dark-green">8</span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <Link href="/customer-discounts?scope=brand">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Brand Discounts
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gti-bright-green/20">
              <CardHeader>
                <CardTitle className="text-lg">📂 Category Discounts</CardTitle>
                <p className="text-sm text-muted-foreground">Discounts for product categories</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gti-dark-green">5</span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <Link href="/customer-discounts?scope=category">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Category Discounts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">⏰ Expiration Discounts</CardTitle>
                <p className="text-sm text-muted-foreground">Automatic discounts for products nearing expiration</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">6</span>
                  <span className="text-sm text-muted-foreground">Active Rules</span>
                </div>
                <Link href="/inventory-discounts?type=expiration">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Expiration Rules
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">🌿 THC% Discounts</CardTitle>
                <p className="text-sm text-muted-foreground">Discounts based on THC percentage thresholds</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                  <span className="text-sm text-muted-foreground">Active Rules</span>
                </div>
                <Link href="/inventory-discounts?type=thc">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage THC Rules
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bogo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">🎁 Item BOGO</CardTitle>
                <p className="text-sm text-muted-foreground">Buy-one-get-one deals for specific items</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <Link href="/promotions?scope=item">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Item BOGO
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">🏷️ Brand BOGO</CardTitle>
                <p className="text-sm text-muted-foreground">BOGO deals across brand products</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <Link href="/promotions?scope=brand">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Brand BOGO
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">📂 Category BOGO</CardTitle>
                <p className="text-sm text-muted-foreground">BOGO deals for product categories</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <Link href="/promotions?scope=category">
                  <Button className="w-full bg-transparent" variant="outline">
                    Manage Category BOGO
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Comprehensive Promotion Analytics</h3>
            <p className="text-muted-foreground mb-4">View performance across all promotion types</p>
            <Link href="/analytics">
              <Button>View Full Analytics</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
