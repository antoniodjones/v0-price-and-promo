"use server"

import { cookies } from "next/headers"
import { auditLogger, type AuditLogFilter } from "@/lib/audit/audit-logger"

export async function getAuditLogsAction(filter: AuditLogFilter = {}, page = 1, limit = 20) {
  const cookieStore = await cookies()
  return auditLogger.getAuditLogs(cookieStore, filter, page, limit)
}

export async function getAuditStatsAction() {
  const cookieStore = await cookies()
  return auditLogger.getAuditStats(cookieStore)
}

export async function cleanupExpiredLogsAction() {
  const cookieStore = await cookies()
  return auditLogger.cleanupExpiredLogs(cookieStore)
}
