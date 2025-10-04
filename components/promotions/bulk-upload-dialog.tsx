"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UploadResult {
  success: boolean
  message: string
  results?: {
    successful: number
    failed: number
    errors: Array<{
      row: number
      error: string
      data?: any
    }>
  }
}

export function BulkUploadDialog() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setResult(null)
    } else {
      alert("Please select a valid CSV file")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/promotions/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (data.success && data.results.failed === 0) {
        // Reset after successful upload with no errors
        setTimeout(() => {
          setFile(null)
          setOpen(false)
          setResult(null)
          // Refresh the page to show new promotions
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload file",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `name,type,triggerLevel,triggerValue,rewardType,rewardValue,startDate,endDate,status
Summer BOGO,traditional,item,product-123,free,0,2024-06-01T00:00:00Z,2024-08-31T23:59:59Z,active
Brand Discount,percentage,brand,Nike,percentage,50,2024-07-01T00:00:00Z,2024-07-31T23:59:59Z,active
Category Sale,fixed,category,Electronics,fixed,10,2024-08-01T00:00:00Z,2024-08-15T23:59:59Z,scheduled`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "promotion_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Promotions</DialogTitle>
          <DialogDescription>
            Upload multiple promotions at once using a CSV file. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">CSV Template</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download the template to see the required format and field descriptions.
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Requirements */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Required Fields</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">name:</span> Promotion name
                  </div>
                  <div>
                    <span className="font-medium">type:</span> traditional, percentage, or fixed
                  </div>
                  <div>
                    <span className="font-medium">triggerLevel:</span> item, brand, or category
                  </div>
                  <div>
                    <span className="font-medium">triggerValue:</span> ID or name to trigger on
                  </div>
                  <div>
                    <span className="font-medium">rewardType:</span> free, percentage, or fixed
                  </div>
                  <div>
                    <span className="font-medium">rewardValue:</span> Discount amount (0-100 for %)
                  </div>
                  <div>
                    <span className="font-medium">startDate:</span> ISO format (YYYY-MM-DDTHH:mm:ssZ)
                  </div>
                  <div>
                    <span className="font-medium">endDate:</span> ISO format (YYYY-MM-DDTHH:mm:ssZ)
                  </div>
                  <div>
                    <span className="font-medium">status:</span> active, inactive, or scheduled
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {file ? file.name : "Click to select CSV file"}
                    </span>
                  </label>
                </div>

                {file && (
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="outline">{(file.size / 1024).toFixed(2)} KB</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFile(null)
                        setResult(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Promotions
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {result.success ? (
                    <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        {result.message}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{result.message}</AlertDescription>
                    </Alert>
                  )}

                  {result.results && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{result.results.successful}</div>
                          <div className="text-sm text-muted-foreground">Successful</div>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{result.results.failed}</div>
                          <div className="text-sm text-muted-foreground">Failed</div>
                        </div>
                      </div>

                      {result.results.errors.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Errors
                          </h4>
                          <div className="max-h-48 overflow-y-auto space-y-2">
                            {result.results.errors.map((error, index) => (
                              <div key={index} className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-sm">
                                <div className="font-medium text-red-800 dark:text-red-200">Row {error.row}</div>
                                <div className="text-red-600 dark:text-red-400">{error.error}</div>
                                {error.data && (
                                  <div className="mt-1 text-xs text-muted-foreground">{JSON.stringify(error.data)}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
