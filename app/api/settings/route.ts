import { type NextRequest, NextResponse } from "next/server"
import { getSettings, saveSettings, validateSettings, type SettingsData } from "@/lib/settings"

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings: SettingsData = await request.json()

    // Validate settings
    const errors = validateSettings(settings)
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    // Save settings
    const success = await saveSettings(settings)
    if (!success) {
      return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
