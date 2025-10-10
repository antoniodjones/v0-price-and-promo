import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { readdirSync, statSync } from "fs"
import { join } from "path"

// Epic to directory mapping
const EPIC_DIRECTORIES: Record<string, string[]> = {
  "Inventory Discounts": ["app/pricing/inventory", "components/pricing/inventory"],
  "Volume Pricing": ["app/pricing/volume", "components/pricing/volume"],
  "Tiered Pricing": ["app/pricing/tiered", "components/pricing/tiered"],
  "Rebate Reports": ["app/reports/rebates", "components/reports/rebates"],
  "BOGO Promotions": ["app/promotions/bogo", "components/promotions/bogo"],
  "Analytics Dashboard": ["app/analytics", "components/analytics"],
  "Discount Analytics": ["app/analytics/discounts", "components/analytics/discounts"],
  "Pricing Simulator": ["app/simulator", "components/simulator"],
  "Audit Logging": ["app/admin/audit", "components/admin/audit"],
  "Bundle Deals": ["app/promotions/bundles", "components/promotions/bundles"],
  "User Management": ["app/admin/users", "components/admin/user"],
  "Business Administration": ["app/admin/business", "components/admin/business"],
  "Module Management": ["app/admin/modules", "components/admin/module"],
  "Revenue Optimization": ["app/revenue", "components/revenue"],
  "Compliance Center": ["app/compliance", "components/compliance"],
  "Customer Management": ["app/customers", "components/customers"],
  "Product Management": ["app/products", "components/products"],
  "Price Tracking": ["app/pricing/tracking", "components/pricing/tracking"],
  "Market Intelligence": ["app/market", "components/market"],
  "Performance Monitoring": ["app/monitoring", "components/monitoring"],
  "Predictive Analytics": ["app/analytics/predictive", "components/analytics/predictive"],
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  try {
    const files = readdirSync(dirPath)

    files.forEach((file) => {
      const filePath = join(dirPath, file)
      if (statSync(filePath).isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
      } else {
        arrayOfFiles.push(filePath)
      }
    })
  } catch (error) {
    // Directory doesn't exist, skip
  }

  return arrayOfFiles
}

function extractKeywords(title: string): string[] {
  const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "as"]
  return title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word))
}

export async function POST() {
  try {
    const supabase = await createClient()

    // Get all stories
    const { data: stories, error: storiesError } = await supabase
      .from("user_stories")
      .select("id, story_id, title, epic_name")
      .order("story_id")

    if (storiesError) throw storiesError

    let linkedCount = 0
    let skippedCount = 0

    for (const story of stories || []) {
      // Get directories for this epic
      const directories = EPIC_DIRECTORIES[story.epic_name] || []
      if (directories.length === 0) {
        skippedCount++
        continue
      }

      // Get all files in these directories
      let allFiles: string[] = []
      directories.forEach((dir) => {
        const fullPath = join(process.cwd(), dir)
        allFiles = allFiles.concat(getAllFiles(fullPath))
      })

      // Extract keywords from story title
      const keywords = extractKeywords(story.title)

      // Find matching files
      const matchingFiles = allFiles.filter((file) => {
        const fileName = file.toLowerCase()
        return keywords.some((keyword) => fileName.includes(keyword))
      })

      // Extract component names
      const components = matchingFiles
        .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
        .map((file) => {
          const parts = file.split("/")
          return parts[parts.length - 1].replace(/\.(tsx|ts)$/, "")
        })

      // Update story with code references
      if (matchingFiles.length > 0) {
        const { error: updateError } = await supabase
          .from("user_stories")
          .update({
            related_files: matchingFiles.map((f) => f.replace(process.cwd(), "")),
            related_components: components,
            files_modified: matchingFiles.length,
          })
          .eq("id", story.id)

        if (!updateError) {
          linkedCount++
        }
      } else {
        skippedCount++
      }
    }

    return NextResponse.json({
      success: true,
      linked: linkedCount,
      skipped: skippedCount,
      total: stories?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error linking stories to code:", error)
    return NextResponse.json({ success: false, error: "Failed to link stories" }, { status: 500 })
  }
}
