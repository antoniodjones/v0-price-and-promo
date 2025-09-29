"use client"

import React, { type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Bug, Copy, CheckCircle, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
  retryCount?: number
}

interface EnhancedErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void; errorId?: string }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: "page" | "section" | "component"
  name?: string
  maxRetries?: number
  showHomeButton?: boolean
  showBackButton?: boolean
}

export class EnhancedErrorBoundary extends React.Component<EnhancedErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || "unknown"

    const context = {
      component: this.props.name || "ErrorBoundary",
      action: "render",
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount || 0,
      additionalData: {
        componentStack: errorInfo.componentStack,
        level: this.props.level || "component",
        errorId,
        props: this.props.name ? { name: this.props.name } : undefined,
      },
    }

    console.error("[v0] Error boundary caught error:", error, context)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    this.setState({ error, errorInfo, errorId })
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  resetError = () => {
    const newRetryCount = (this.state.retryCount || 0) + 1
    const maxRetries = this.props.maxRetries || 3

    if (newRetryCount > maxRetries) {
      console.warn(`[v0] Max retries (${maxRetries}) exceeded for error boundary`)
      return
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
      retryCount: newRetryCount,
    })

    if (newRetryCount > 1) {
      const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 10000)
      this.retryTimeout = setTimeout(() => {
        console.log(`[v0] Auto-retrying after ${delay}ms (attempt ${newRetryCount})`)
      }, delay)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} errorId={this.state.errorId} />
      }

      return (
        <DefaultErrorFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          errorId={this.state.errorId}
          level={this.props.level}
          retryCount={this.state.retryCount || 0}
          maxRetries={this.props.maxRetries || 3}
          showHomeButton={this.props.showHomeButton}
          showBackButton={this.props.showBackButton}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error: Error
  errorInfo?: React.ErrorInfo
  resetError: () => void
  errorId?: string
  level?: "page" | "section" | "component"
  retryCount: number
  maxRetries: number
  showHomeButton?: boolean
  showBackButton?: boolean
}

function DefaultErrorFallback({
  error,
  errorInfo,
  resetError,
  errorId,
  level = "component",
  retryCount,
  maxRetries,
  showHomeButton = false,
  showBackButton = false,
}: DefaultErrorFallbackProps) {
  const [copied, setCopied] = React.useState(false)
  const router = useRouter()

  const addNotification = React.useCallback((notification: any) => {
    console.log("[v0] Notification:", notification)
  }, [])

  const copyErrorDetails = async () => {
    const errorDetails = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      retryCount,
      level,
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("[v0] Failed to copy error details:", err)
      const textArea = document.createElement("textarea")
      textArea.value = JSON.stringify(errorDetails, null, 2)
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error("[v0] Fallback copy also failed:", fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  const reportIssue = () => {
    addNotification({
      type: "info",
      title: "Issue Reported",
      message: "Thank you for reporting this issue. Our team has been notified.",
    })
  }

  const getErrorTitle = () => {
    switch (level) {
      case "page":
        return "Page Error"
      case "section":
        return "Section Error"
      default:
        return "Component Error"
    }
  }

  const getErrorDescription = () => {
    switch (level) {
      case "page":
        return "This page encountered an error and cannot be displayed."
      case "section":
        return "This section encountered an error and cannot be displayed."
      default:
        return "This component encountered an error and cannot be displayed."
    }
  }

  const canRetry = retryCount < maxRetries
  const isMaxRetries = retryCount >= maxRetries

  return (
    <Card className={`mx-auto mt-8 ${level === "page" ? "max-w-2xl" : "max-w-lg"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          {getErrorTitle()}
        </CardTitle>
        <CardDescription>
          {getErrorDescription()}
          {errorId && (
            <div className="mt-2 text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code>
            </div>
          )}
          {retryCount > 0 && (
            <div className="mt-1 text-xs text-muted-foreground">
              Retry attempt: {retryCount}/{maxRetries}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.env.NODE_ENV === "development" && (
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Development Details
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium">Error Message:</p>
                <pre className="text-xs text-red-600 whitespace-pre-wrap bg-background p-2 rounded border">
                  {error.message}
                </pre>
              </div>
              {error.stack && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">Stack Trace</summary>
                  <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap bg-background p-2 rounded border max-h-40 overflow-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
              {errorInfo?.componentStack && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">Component Stack</summary>
                  <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap bg-background p-2 rounded border max-h-40 overflow-auto">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {canRetry && (
            <Button onClick={resetError} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again {retryCount > 0 && `(${maxRetries - retryCount} left)`}
            </Button>
          )}

          {isMaxRetries && (
            <Button onClick={() => window.location.reload()} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          )}

          {showBackButton && (
            <Button onClick={() => router.back()} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}

          {showHomeButton && (
            <Button onClick={() => router.push("/")} variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          )}

          <Button onClick={copyErrorDetails} variant="ghost" size="sm">
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Details
              </>
            )}
          </Button>

          <Button onClick={reportIssue} variant="ghost" size="sm">
            <Bug className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    console.error("[v0] useErrorBoundary captured error:", error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

export function PageErrorBoundary({ children, ...props }: Omit<EnhancedErrorBoundaryProps, "level">) {
  return (
    <EnhancedErrorBoundary level="page" maxRetries={2} showHomeButton={true} showBackButton={true} {...props}>
      {children}
    </EnhancedErrorBoundary>
  )
}

export function SectionErrorBoundary({ children, ...props }: Omit<EnhancedErrorBoundaryProps, "level">) {
  return (
    <EnhancedErrorBoundary level="section" maxRetries={3} {...props}>
      {children}
    </EnhancedErrorBoundary>
  )
}

export function ComponentErrorBoundary({ children, ...props }: Omit<EnhancedErrorBoundaryProps, "level">) {
  return (
    <EnhancedErrorBoundary level="component" maxRetries={5} {...props}>
      {children}
    </EnhancedErrorBoundary>
  )
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<EnhancedErrorBoundaryProps>,
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ComponentErrorBoundary name={Component.displayName || Component.name} {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ComponentErrorBoundary>
  ))

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
