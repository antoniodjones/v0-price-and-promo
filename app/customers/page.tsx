"use client"

import { CustomerManagementDashboard } from "@/components/admin/customer-management-dashboard"
import { DocumentationLink } from "@/components/shared/documentation-link"

export default function CustomersPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage B2B wholesale cannabis customers</p>
        </div>
        <DocumentationLink pageId="customers" />
      </div>

      <CustomerManagementDashboard />
    </div>
  )
}
