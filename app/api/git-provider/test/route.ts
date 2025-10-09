/**
 * @task GL-012
 * @description Test connection to git providers
 */

import { NextResponse } from "next/server"
import { GitProviderFactory } from "@/lib/services/git-provider-factory"

export async function GET() {
  try {
    const results = await GitProviderFactory.testAll()

    return NextResponse.json({
      success: true,
      providers: results,
      message: `GitHub: ${results.github ? "Connected" : "Disconnected"}, GitLab: ${results.gitlab ? "Connected" : "Disconnected"}`,
    })
  } catch (error) {
    console.error("[v0] Error testing git providers:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
