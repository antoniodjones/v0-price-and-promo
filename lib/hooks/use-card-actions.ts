"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

export interface CardAction {
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "ghost"
  disabled?: boolean
}

export function useCardActions() {
  const router = useRouter()

  const navigateTo = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router],
  )

  const createAction = useCallback(
    (label: string, onClick: () => void, variant: CardAction["variant"] = "default"): CardAction => {
      return { label, onClick, variant }
    },
    [],
  )

  const createNavigationAction = useCallback(
    (label: string, href: string, variant: CardAction["variant"] = "default"): CardAction => {
      return {
        label,
        onClick: () => navigateTo(href),
        variant,
      }
    },
    [navigateTo],
  )

  return {
    navigateTo,
    createAction,
    createNavigationAction,
  }
}
