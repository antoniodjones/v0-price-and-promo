/**
 * Link User Stories to Implementation Code
 *
 * This script analyzes the codebase and automatically links user stories
 * to the files, components, and commits that implement them.
 */

import { neon } from "@neondatabase/serverless"
import { readdirSync, statSync } from "fs"
import { join } from "path"

const sql = neon(process.env.DATABASE_URL!)

// Map of epic names to their likely implementation directories
const EPIC_TO_DIRECTORIES: Record<string, string[]> = {
  "Inventory Discounts": ["app/(dashboard)/discounts", "app/api/discounts"],
  "Volume Pricing": ["app/(dashboard)/pricing/volume", "app/api/pricing/volume"],
  "Tiered Pricing": ["app/(dashboard)/pricing/tiered", "app/api/pricing/tiered"],
  "Rebate Reports": ["app/(dashboard)/reports/rebates", "app/api/reports"],
  "BOGO Promotions": ["app/(dashboard)/promotions/bogo", "app/api/promotions/bogo"],
  "Analytics Dashboard": ["app/(dashboard)/analytics", "app/api/analytics"],
  "Discount Analytics": ["app/(dashboard)/analytics/discounts"],
  "Pricing Simulator": ["app/(dashboard)/simulator", "app/api/simulator"],
  "Audit Logging": ["app/(dashboard)/audit", "app/api/audit"],
  "Bundle Deals": ["app/(dashboard)/bundles", "app/api/bundles"],
  "User Management": ["app/(dashboard)/admin/users", "app/api/admin/users"],
  "Business Administration": ["app/(dashboard)/admin/business"],
  "Module Management": ["app/(dashboard)/admin/modules"],
  "Revenue Optimization": ["app/(dashboard)/revenue", "app/api/revenue"],
  "Compliance Center": ["app/(dashboard)/compliance", "app/api/compliance"],
  "Customer Management": ["app/(dashboard)/customers", "app/api/customers"],
  "Product Management": ["app/(dashboard)/products", "app/api/products"],
  "Price Tracking": ["app/(dashboard)/price-tracking", "app/api/price-tracking"],
  "Market Intelligence": ["app/(dashboard)/market-intelligence"],
  "Performance Monitoring": ["app/(dashboard)/performance", "app/api/performance"],
  "Predictive Analytics": ["app/(dashboard)/predictive", "app/api/predictive"],
}

// Keywords to match story titles to file names
function extractKeywords(title: string): string[] {
  const keywords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)

  return keywords
}

// Find files matching story keywords
function findMatchingFiles(directories: string[], keywords: string[]): string[] {
  const matchingFiles: string[] = []

  for (const dir of directories) {
    try {
      const files = getAllFiles(dir)
      for (const file of files) {
        const fileName = file.toLowerCase()
        const matchCount = keywords.filter((kw) => fileName.includes(kw)).length

        if (matchCount >= 2 || (matchCount === 1 && keywords.length === 1)) {
          matchingFiles.push(file)
        }
      }
    } catch (error) {
      // Directory doesn't exist, skip
      continue
    }
  }

  return matchingFiles
}

// Recursively get all files in a directory
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

    return arrayOfFiles
  } catch (error) {
    return arrayOfFiles
  }
}

// Extract component names from file paths
function extractComponents(files: string[]): string[] {
  const components = new Set<string>()

  for (const file of files) {
    if (file.includes("/components/")) {
      const match = file.match(/\/components\/(.+)\.(tsx?|jsx?)$/)
      if (match) {
        components.add(match[1])
      }
    }
  }

  return Array.from(components)
}

async function linkStoriesToCode() {
  console.log("[v0] Starting story-to-code linking process...")

  // Get all stories that need code links
  const stories = await sql`
    SELECT id, title, epic, status
    FROM user_stories
    WHERE 
      (related_files IS NULL OR array_length(related_files, 1) = 0)
      AND status != 'To Do'
    ORDER BY epic, id
  `

  console.log(`[v0] Found ${stories.length} stories needing code links`)

  let linkedCount = 0

  for (const story of stories) {
    const keywords = extractKeywords(story.title)
    const directories = EPIC_TO_DIRECTORIES[story.epic] || []

    if (directories.length === 0) {
      console.log(`[v0] No directories mapped for epic: ${story.epic}`)
      continue
    }

    const matchingFiles = findMatchingFiles(directories, keywords)
    const components = extractComponents(matchingFiles)

    if (matchingFiles.length > 0) {
      await sql`
        UPDATE user_stories
        SET 
          related_files = ${matchingFiles},
          related_components = ${components},
          files_modified = ${matchingFiles.length},
          updated_at = NOW()
        WHERE id = ${story.id}
      `

      linkedCount++
      console.log(`[v0] Linked story ${story.id}: ${matchingFiles.length} files, ${components.length} components`)
    }
  }

  console.log(`[v0] Successfully linked ${linkedCount} stories to their implementation code`)

  // Show summary
  const summary = await sql`
    SELECT 
      epic,
      COUNT(*) as total_stories,
      SUM(CASE WHEN related_files IS NOT NULL AND array_length(related_files, 1) > 0 THEN 1 ELSE 0 END) as linked_stories,
      SUM(CASE WHEN related_files IS NULL OR array_length(related_files, 1) = 0 THEN 1 ELSE 0 END) as unlinked_stories
    FROM user_stories
    GROUP BY epic
    ORDER BY epic
  `

  console.log("[v0] Summary by Epic:")
  console.table(summary)
}

linkStoriesToCode().catch(console.error)
