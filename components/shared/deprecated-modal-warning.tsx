/**
 * @deprecated This component uses the old Dialog/Sheet pattern.
 * Please migrate to UnifiedModal for consistent modal behavior.
 * See docs/MODAL_MIGRATION_GUIDE.md for migration instructions.
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function DeprecatedModalWarning({ componentName }: { componentName: string }) {
  if (process.env.NODE_ENV !== "development") return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Deprecated Modal Pattern</AlertTitle>
      <AlertDescription>
        {componentName} uses the old Dialog/Sheet pattern. Please migrate to UnifiedModal. See
        docs/MODAL_MIGRATION_GUIDE.md for instructions.
      </AlertDescription>
    </Alert>
  )
}
