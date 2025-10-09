import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const docPath = searchParams.get("path")

    if (!docPath) {
      return NextResponse.json({ error: "Documentation path is required" }, { status: 400 })
    }

    // Security: Only allow docs from the docs directory
    if (!docPath.startsWith("/docs/") && !docPath.startsWith("docs/")) {
      return NextResponse.json({ error: "Invalid documentation path" }, { status: 400 })
    }

    // Read the markdown file
    const filePath = join(process.cwd(), docPath.replace(/^\//, ""))
    const content = await readFile(filePath, "utf-8")

    return NextResponse.json({ content })
  } catch (error) {
    console.error("[v0] Documentation API error:", error)
    return NextResponse.json({ error: "Failed to load documentation" }, { status: 500 })
  }
}
