"use client"

import { useState, useEffect } from "react"
import type { SettingsData } from "./types"
import { defaultSettings } from "./defaults"
import { getSettings, saveSettings } from "./storage"
import { validateSettings } from "./validation"

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await getSettings()
        setSettings(loadedSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSetting = async (path: string, value: any) => {
    try {
      const keys = path.split(".")
      const newSettings = { ...settings }
      let current: any = newSettings

      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      // Set the value
      current[keys[keys.length - 1]] = value

      // Validate the settings
      const errors = validateSettings(newSettings)
      if (errors.length > 0) {
        console.warn("Settings validation warnings:", errors)
      }

      // Save and update state
      await saveSettings(newSettings)
      setSettings(newSettings)
    } catch (error) {
      console.error("Failed to update setting:", error)
    }
  }

  return {
    settings,
    loading,
    updateSetting,
  }
}
