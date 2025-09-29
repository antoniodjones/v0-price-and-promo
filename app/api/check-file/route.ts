import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    // Security: Only allow checking files within the project directory
    const allowedPaths = ["components/", "lib/", "app/", "hooks/", "utils/", "types/"]

    const isAllowedPath = allowedPaths.some((allowed) => filePath.startsWith(allowed))
    if (!isAllowedPath) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const fullPath = path.join(process.cwd(), filePath)

    try {
      await fs.access(fullPath)
      // File exists, now check if it has meaningful content (not just empty or placeholder)
      const content = await fs.readFile(fullPath, "utf-8")
      const hasContent = content.trim().length > 50 // Basic content check

      return NextResponse.json({
        exists: true,
        hasContent,
        path: filePath,
      })
    } catch {
      return NextResponse.json({
        exists: false,
        hasContent: false,
        path: filePath,
      })
    }
  } catch (error) {
    console.error("Error checking file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
