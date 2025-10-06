"use client"

import { useState, useCallback } from "react"

export interface CardState {
  isLoading: boolean
  error: string | null
}

export function useCardState(initialLoading = false) {
  const [state, setState] = useState<CardState>({
    isLoading: initialLoading,
    error: null,
  })

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }))
  }, [])

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null })
  }, [])

  return {
    ...state,
    setLoading,
    setError,
    reset,
  }
}
