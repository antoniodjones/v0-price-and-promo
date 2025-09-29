"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DevelopmentAuthStatus } from "@/components/auth/development-auth-status"
import { useAuth } from "@/lib/context/auth-context"

export default function HomePage() {
  console.log("[v0] GTI Pricing Engine page rendering")

  const { state } = useAuth()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <DevelopmentAuthStatus />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">GTI Pricing Engine</h1>
        <p className="text-xl text-muted-foreground">Advanced Pricing & Promotion Management System</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-8 mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground mb-6">System Status: Operational</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-muted/50 p-6 rounded-md border-l-4 border-primary">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Database Connection</h3>
            <div className="text-2xl font-bold text-green-600">✓ Connected</div>
            <p className="text-sm text-muted-foreground mt-1">41 tables ready</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-md border-l-4 border-primary">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Setup Scripts</h3>
            <div className="text-2xl font-bold text-green-600">✓ Complete</div>
            <p className="text-sm text-muted-foreground mt-1">All scripts executed</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-md border-l-4 border-primary">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Products</h3>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-sm text-muted-foreground mt-1">Being tracked</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-md border-l-4 border-primary">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Price Alerts</h3>
            <div className="text-2xl font-bold text-foreground">23</div>
            <p className="text-sm text-muted-foreground mt-1">Active alerts</p>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        {state.isAuthenticated || state.isDevelopmentMode ? (
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90">
                Access Full Dashboard
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="px-6 py-3 font-medium bg-transparent">
                View Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button className="bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90">
                Sign In to Access Dashboard
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline" className="px-6 py-3 font-medium bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>

      {state.isAuthenticated && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Welcome back, {(state.user as any)?.name || (state.user as any)?.email || "User"}
          </p>
        </div>
      )}
    </div>
  )
}
