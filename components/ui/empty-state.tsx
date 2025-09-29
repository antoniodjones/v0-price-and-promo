"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Database, FileX, Users, Package } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  className?: string
}

export function EmptyState({ icon: Icon = FileX, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent className="text-center">
          <Button onClick={action.onClick} variant={action.variant || "default"}>
            <Plus className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

// Specialized empty states for common scenarios
export function EmptyProducts({ onAddProduct }: { onAddProduct?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No products found"
      description="Get started by adding your first product to the catalog."
      action={
        onAddProduct
          ? {
              label: "Add Product",
              onClick: onAddProduct,
            }
          : undefined
      }
    />
  )
}

export function EmptyCustomers({ onAddCustomer }: { onAddCustomer?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No customers found"
      description="Start building your customer base by adding your first customer."
      action={
        onAddCustomer
          ? {
              label: "Add Customer",
              onClick: onAddCustomer,
            }
          : undefined
      }
    />
  )
}

export function EmptySearchResults({ onClearSearch }: { onClearSearch?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search criteria or browse all items."
      action={
        onClearSearch
          ? {
              label: "Clear Search",
              onClick: onClearSearch,
              variant: "outline",
            }
          : undefined
      }
    />
  )
}

export function EmptyDatabase() {
  return (
    <EmptyState
      icon={Database}
      title="No data available"
      description="The database appears to be empty or there was an issue loading the data."
    />
  )
}
