"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, FileText, Calendar, CheckCircle, XCircle, MapPin } from "lucide-react"

interface ComplianceStatus {
  licenseStatus: "active" | "expiring" | "expired"
  licenseNumber: string
  expirationDate: string
  daysUntilExpiration: number
  state: string
  marketType: "medical" | "adult-use" | "dual-use"
  customerSegment: string
  coaCompliance: number
  batchTrackingCompliance: number
  reportingCompliance: number
  metrcCompliance: number
}

const GTI_MARKETS = [
  { state: "Illinois", type: "adult-use", segment: "Adult-Use + Medical" },
  { state: "Pennsylvania", type: "medical", segment: "Medical Only" },
  { state: "New Jersey", type: "adult-use", segment: "Adult-Use + Medical" },
  { state: "Florida", type: "medical", segment: "Medical Only" },
  { state: "Ohio", type: "dual-use", segment: "Dual-Use Transition" },
  { state: "New York", type: "adult-use", segment: "Adult-Use + Medical" },
  { state: "Minnesota", type: "dual-use", segment: "Preparing Adult-Use" },
]

interface COARecord {
  id: string
  batchId: string
  productName: string
  testDate: string
  status: "valid" | "expired" | "missing"
  thcLevel: number
  cbdLevel: number
  contaminants: "pass" | "fail"
  potency: "pass" | "fail"
  state: string
  brand: string
}

