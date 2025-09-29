"use client"

import { useCallback } from "react"
import { useAppContext } from "../context/app-context"

export function useNotifications() {
  const { state, dispatch } = useAppContext()

  const addNotification = useCallback(
    (notification: { type: "success" | "error" | "warning" | "info"; title: string; message: string }) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification })
    },
    [dispatch],
  )

  const markAsRead = useCallback(
    (notificationId: string) => {
      dispatch({ type: "MARK_NOTIFICATION_READ", payload: notificationId })
    },
    [dispatch],
  )

  const removeNotification = useCallback(
    (notificationId: string) => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: notificationId })
    },
    [dispatch],
  )

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" })
  }, [dispatch])

  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter((n) => !n.read).length,
    addNotification,
    markAsRead,
    removeNotification,
    clearAllNotifications,
  }
}
