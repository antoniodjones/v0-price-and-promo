"use client"

import * as React from "react"
import type { UnifiedModal } from "@/components/shared/unified-modal"

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = React.useState(initialOpen)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}

export function useWizard(totalSteps: number, initialStep = 1) {
  const [currentStep, setCurrentStep] = React.useState(initialStep)

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }, [totalSteps])

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step)
      }
    },
    [totalSteps],
  )

  const reset = React.useCallback(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  const progress = (currentStep / totalSteps) * 100

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirstStep,
    isLastStep,
    progress,
    setCurrentStep,
  }
}

export function useFormModal<T extends Record<string, any>>(initialData: T) {
  const [formData, setFormData] = React.useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const updateFormData = React.useCallback((updates: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetFormData = React.useCallback(() => {
    setFormData(initialData)
  }, [initialData])

  return {
    formData,
    setFormData,
    updateFormData,
    resetFormData,
    isSubmitting,
    setIsSubmitting,
    isLoading,
    setIsLoading,
  }
}

export type { UnifiedModal }
