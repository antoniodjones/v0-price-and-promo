import type { SettingsData } from "./types"
import { defaultSettings } from "./defaults"

const STORAGE_KEY = "gti-business-settings"

export async function getSettings(): Promise<SettingsData> {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        return { ...defaultSettings, ...settings }
      }
    }
    return defaultSettings
  } catch (error) {
    console.error("Failed to load settings:", error)
    return defaultSettings
  }
}

export async function saveSettings(settings: SettingsData): Promise<boolean> {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      return true
    }
    return false
  } catch (error) {
    console.error("Failed to save settings:", error)
    return false
  }
}
