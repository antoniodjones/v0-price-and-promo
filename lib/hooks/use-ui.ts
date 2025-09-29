"use client"

import { useCallback } from "react"
import { useAppContext } from "../context/app-context"

export function useUI() {
  const { state, dispatch } = useAppContext()

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }, [dispatch])

  const setSidebarOpen = useCallback(
    (open: boolean) => {
      dispatch({ type: "SET_SIDEBAR_OPEN", payload: open })
    },
    [dispatch],
  )

  const setCurrentPage = useCallback(
    (page: string) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: page })
    },
    [dispatch],
  )

  return {
    sidebarOpen: state.sidebarOpen,
    currentPage: state.currentPage,
    toggleSidebar,
    setSidebarOpen,
    setCurrentPage,
  }
}
