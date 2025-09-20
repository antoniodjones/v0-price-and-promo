import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/database"

export async function GET() {
  try {
    const health = await checkDatabaseHealth()

    if (health.status === "healthy") {
      return NextResponse.json({
        status: "ok",
        database: health,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          database: health,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
