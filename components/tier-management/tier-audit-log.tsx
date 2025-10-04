"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface AuditEntry {
  id: string
  rule_id: string
  customer_id: string
  action: "assigned" | "updated" | "removed"
  old_tier?: "A" | "B" | "C"
  new_tier?: "A" | "B" | "C"
  changed_by?: string
  changed_at: string
  reason?: string
}

export function TierAuditLog() {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuditLog()
  }, [])

  const fetchAuditLog = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tier-assignments/audit")

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setAuditLog(result.data)
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching audit log:", err)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "assigned":
        return "bg-gti-bright-green text-white"
      case "updated":
        return "bg-gti-yellow text-black"
      case "removed":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tier Assignment Audit Log</CardTitle>
          <CardDescription>Track all changes to customer tier assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier Assignment Audit Log</CardTitle>
        <CardDescription>Track all changes to customer tier assignments</CardDescription>
      </CardHeader>
      <CardContent>
        {auditLog.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No audit entries yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Tier Change</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.changed_at).toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-sm">{entry.customer_id}</TableCell>
                  <TableCell>
                    <Badge className={getActionColor(entry.action)}>{entry.action}</Badge>
                  </TableCell>
                  <TableCell>
                    {entry.action === "assigned" && <Badge variant="outline">→ Tier {entry.new_tier}</Badge>}
                    {entry.action === "updated" && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Tier {entry.old_tier}</Badge>
                        <span>→</span>
                        <Badge variant="outline">Tier {entry.new_tier}</Badge>
                      </div>
                    )}
                    {entry.action === "removed" && <Badge variant="outline">Tier {entry.old_tier} ✕</Badge>}
                  </TableCell>
                  <TableCell>{entry.changed_by || "System"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
