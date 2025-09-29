import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ErrorBoundary } from "@/components/error-boundary"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
