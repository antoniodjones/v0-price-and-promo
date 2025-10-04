"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface TierAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  rule: any
  onSuccess: () => void
}

interface Assignment {
  id: string
  customer_id: string
  tier: "A" | "B" | "C"
  assigned_date: string
  assigned_by?: string
  notes?: string
  customer?: {
    id: string
    name: string
    email: string
  }
}

export function TierAssignmentModal({ isOpen, onClose, rule, onSuccess }: TierAssignmentModalProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newAssignment, setNewAssignment] = useState({
    customer_id: "",
    tier: "A" as "A" | "B" | "C",
    notes: "",
  })

  useEffect(() => {
    if (isOpen && rule) {
      fetchAssignments()
    }
  }, [isOpen, rule])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/discount-rules/${rule.id}/assignments`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setAssignments(result.data)
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching assignments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAssignment = async () => {
    try {
      const response = await fetch(`/api/discount-rules/${rule.id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      })

      if (response.ok) {
        setShowAddForm(false)
        setNewAssignment({ customer_id: "", tier: "A", notes: "" })
        fetchAssignments()
      }
    } catch (err) {
      console.error("[v0] Error adding assignment:", err)
    }
  }

  const handleDeleteAssignment = async (customerId: string) => {
    if (!confirm("Remove this customer from the tier?")) return

    try {
      const response = await fetch(`/api/discount-rules/${rule.id}/assignments/${customerId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchAssignments()
      }
    } catch (err) {
      console.error("[v0] Error deleting assignment:", err)
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      assignment.customer?.name.toLowerCase().includes(searchLower) ||
      assignment.customer?.email.toLowerCase().includes(searchLower)
    )
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Customer Tier Assignments</DialogTitle>
          <DialogDescription>
            Assign customers to tiers for: <strong>{rule?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Assignment Form */}
          {showAddForm ? (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Add Customer Assignment</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer ID</Label>
                  <Input
                    value={newAssignment.customer_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, customer_id: e.target.value })}
                    placeholder="Enter customer ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tier</Label>
                  <Select
                    value={newAssignment.tier}
                    onValueChange={(value: "A" | "B" | "C") => setNewAssignment({ ...newAssignment, tier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Tier A</SelectItem>
                      <SelectItem value="B">Tier B</SelectItem>
                      <SelectItem value="C">Tier C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={newAssignment.notes}
                    onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
                    placeholder="Add notes about this assignment..."
                    rows={2}
                  />
                </div>
              </div>

              <Button
                onClick={handleAddAssignment}
                disabled={!newAssignment.customer_id}
                className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
              >
                Add Assignment
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Assignments Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No customer assignments yet. Add customers to assign them to tiers.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.customer?.name || assignment.customer_id}</TableCell>
                    <TableCell>{assignment.customer?.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Tier {assignment.tier}</Badge>
                    </TableCell>
                    <TableCell>{new Date(assignment.assigned_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{assignment.notes || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAssignment(assignment.customer_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
