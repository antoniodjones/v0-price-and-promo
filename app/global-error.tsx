"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our error reporting service
    console.error("[v0] Global error caught:", error)

    // Report to external service if available
    if (typeof window !== "undefined") {
      // Send error to reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: "global-error",
      }

      console.error("[v0] Global error report:", errorReport)
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                Application Error
              </CardTitle>
              <CardDescription>
                A critical error occurred that prevented the application from loading properly.
                {error.digest && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Error ID: <code className="bg-muted px-1 py-0.5 rounded">{error.digest}</code>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && (
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">Development Details:</h4>
                  <pre className="text-xs text-red-600 whitespace-pre-wrap">{error.message}</pre>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium">Stack Trace</summary>
                      <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap max-h-40 overflow-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={reset} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => (window.location.href = "/")} variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
