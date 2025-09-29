// Module Guard Component - Conditionally renders components based on module status
"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useModuleRegistry } from "@/lib/modules/module-registry"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"

interface ModuleGuardProps {
  moduleId: string
  children: ReactNode
  fallback?: ReactNode
  showError?: boolean
}

export function ModuleGuard({ moduleId, children, fallback = null, showError = true }: ModuleGuardProps) {
  const { isModuleEnabled, isModuleLoaded, getModule } = useModuleRegistry()

  const module = getModule(moduleId)

  if (!module) {
    if (showError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Module "{moduleId}" not found in registry</AlertDescription>
        </Alert>
      )
    }
    return <>{fallback}</>
  }

  if (!isModuleEnabled(moduleId)) {
    if (showError) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Module "{module.name}" is currently disabled</AlertDescription>
        </Alert>
      )
    }
    return <>{fallback}</>
  }

  if (module.status === "loading" || !isModuleLoaded(moduleId)) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading {module.name}...</span>
      </div>
    )
  }

  if (module.status === "error") {
    if (showError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading "{module.name}": {module.errorMessage}
          </AlertDescription>
        </Alert>
      )
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Higher-order component version
export function withModuleGuard<P extends object>(
  Component: React.ComponentType<P>,
  moduleId: string,
  fallback?: ReactNode,
) {
  return function ModuleGuardedComponent(props: P) {
    return (
      <ModuleGuard moduleId={moduleId} fallback={fallback}>
        <Component {...props} />
      </ModuleGuard>
    )
  }
}
