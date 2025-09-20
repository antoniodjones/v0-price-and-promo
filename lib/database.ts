import { PrismaClient } from "@prisma/client"

declare global {
  var __prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
export const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma
}

// Database connection helper
export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected successfully")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    throw error
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect()
}

// Health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: "healthy", timestamp: new Date().toISOString() }
  } catch (error) {
    return { status: "unhealthy", error: error.message, timestamp: new Date().toISOString() }
  }
}
