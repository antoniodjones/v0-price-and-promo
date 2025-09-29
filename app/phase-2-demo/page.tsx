"use client"

import React from "react"
import {
  AppLayout,
  AppLayoutErrorBoundary,
  Header,
  HeaderErrorBoundary,
  Sidebar,
  SidebarErrorBoundary,
  BreadcrumbSystem,
  BreadcrumbErrorBoundary,
  RouteGuard,
  RouteGuardErrorBoundary,
} from "@/components/organisms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Layout, Navigation, Shield, Layers } from "lucide-react"

export default function Phase2DemoPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const breadcrumbItems = [
    { label: "Demo", href: "/demo" },
    { label: "Phase 2", href: "/phase-2-demo", isActive: true },
  ]

  const features = [
    {
      icon: Layout,
      title: "AppLayout Organism",
      description: "Responsive CSS Grid layout with error boundaries",
      status: "Complete",
      details: [
        "Mobile-first responsive design",
        "CSS Grid for complex layouts",
        "Error boundary protection",
        "Suspense fallback handling",
      ],
    },
    {
      icon: Navigation,
      title: "Header Component",
      description: "Adaptive header with search and user actions",
      status: "Complete",
      details: ["Mobile menu integration", "Search functionality", "Notification system", "User menu placeholder"],
    },
    {
      icon: Layers,
      title: "Sidebar Navigation",
      description: "Collapsible navigation with module awareness",
      status: "Complete",
      details: [
        "Hierarchical navigation",
        "Module-based menu items",
        "Mobile overlay support",
        "Expandable menu sections",
      ],
    },
    {
      icon: Shield,
      title: "Navigation System",
      description: "Route guards and breadcrumb navigation",
      status: "Complete",
      details: ["Breadcrumb generation", "Route protection system", "Module-aware routing", "Access control ready"],
    },
  ]

  return (
    <AppLayoutErrorBoundary>
      <AppLayout
        header={
          <HeaderErrorBoundary>
            <Header title="Phase 2 Demo" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          </HeaderErrorBoundary>
        }
        sidebar={
          <SidebarErrorBoundary>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </SidebarErrorBoundary>
        }
      >
        <RouteGuardErrorBoundary>
          <RouteGuard>
            <div className="space-y-6">
              {/* Breadcrumb Demo */}
              <div className="space-y-4">
                <BreadcrumbErrorBoundary>
                  <BreadcrumbSystem items={breadcrumbItems} />
                </BreadcrumbErrorBoundary>

                <div>
                  <h1 className="text-3xl font-bold text-foreground">Phase 2: Layout & Navigation</h1>
                  <p className="text-muted-foreground mt-2">
                    Demonstrating the Organisms layer with layout components, navigation system, and error boundaries.
                  </p>
                </div>
              </div>

              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Phase 2 Implementation Status
                  </CardTitle>
                  <CardDescription>
                    All Phase 2 components have been successfully implemented with comprehensive error handling.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      AppLayout Complete
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Header Complete
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Sidebar Complete
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Navigation Complete
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Error Boundaries Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <Card key={feature.title}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <feature.icon className="h-5 w-5 text-primary" />
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {feature.status}
                          </Badge>
                        </div>

                        <div>
                          <span className="text-sm font-medium mb-2 block">Features:</span>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {feature.details.map((detail, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Architecture Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Architecture Implementation</CardTitle>
                  <CardDescription>Phase 2 follows Clean Architecture and Atomic Design principles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Error Boundaries</h4>
                      <p className="text-sm text-muted-foreground">
                        Every organism has its own error boundary to prevent cascading failures.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Responsive Design</h4>
                      <p className="text-sm text-muted-foreground">
                        Mobile-first approach with CSS Grid and Flexbox for optimal layouts.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Module Awareness</h4>
                      <p className="text-sm text-muted-foreground">
                        Navigation system is prepared for module-based feature toggling.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next: Phase 3 - Authentication Domain</CardTitle>
                  <CardDescription>Ready to proceed with authentication system integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Phase 2 provides the foundation for Phase 3 authentication integration:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Route guards are ready for auth context</li>
                      <li>• Header user menu prepared for auth state</li>
                      <li>• Navigation system supports role-based access</li>
                      <li>• Error boundaries will handle auth failures gracefully</li>
                    </ul>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full md:w-auto bg-transparent">
                        Proceed to Phase 3
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </RouteGuard>
        </RouteGuardErrorBoundary>
      </AppLayout>
    </AppLayoutErrorBoundary>
  )
}
