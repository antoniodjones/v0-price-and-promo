"use client"

import type * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw]",
}

type ModalMode = "dialog" | "fullscreen" | "wizard"

interface WizardStep {
  id: number
  name: string
  description: string
  canProceed?: boolean
}

interface UnifiedModalProps {
  // Core props
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string

  // Mode and appearance
  mode?: ModalMode
  size?: ModalSize
  showCloseButton?: boolean

  // Loading state
  isLoading?: boolean
  loadingMessage?: string

  // Wizard mode props
  steps?: WizardStep[]
  currentStep?: number
  onStepChange?: (step: number) => void
  showProgress?: boolean

  // Content
  children: React.ReactNode

  // Footer actions
  showFooter?: boolean
  footerContent?: React.ReactNode
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  canProceed?: boolean
  isSubmitting?: boolean
  submitLabel?: string

  // Custom styling
  className?: string
  contentClassName?: string

  // Badge (for edit mode, etc.)
  badge?: {
    label: string
    icon?: React.ReactNode
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
}

export function UnifiedModal({
  isOpen,
  onClose,
  title,
  description,
  mode = "dialog",
  size = "lg",
  showCloseButton = true,
  isLoading = false,
  loadingMessage = "Loading...",
  steps,
  currentStep = 1,
  onStepChange,
  showProgress = true,
  children,
  showFooter = true,
  footerContent,
  onPrevious,
  onNext,
  onSubmit,
  canProceed = true,
  isSubmitting = false,
  submitLabel = "Submit",
  className,
  contentClassName,
  badge,
}: UnifiedModalProps) {
  const progress = steps ? (currentStep / steps.length) * 100 : 0
  const isWizardMode = mode === "wizard" && steps && steps.length > 0
  const isFullscreenMode = mode === "fullscreen"
  const isLastStep = isWizardMode && currentStep === steps.length

  if (isLoading) {
    if (isFullscreenMode) {
      return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">{loadingMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn(sizeClasses[size], className)}>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{loadingMessage}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isFullscreenMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={onClose} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {badge && (
              <Badge variant={badge.variant || "default"} className="gap-2 px-4 py-2">
                {badge.icon}
                {badge.label}
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            {/* Progress Header for Wizard */}
            {isWizardMode && showProgress && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Step {currentStep} of {steps.length}
                      </h2>
                      <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
                    </div>
                    <Badge variant="outline">{steps[currentStep - 1].name}</Badge>
                  </div>
                  <Progress value={progress} />
                </CardContent>
              </Card>
            )}

            {/* Step Indicators */}
            {isWizardMode && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => onStepChange?.(index + 1)}
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all cursor-pointer",
                          index + 1 < currentStep &&
                            "bg-primary border-primary text-primary-foreground hover:scale-110",
                          index + 1 === currentStep && "border-primary text-primary bg-primary/10 hover:bg-primary/20",
                          index + 1 > currentStep &&
                            "border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary hover:scale-105",
                        )}
                        title={`Go to ${step.name}`}
                      >
                        {index + 1 < currentStep ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </button>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "w-12 h-0.5",
                            index + 1 < currentStep ? "bg-primary" : "bg-muted-foreground/30",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <Card>
              <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
            </Card>

            {/* Footer */}
            {showFooter && (
              <Card>
                <CardContent className="p-4">
                  {footerContent || (
                    <div className="flex items-center justify-between w-full gap-4">
                      {onPrevious && (
                        <Button
                          variant="outline"
                          onClick={onPrevious}
                          disabled={isWizardMode && currentStep === 1}
                          className="shrink-0 min-w-[120px] bg-transparent"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                      )}

                      {isLastStep || !isWizardMode ? (
                        <Button
                          onClick={onSubmit}
                          disabled={!canProceed || isSubmitting}
                          className="shrink-0 min-w-[180px] ml-auto"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {isSubmitting ? "Submitting..." : submitLabel}
                        </Button>
                      ) : (
                        onNext && (
                          <Button onClick={onNext} disabled={!canProceed} className="shrink-0 min-w-[120px] ml-auto">
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(sizeClasses[size], "max-h-[90vh] overflow-y-auto", className)}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
              {isWizardMode && (
                <DialogDescription>
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
                </DialogDescription>
              )}
            </div>
            {badge && (
              <Badge variant={badge.variant || "default"} className="gap-2">
                {badge.icon}
                {badge.label}
              </Badge>
            )}
            {showCloseButton && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isWizardMode && showProgress && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
              </div>
              <Progress value={progress} className="h-2" />
            </>
          )}
        </DialogHeader>

        {/* Step Indicators for Wizard */}
        {isWizardMode && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => onStepChange?.(step.id)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors cursor-pointer",
                      index + 1 < currentStep && "bg-primary border-primary text-primary-foreground hover:opacity-80",
                      index + 1 === currentStep && "border-primary text-primary hover:border-primary/80",
                      index + 1 > currentStep &&
                        "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50",
                    )}
                  >
                    {index + 1 < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={cn("w-12 h-0.5", index + 1 < currentStep ? "bg-primary" : "bg-muted-foreground/30")}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={cn("py-6", contentClassName)}>{children}</div>

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-between pt-4 border-t">
            {footerContent || (
              <>
                {onPrevious && (
                  <Button variant="outline" onClick={onPrevious} disabled={isWizardMode && currentStep === 1}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                <div className="flex items-center space-x-2 ml-auto">
                  {isLastStep || !isWizardMode ? (
                    <Button onClick={onSubmit} disabled={!canProceed || isSubmitting}>
                      {isSubmitting ? "Submitting..." : submitLabel}
                    </Button>
                  ) : (
                    onNext && (
                      <Button onClick={onNext} disabled={!canProceed}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
