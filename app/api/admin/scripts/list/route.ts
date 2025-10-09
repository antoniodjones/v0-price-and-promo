import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const scriptsDir = path.join(process.cwd(), "scripts")
    const files = await fs.readdir(scriptsDir)

    // Filter for SQL files only
    const sqlFiles = files.filter((file) => file.endsWith(".sql"))

    // Parse and organize scripts
    const scripts = sqlFiles
      .map((file) => {
        // Extract number from filename if it exists
        const numberMatch = file.match(/^(\d+)/)
        const order = numberMatch ? Number.parseInt(numberMatch[1]) : 9999

        // Generate a readable name from filename
        const nameWithoutExt = file.replace(/\.sql$/, "")
        const name = nameWithoutExt
          .replace(/^(\d+)[-_]?/, "") // Remove leading number
          .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        return {
          name: name || file,
          description: `Execute ${file}`,
          file,
          order,
          status: "pending" as const,
        }
      })
      .sort((a, b) => {
        // Sort by order number, then alphabetically
        if (a.order !== b.order) {
          return a.order - b.order
        }
        return a.file.localeCompare(b.file)
      })

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error("[v0] Error listing scripts:", error)
    return NextResponse.json(
      { error: "Failed to list scripts", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
