import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError } from "@/lib/api/utils"
import { createClient } from "@/lib/supabase/server"

interface PromotionRow {
  _rowNumber: number
  name: string
  type: string
  triggerLevel: string
  triggerValue: string
  rewardType: string
  rewardValue: string
  startDate: string
  endDate: string
  status?: string
}

interface ValidationError {
  row: number
  error: string
  data: any
}

function validatePromotion(row: PromotionRow): string | null {
  // Required fields
  if (!row.name || !row.name.trim()) {
    return "Name is required"
  }

  if (!row.type || !["traditional", "percentage", "fixed"].includes(row.type)) {
    return "Type must be 'traditional', 'percentage', or 'fixed'"
  }

  if (!row.triggerLevel || !["item", "brand", "category"].includes(row.triggerLevel)) {
    return "Trigger level must be 'item', 'brand', or 'category'"
  }

  if (!row.triggerValue || !row.triggerValue.trim()) {
    return "Trigger value is required"
  }

  if (!row.rewardType || !["free", "percentage", "fixed"].includes(row.rewardType)) {
    return "Reward type must be 'free', 'percentage', or 'fixed'"
  }

  // Validate reward value
  const rewardValue = Number.parseFloat(row.rewardValue)
  if (isNaN(rewardValue) || rewardValue < 0) {
    return "Reward value must be a non-negative number"
  }

  if (row.rewardType === "percentage" && rewardValue > 100) {
    return "Percentage reward cannot exceed 100%"
  }

  // Validate dates
  if (!row.startDate) {
    return "Start date is required"
  }

  if (!row.endDate) {
    return "End date is required"
  }

  const startDate = new Date(row.startDate)
  const endDate = new Date(row.endDate)

  if (isNaN(startDate.getTime())) {
    return "Invalid start date format (use YYYY-MM-DD)"
  }

  if (isNaN(endDate.getTime())) {
    return "Invalid end date format (use YYYY-MM-DD)"
  }

  if (endDate <= startDate) {
    return "End date must be after start date"
  }

  // Validate status if provided
  if (row.status && !["active", "inactive"].includes(row.status)) {
    return "Status must be 'active' or 'inactive'"
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { promotions } = body

    if (!Array.isArray(promotions) || promotions.length === 0) {
      return NextResponse.json(createApiResponse(null, "No promotions provided", false), { status: 400 })
    }

    const supabase = await createClient()

    const results = {
      success: 0,
      failed: 0,
      errors: [] as ValidationError[],
    }

    // Process each promotion
    for (const row of promotions) {
      try {
        // Validate the promotion
        const validationError = validatePromotion(row)
        if (validationError) {
          results.failed++
          results.errors.push({
            row: row._rowNumber,
            error: validationError,
            data: { name: row.name },
          })
          continue
        }

        const { error } = await supabase.from("bogo_promotions").insert([
          {
            name: row.name.trim(),
            type: row.type,
            trigger_level: row.triggerLevel,
            trigger_value: Number.parseFloat(row.triggerValue),
            reward_type: row.rewardType,
            reward_value: Number.parseFloat(row.rewardValue),
            start_date: row.startDate,
            end_date: row.endDate,
            status: row.status || "active",
          },
        ])

        if (error) {
          throw error
        }

        results.success++
      } catch (error) {
        console.error(`[v0] Error creating promotion at row ${row._rowNumber}:`, error)
        results.failed++
        results.errors.push({
          row: row._rowNumber,
          error: error instanceof Error ? error.message : "Failed to create promotion",
          data: { name: row.name },
        })
      }
    }

    return NextResponse.json(
      createApiResponse(results, `Bulk upload complete: ${results.success} successful, ${results.failed} failed`),
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Bulk upload error:", error)
    return handleApiError(error)
  }
}
