"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  className?: string
}

export function AppLayout({ children, header, sidebar, className }: AppLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        "grid grid-rows-[auto_1fr] grid-cols-1",
        "lg:grid-cols-[280px_1fr]",
        className,
      )}
    >
      {/* Header - spans full width on mobile, right column on desktop */}
      {header && (
        <header className="lg:col-span-2 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="container mx-auto px-4 py-3">{header}</div>
        </header>
      )}

      {/* Sidebar - hidden on mobile, fixed width on desktop */}
      {sidebar && (
        <aside className="hidden lg:block border-r bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <div className="p-4">{sidebar}</div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            {children}
          </React.Suspense>
        </div>
      </main>
    </div>
  )
}

// Error Boundary for AppLayout
interface AppLayoutErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class AppLayoutErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppLayoutErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AppLayoutErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] AppLayout Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-destructive mb-4">Layout Error</h2>
            <p className="text-muted-foreground mb-4">Something went wrong with the application layout.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