export function ComplianceCenter() {
  const [complianceData, setComplianceData] = useState<ComplianceStatus[]>([])
  const [coaRecords, setCoaRecords] = useState<COARecord[]>([])
  const [selectedMarket, setSelectedMarket] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplianceData()
  }, [])

  const fetchComplianceData = async () => {
    setLoading(true)
    try {
      const mockCompliance: ComplianceStatus[] = GTI_MARKETS.map((market, index) => ({
        licenseStatus: index === 0 ? "expiring" : "active",
        licenseNumber: `GTI-${market.state.substring(0, 2).toUpperCase()}-${2024 + index}`,
        expirationDate: `2025-${String(6 + index).padStart(2, "0")}-15`,
        daysUntilExpiration: 45 + index * 30,
        state: market.state,
        marketType: market.type as "medical" | "adult-use" | "dual-use",
        customerSegment: market.segment,
        coaCompliance: 92 + Math.floor(Math.random() * 8),
        batchTrackingCompliance: 95 + Math.floor(Math.random() * 5),
        reportingCompliance: 88 + Math.floor(Math.random() * 10),
        metrcCompliance: 96 + Math.floor(Math.random() * 4),
      }))

      const mockCOAs: COARecord[] = [
        {
          id: "coa-001",
          batchId: "RYTHM-IL-2025-0892",
          productName: "RYTHM Gummies - 10mg",
          testDate: "2025-01-15",
          status: "valid",
          thcLevel: 9.8,
          cbdLevel: 0.2,
          contaminants: "pass",
          potency: "pass",
          state: "Illinois",
          brand: "RYTHM",
        },
        {
          id: "coa-002",
          batchId: "DW-PA-2025-0893",
          productName: "Dogwalkers Pre-Roll",
          testDate: "2025-01-10",
          status: "expired",
          thcLevel: 22.4,
          cbdLevel: 1.1,
          contaminants: "pass",
          potency: "pass",
          state: "Pennsylvania",
          brand: "Dogwalkers",
        },
        {
          id: "coa-003",
          batchId: "INC-NJ-2025-0894",
          productName: "incredibles Chocolate",
          testDate: "2025-01-12",
          status: "valid",
          thcLevel: 5.2,
          cbdLevel: 0.1,
          contaminants: "pass",
          potency: "pass",
          state: "New Jersey",
          brand: "incredibles",
        },
      ]

      setComplianceData(mockCompliance)
      setCoaRecords(mockCOAs)
    } catch (error) {
      console.error("Failed to fetch compliance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompliance =
    selectedMarket === "all" ? complianceData : complianceData.filter((data) => data.state === selectedMarket)

  const filteredCOAs = selectedMarket === "all" ? coaRecords : coaRecords.filter((coa) => coa.state === selectedMarket)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "valid":
      case "pass":
        return "text-green-600"
      case "expiring":
      case "expired":
      case "missing":
      case "fail":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "valid":
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expiring":
      case "expired":
      case "missing":
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading compliance data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">GTI Cannabis Compliance Center</h3>
          <p className="text-muted-foreground">Monitor regulatory compliance across all GTI markets</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              {GTI_MARKETS.map((market) => (
                <SelectItem key={market.state} value={market.state}>
                  {market.state} ({market.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchComplianceData} disabled={loading}>
            <Shield className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>

      {filteredCompliance.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredCompliance.length}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredCompliance.filter((c) => c.marketType === "medical").length} Medical,{" "}
                  {filteredCompliance.filter((c) => c.marketType === "adult-use").length} Adult-Use,{" "}
                  {filteredCompliance.filter((c) => c.marketType === "dual-use").length} Dual-Use
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">License Status</CardTitle>
                {getStatusIcon(filteredCompliance.some((c) => c.licenseStatus === "expiring") ? "expiring" : "active")}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredCompliance.filter((c) => c.licenseStatus === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredCompliance.filter((c) => c.licenseStatus === "expiring").length} expiring soon
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg COA Compliance</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    filteredCompliance.reduce((sum, c) => sum + c.coaCompliance, 0) / filteredCompliance.length,
                  )}
                  %
                </div>
                <Progress
                  value={filteredCompliance.reduce((sum, c) => sum + c.coaCompliance, 0) / filteredCompliance.length}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Metrc Compliance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    filteredCompliance.reduce((sum, c) => sum + c.metrcCompliance, 0) / filteredCompliance.length,
                  )}
                  %
                </div>
                <Progress
                  value={filteredCompliance.reduce((sum, c) => sum + c.metrcCompliance, 0) / filteredCompliance.length}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Batch Tracking</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    filteredCompliance.reduce((sum, c) => sum + c.batchTrackingCompliance, 0) /
                      filteredCompliance.length,
                  )}
                  %
                </div>
                <Progress
                  value={
                    filteredCompliance.reduce((sum, c) => sum + c.batchTrackingCompliance, 0) /
                    filteredCompliance.length
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {selectedMarket !== "all" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCompliance.map((market) => (
                <Card key={market.state}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {market.state}
                      </CardTitle>
                      <Badge
                        variant={
                          market.marketType === "adult-use"
                            ? "default"
                            : market.marketType === "medical"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {market.marketType.replace("-", " ")}
                      </Badge>
                    </div>
                    <CardDescription>{market.customerSegment}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">License: {market.licenseNumber}</span>
                      <Badge variant={market.daysUntilExpiration < 90 ? "destructive" : "default"}>
                        {market.daysUntilExpiration} days left
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">COA Compliance</div>
                        <div className="text-lg font-bold">{market.coaCompliance}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Metrc Tracking</div>
                        <div className="text-lg font-bold">{market.metrcCompliance}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Tabs defaultValue="coa-management" className="space-y-6">
            <TabsList>
              <TabsTrigger value="coa-management">COA Management</TabsTrigger>
              <TabsTrigger value="batch-tracking">Metrc Tracking</TabsTrigger>
              <TabsTrigger value="regulatory-reports">Regulatory Reports</TabsTrigger>
              <TabsTrigger value="license-management">License Management</TabsTrigger>
            </TabsList>

            <TabsContent value="coa-management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>GTI Brand COA Records</CardTitle>
                  <CardDescription>
                    Track and validate product testing certificates across all GTI brands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCOAs.map((coa) => (
                      <div key={coa.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(coa.status)}
                            <h4 className="font-medium">{coa.productName}</h4>
                            <Badge variant="outline">{coa.batchId}</Badge>
                            <Badge variant="secondary">{coa.brand}</Badge>
                            <Badge variant={coa.status === "valid" ? "default" : "destructive"}>{coa.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Market: </span>
                              <span className="font-medium">{coa.state}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">THC: </span>
                              <span className="font-medium">{coa.thcLevel}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CBD: </span>
                              <span className="font-medium">{coa.cbdLevel}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Contaminants: </span>
                              <span className={`font-medium ${getStatusColor(coa.contaminants)}`}>
                                {coa.contaminants}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Potency: </span>
                              <span className={`font-medium ${getStatusColor(coa.potency)}`}>{coa.potency}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Tested: {new Date(coa.testDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View COA
                          </Button>
                          {coa.status === "expired" && (
                            <Button size="sm" variant="default">
                              Retest
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="batch-tracking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metrc Track & Trace Integration</CardTitle>
                  <CardDescription>
                    Monitor batch lifecycle and compliance across GTI's multi-state operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Metrc integration dashboard coming soon...
                    <p className="text-sm mt-2">
                      Track seed-to-sale compliance across all {GTI_MARKETS.length} GTI markets
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="license-management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-State License Management</CardTitle>
                  <CardDescription>Track license renewals across all GTI markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCompliance.map((market) => (
                      <div key={market.state} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {market.state} License
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {market.licenseNumber} • {market.customerSegment}
                          </p>
                          <p className="text-xs text-muted-foreground">Expires: {market.expirationDate}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={market.daysUntilExpiration < 90 ? "destructive" : "default"}>
                            {market.daysUntilExpiration} days left
                          </Badge>
                          {market.daysUntilExpiration < 90 && (
                            <p className="text-xs text-red-600 mt-1">Renewal required soon</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
