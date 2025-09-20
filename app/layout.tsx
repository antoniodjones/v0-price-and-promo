import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { ThemeProvider } from "@/components/theme/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Pricing & Promotions",
  description: "Enterprise-level pricing and promotions management for GTI wholesale operations",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="gti-ui-theme">
          <Suspense fallback={<div>Loading...</div>}>
            <AppLayout>{children}</AppLayout>
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
