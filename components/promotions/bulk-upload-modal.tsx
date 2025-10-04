"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, FileText, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface UploadResult {
  success: number
  failed: number
  errors: Array<{ row: number; error: string; data: any }>
}

export function BulkUploadModal({ isOpen, onClose, onSuccess }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState<UploadResult | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      setResult(null)
    }
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim())
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const row: any = { _rowNumber: i + 1 }

      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })

      rows.push(row)
    }

    return rows
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Read file
      const text = await file.text()
      const promotions = parseCSV(text)

      if (promotions.length === 0) {
        toast({
          title: "Empty File",
          description: "The CSV file contains no data",
          variant: "destructive",
        })
        setUploading(false)
        return
      }

      // Simulate progress
      setUploadProgress(30)

      // Send to API
      const response = await fetch("/api/promotions/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotions }),
      })

      setUploadProgress(70)

      const data = await response.json()

      setUploadProgress(100)

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed")
      }

      setResult(data.data)

      toast({
        title: "Upload Complete",
        description: `Successfully created ${data.data.success} promotions. ${data.data.failed} failed.`,
      })

      if (data.data.success > 0 && onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("[v0] Error uploading CSV:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload promotions",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `name,type,triggerLevel,triggerValue,rewardType,rewardValue,startDate,endDate,status
Premium Gummies BOGO,traditional,item,Premium Gummies - 10mg,free,1,2025-12-01,2025-12-31,active
Brand BOGO Example,traditional,brand,Incredibles,percentage,50,2025-12-01,2025-12-31,active
Category BOGO Example,traditional,category,Edibles,fixed,10,2025-12-01,2025-12-31,active`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "promotion-bulk-upload-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: "Use this template to format your promotion data",
    })
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    setUploadProgress(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Upload Promotions
          </DialogTitle>
          <DialogDescription>Upload multiple promotions at once using a CSV file</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">CSV Format Requirements:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>
                    <strong>name</strong>: Promotion name (required)
                  </li>
                  <li>
                    <strong>type</strong>: traditional, percentage, or fixed (required)
                  </li>
                  <li>
                    <strong>triggerLevel</strong>: item, brand, or category (required)
                  </li>
                  <li>
                    <strong>triggerValue</strong>: Product name, brand, or category (required)
                  </li>
                  <li>
                    <strong>rewardType</strong>: free, percentage, or fixed (required)
                  </li>
                  <li>
                    <strong>rewardValue</strong>: Number (1 for free, percentage value, or dollar amount) (required)
                  </li>
                  <li>
                    <strong>startDate</strong>: YYYY-MM-DD format (required)
                  </li>
                  <li>
                    <strong>endDate</strong>: YYYY-MM-DD format (required)
                  </li>
                  <li>
                    <strong>status</strong>: active or inactive (optional, defaults to active)
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Download Template */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Download CSV Template</p>
                <p className="text-sm text-muted-foreground">Get started with our pre-formatted template</p>
              </div>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
                disabled={uploading}
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{file ? file.name : "Click to upload or drag and drop"}</p>
                <p className="text-sm text-muted-foreground">CSV files only</p>
              </label>
            </div>

            {file && !result && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>{file.name}</strong> ready to upload ({(file.size / 1024).toFixed(2)} KB)
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading promotions...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <p className="font-medium text-green-900">Successful</p>
                    <p className="text-2xl font-bold text-green-600">{result.success}</p>
                  </AlertDescription>
                </Alert>

                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <p className="font-medium text-red-900">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                  </AlertDescription>
                </Alert>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="font-medium">Errors Found</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {result.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>
                          <p className="font-medium">Row {error.row}</p>
                          <p className="text-sm">{error.error}</p>
                          {error.data.name && <p className="text-xs mt-1">Name: {error.data.name}</p>}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              {result ? "Close" : "Cancel"}
            </Button>
            {!result && (
              <Button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? "Uploading..." : "Upload Promotions"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
