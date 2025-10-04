"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Play,
  Info,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CSVRow {
  customer_id: string
  discount_rule_id: string
  tier: "A" | "B" | "C"
  notes?: string
}

interface ValidationResult {
  row: number
  data: CSVRow
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface ProcessResult {
  success: boolean
  customer_id: string
  discount_rule_id: string
  tier: string
  error?: string
}

export function BulkTierAssignment() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processResults, setProcessResults] = useState<ProcessResult[]>([])
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<"upload" | "validate" | "review" | "complete">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please upload a CSV file.",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        toast({
          title: "Empty File",
          description: "The CSV file appears to be empty.",
          variant: "destructive",
        })
        return
      }

      // Parse header
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase())
      const requiredColumns = ["customer_id", "discount_rule_id", "tier"]
      const missingColumns = requiredColumns.filter((col) => !header.includes(col))

      if (missingColumns.length > 0) {
        toast({
          title: "Invalid CSV Format",
          description: `Missing required columns: ${missingColumns.join(", ")}`,
          variant: "destructive",
        })
        return
      }

      // Parse rows
      const data: CSVRow[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
        const row: any = {}

        header.forEach((col, index) => {
          row[col] = values[index] || ""
        })

        if (row.customer_id && row.discount_rule_id && row.tier) {
          data.push({
            customer_id: row.customer_id,
            discount_rule_id: row.discount_rule_id,
            tier: row.tier.toUpperCase() as "A" | "B" | "C",
            notes: row.notes || "",
          })
        }
      }

      setCsvData(data)
      setCurrentStep("validate")
      toast({
        title: "File Loaded",
        description: `Successfully loaded ${data.length} rows from CSV.`,
      })
    } catch (error) {
      console.error("Error parsing CSV:", error)
      toast({
        title: "Parse Error",
        description: "Failed to parse CSV file. Please check the format.",
        variant: "destructive",
      })
    }
  }

  const validateData = async () => {
    setIsValidating(true)
    try {
      const response = await fetch("/api/tier-assignments/validate-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments: csvData }),
      })

      const result = await response.json()

      if (result.success) {
        setValidationResults(result.data.validations)
        setCurrentStep("review")
        toast({
          title: "Validation Complete",
          description: `${result.data.validations.filter((v: ValidationResult) => v.valid).length} of ${csvData.length} rows are valid.`,
        })
      } else {
        toast({
          title: "Validation Failed",
          description: result.error || "Failed to validate assignments.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating data:", error)
      toast({
        title: "Validation Error",
        description: "Failed to validate assignments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const processAssignments = async () => {
    const validAssignments = validationResults.filter((v) => v.valid).map((v) => v.data)

    if (validAssignments.length === 0) {
      toast({
        title: "No Valid Assignments",
        description: "There are no valid assignments to process.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)
    const results: ProcessResult[] = []

    try {
      // Process in batches of 10
      const batchSize = 10
      for (let i = 0; i < validAssignments.length; i += batchSize) {
        const batch = validAssignments.slice(i, i + batchSize)

        const response = await fetch("/api/tier-assignments/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignments: batch }),
        })

        const result = await response.json()

        if (result.success) {
          results.push(...result.data.results)
        }

        setProgress(Math.min(((i + batch.length) / validAssignments.length) * 100, 100))
      }

      setProcessResults(results)
      setCurrentStep("complete")

      const successCount = results.filter((r) => r.success).length
      const failCount = results.filter((r) => !r.success).length

      toast({
        title: "Processing Complete",
        description: `Successfully assigned ${successCount} tiers. ${failCount} failed.`,
      })
    } catch (error) {
      console.error("Error processing assignments:", error)
      toast({
        title: "Processing Error",
        description: "Failed to process assignments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    const template = `customer_id,discount_rule_id,tier,notes
CUST001,RULE001,A,Premium customer
CUST002,RULE001,B,Standard customer
CUST003,RULE002,C,Basic customer`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tier-assignment-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded.",
    })
  }

  const reset = () => {
    setFile(null)
    setCsvData([])
    setValidationResults([])
    setProcessResults([])
    setProgress(0)
    setCurrentStep("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validCount = validationResults.filter((v) => v.valid).length
  const invalidCount = validationResults.filter((v) => !v.valid).length
  const warningCount = validationResults.filter((v) => v.warnings.length > 0).length

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 ${currentStep === "upload" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "upload" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Upload</span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div
                className={`flex items-center gap-2 ${currentStep === "validate" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "validate" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Validate</span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div
                className={`flex items-center gap-2 ${currentStep === "review" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "review" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  3
                </div>
                <span className="text-sm font-medium">Review</span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div
                className={`flex items-center gap-2 ${currentStep === "complete" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "complete" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  4
                </div>
                <span className="text-sm font-medium">Complete</span>
              </div>
            </div>
            {currentStep !== "upload" && (
              <Button variant="outline" onClick={reset}>
                <Trash2 className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Upload */}
      {currentStep === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>Upload a CSV file containing customer tier assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>CSV Format Requirements</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Your CSV file must include the following columns:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>
                      <strong>customer_id</strong> - The unique customer identifier
                    </li>
                    <li>
                      <strong>discount_rule_id</strong> - The discount rule ID
                    </li>
                    <li>
                      <strong>tier</strong> - The tier (A, B, or C)
                    </li>
                    <li>
                      <strong>notes</strong> - Optional notes about the assignment
                    </li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Label>Upload File</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {file ? file.name : "Drop CSV file here or click to browse"}
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Download Template</Label>
                <div className="border rounded-lg p-8 text-center bg-muted/30">
                  <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Download a CSV template with the correct format</p>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </div>

            {csvData.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({csvData.length} rows loaded)</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Discount Rule ID</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{row.customer_id}</TableCell>
                          <TableCell className="font-mono text-sm">{row.discount_rule_id}</TableCell>
                          <TableCell>
                            <Badge>{row.tier}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{row.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {csvData.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">Showing 5 of {csvData.length} rows</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Validate */}
      {currentStep === "validate" && (
        <Card>
          <CardHeader>
            <CardTitle>Validate Assignments</CardTitle>
            <CardDescription>Verify that all customer IDs, discount rules, and tiers are valid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Required</AlertTitle>
              <AlertDescription>
                Click the button below to validate all {csvData.length} assignments before processing.
              </AlertDescription>
            </Alert>

            <Button onClick={validateData} disabled={isValidating} className="w-full">
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Validate Assignments
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {currentStep === "review" && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valid</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{validCount}</div>
                <p className="text-xs text-muted-foreground">Ready to process</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invalid</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{invalidCount}</div>
                <p className="text-xs text-muted-foreground">Will be skipped</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
                <p className="text-xs text-muted-foreground">Review recommended</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>Review the validation results before processing</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({validationResults.length})</TabsTrigger>
                  <TabsTrigger value="valid">Valid ({validCount})</TabsTrigger>
                  <TabsTrigger value="invalid">Invalid ({invalidCount})</TabsTrigger>
                  <TabsTrigger value="warnings">Warnings ({warningCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-2">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Issues</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults.map((result) => (
                          <TableRow key={result.row}>
                            <TableCell>{result.row}</TableCell>
                            <TableCell className="font-mono text-sm">{result.data.customer_id}</TableCell>
                            <TableCell className="font-mono text-sm">{result.data.discount_rule_id}</TableCell>
                            <TableCell>
                              <Badge>{result.data.tier}</Badge>
                            </TableCell>
                            <TableCell>
                              {result.valid ? (
                                <Badge className="bg-green-500">Valid</Badge>
                              ) : (
                                <Badge variant="destructive">Invalid</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {result.errors.length > 0 && (
                                <div className="text-sm text-red-500">{result.errors.join(", ")}</div>
                              )}
                              {result.warnings.length > 0 && (
                                <div className="text-sm text-yellow-600">{result.warnings.join(", ")}</div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="valid">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults
                          .filter((r) => r.valid)
                          .map((result) => (
                            <TableRow key={result.row}>
                              <TableCell>{result.row}</TableCell>
                              <TableCell className="font-mono text-sm">{result.data.customer_id}</TableCell>
                              <TableCell className="font-mono text-sm">{result.data.discount_rule_id}</TableCell>
                              <TableCell>
                                <Badge>{result.data.tier}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="invalid">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Errors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults
                          .filter((r) => !r.valid)
                          .map((result) => (
                            <TableRow key={result.row}>
                              <TableCell>{result.row}</TableCell>
                              <TableCell className="font-mono text-sm">{result.data.customer_id}</TableCell>
                              <TableCell className="font-mono text-sm">{result.data.discount_rule_id}</TableCell>
                              <TableCell>
                                <Badge>{result.data.tier}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-red-500">{result.errors.join(", ")}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="warnings">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Warnings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults
                          .filter((r) => r.warnings.length > 0)
                          .map((result) => (
                            <TableRow key={result.row}>
                              <TableCell>{result.row}</TableCell>
                              <TableCell className="font-mono text-sm">{result.data.customer_id}</TableCell>
                              <TableCell className="font-mono text-sm">{result.data.discount_rule_id}</TableCell>
                              <TableCell>
                                <Badge>{result.data.tier}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-yellow-600">{result.warnings.join(", ")}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button onClick={processAssignments} disabled={isProcessing || validCount === 0} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing {Math.round(progress)}%...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Process {validCount} Valid Assignments
                    </>
                  )}
                </Button>
                {isProcessing && (
                  <div className="mt-4">
                    <Progress value={progress} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 4: Complete */}
      {currentStep === "complete" && (
        <>
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Processing Complete</AlertTitle>
            <AlertDescription>
              Successfully processed {processResults.filter((r) => r.success).length} of {processResults.length} tier
              assignments.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
              <CardDescription>Summary of all tier assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({processResults.length})</TabsTrigger>
                  <TabsTrigger value="success">Success ({processResults.filter((r) => r.success).length})</TabsTrigger>
                  <TabsTrigger value="failed">Failed ({processResults.filter((r) => !r.success).length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-sm">{result.customer_id}</TableCell>
                            <TableCell className="font-mono text-sm">{result.discount_rule_id}</TableCell>
                            <TableCell>
                              <Badge>{result.tier}</Badge>
                            </TableCell>
                            <TableCell>
                              {result.success ? (
                                <Badge className="bg-green-500">Success</Badge>
                              ) : (
                                <Badge variant="destructive">Failed</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{result.error || "Assigned successfully"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="success">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processResults
                          .filter((r) => r.success)
                          .map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{result.customer_id}</TableCell>
                              <TableCell className="font-mono text-sm">{result.discount_rule_id}</TableCell>
                              <TableCell>
                                <Badge>{result.tier}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="failed">
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processResults
                          .filter((r) => !r.success)
                          .map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{result.customer_id}</TableCell>
                              <TableCell className="font-mono text-sm">{result.discount_rule_id}</TableCell>
                              <TableCell>
                                <Badge>{result.tier}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-red-500">{result.error}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
