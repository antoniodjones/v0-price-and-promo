import type { Metadata } from "next"
import type React from "react"
import "./globals.css"
import { ErrorContextProvider } from "@/components/error-prevention/error-context-provider"
import { PageErrorBoundary } from "@/components/error/enhanced-error-boundary"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { AppProvider } from "@/lib/context/app-context"
import { AuthProvider } from "@/lib/context/auth-context"
import { AppLayout } from "@/components/organisms/app-layout"
import { Header } from "@/components/organisms/header"
import { Sidebar } from "@/components/organisms/sidebar"

export const metadata: Metadata = {
  title: "Promotions Engine",
  description: "Pricing and Promotion Management System",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PageErrorBoundary>
          <ErrorContextProvider>
            <ThemeProvider>
              <AuthProvider>
                <AppProvider>
                  <AppLayout header={<Header />} sidebar={<Sidebar />}>
                    {children}
                  </AppLayout>
                </AppProvider>
              </AuthProvider>
            </ThemeProvider>
          </ErrorContextProvider>
        </PageErrorBoundary>
      </body>
    </html>
  )
}
