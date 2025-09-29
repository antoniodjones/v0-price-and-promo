"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Wifi, Database, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  errorId?: string
}

export function NetworkErrorFallback({ error, resetError, errorId }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <Wifi className="h-5 w-5" />
          Connection Error
        </CardTitle>
        <CardDescription>
          Unable to connect to the server. Please check your internet connection.
          {errorId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>This usually happens when:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Your internet connection is unstable</li>
            <li>The server is temporarily unavailable</li>
            <li>There's a network configuration issue</li>
          </ul>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetError} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function DatabaseErrorFallback({ error, resetError, errorId }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Database className="h-5 w-5" />
          Database Error
        </CardTitle>
        <CardDescription>
          Unable to access the database. This is a temporary issue.
          {errorId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Our team has been automatically notified. Please try again in a few moments.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetError} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function AuthErrorFallback({ error, resetError, errorId }: ErrorFallbackProps) {
  const router = useRouter()

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600">
          <Shield className="h-5 w-5" />
          Authentication Error
        </CardTitle>
        <CardDescription>
          Your session has expired or there's an authentication issue.
          {errorId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Please sign in again to continue using the application.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/auth/login")} size="sm">
            Sign In
          </Button>
          <Button onClick={resetError} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ValidationErrorFallback({ error, resetError, errorId }: ErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <AlertTriangle className="h-5 w-5" />
          Validation Error
        </CardTitle>
        <CardDescription>
          There's an issue with the data provided. Please check your input.
          {errorId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Error details: {error.message}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetError} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function getErrorFallback(error: Error): React.ComponentType<ErrorFallbackProps> {
  const errorMessage = error.message.toLowerCase()

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return NetworkErrorFallback
  }

  if (errorMessage.includes("database") || errorMessage.includes("prisma")) {
    return DatabaseErrorFallback
  }

  if (errorMessage.includes("auth") || errorMessage.includes("unauthorized")) {
    return AuthErrorFallback
  }

  if (errorMessage.includes("validation") || errorMessage.includes("invalid")) {
    return ValidationErrorFallback
  }

  // Default fallback
  return ({ error, resetError, errorId }: ErrorFallbackProps) => (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Unexpected Error
        </CardTitle>
        <CardDescription>
          Something went wrong. Please try again.
          {errorId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={resetError} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}
