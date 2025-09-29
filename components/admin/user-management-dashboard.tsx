"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  UserX,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { userAPI, type ApiUser, type BulkOperationResult } from "@/lib/api/user-management"

interface UserFilters {
  search: string
  role: string
  status: string
  department: string
}

export function UserManagementDashboard() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
    department: "all",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [bulkImportData, setBulkImportData] = useState("")
  const [bulkOperationResult, setBulkOperationResult] = useState<BulkOperationResult | null>(null)
  const { toast } = useToast()

  const [newUser, setNewUser] = useState<Omit<ApiUser, "id" | "created_at" | "updated_at">>({
    name: "",
    email: "",
    role: "user",
    status: "active",
    department: "",
  })

  useEffect(() => {
    loadUsers()
  }, [filters, pagination.page, pagination.limit])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        role: filters.role === "all" ? undefined : filters.role,
        status: filters.status === "all" ? undefined : filters.status,
      })
      setUsers(response.data)
      setPagination((prev) => ({ ...prev, total: response.pagination.total }))
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const createdUser = await userAPI.createUser(newUser)
      setUsers([createdUser, ...users])
      setNewUser({
        name: "",
        email: "",
        role: "user",
        status: "active",
        department: "",
      })
      setShowCreateUser(false)
      toast({
        title: "Success",
        description: "User created successfully.",
      })
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser?.id) return

    try {
      const updatedUser = await userAPI.updateUser(editingUser.id, editingUser)
      setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)))
      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await userAPI.deleteUser(id)
      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkImport = async () => {
    if (!bulkImportData.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide user data to import.",
        variant: "destructive",
      })
      return
    }

    try {
      const users = JSON.parse(bulkImportData)
      const result = await userAPI.bulkCreate(users)
      setBulkOperationResult(result)
      setBulkImportData("")
      loadUsers() // Refresh the user list
      toast({
        title: "Bulk Import Complete",
        description: `${result.summary.created || 0} users created, ${result.summary.errors} errors.`,
      })
    } catch (error) {
      console.error("Error with bulk import:", error)
      toast({
        title: "Error",
        description: "Failed to import users. Please check the data format.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDeactivate = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select users to deactivate.",
        variant: "destructive",
      })
      return
    }

    try {
      const usersToDeactivate = selectedUsers.map((id) => ({ id }))
      const result = await userAPI.bulkDeactivate(usersToDeactivate)
      setBulkOperationResult(result)
      setSelectedUsers([])
      loadUsers() // Refresh the user list
      toast({
        title: "Bulk Deactivation Complete",
        description: `${result.summary.deactivated || 0} users deactivated.`,
      })
    } catch (error) {
      console.error("Error with bulk deactivation:", error)
      toast({
        title: "Error",
        description: "Failed to deactivate users. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "user":
        return "secondary"
      default:
        return "outline"
    }
  }

  const departments = Array.from(new Set(users.map((user) => user.department).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Import Users</DialogTitle>
                <DialogDescription>
                  Import multiple users at once using JSON format. Each user should have name, email, role, and status.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-data">User Data (JSON)</Label>
                  <Textarea
                    id="bulk-data"
                    placeholder={`[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "department": "Sales"
  }
]`}
                    value={bulkImportData}
                    onChange={(e) => setBulkImportData(e.target.value)}
                    rows={10}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleBulkImport}>Import Users</Button>
                  <Button variant="outline" onClick={() => setShowBulkImport(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with appropriate role and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Name *</Label>
                    <Input
                      id="user-name"
                      placeholder="John Doe"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="john@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-status">Status</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value: any) => setNewUser({ ...newUser, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-department">Department</Label>
                  <Input
                    id="user-department"
                    placeholder="Sales, Marketing, IT, etc."
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateUser}>Create User</Button>
                  <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department-filter">Department</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => setFilters({ ...filters, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Operation Results */}
      {bulkOperationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bulk Operation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total processed:</span>
                <span className="font-medium">{bulkOperationResult.summary.total}</span>
              </div>
              {bulkOperationResult.summary.created && (
                <div className="flex justify-between text-sm">
                  <span>Created:</span>
                  <span className="font-medium text-green-600">{bulkOperationResult.summary.created}</span>
                </div>
              )}
              {bulkOperationResult.summary.updated && (
                <div className="flex justify-between text-sm">
                  <span>Updated:</span>
                  <span className="font-medium text-blue-600">{bulkOperationResult.summary.updated}</span>
                </div>
              )}
              {bulkOperationResult.summary.deactivated && (
                <div className="flex justify-between text-sm">
                  <span>Deactivated:</span>
                  <span className="font-medium text-orange-600">{bulkOperationResult.summary.deactivated}</span>
                </div>
              )}
              {bulkOperationResult.summary.errors > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Errors:</span>
                  <span className="font-medium text-red-600">{bulkOperationResult.summary.errors}</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 bg-transparent"
              onClick={() => setBulkOperationResult(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading users...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search !== "" || filters.role !== "all" || filters.status !== "all"
                  ? "No users match your current filters"
                  : "Add your first user to get started"}
              </p>
              <Button onClick={() => setShowCreateUser(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map((user) => user.id!))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id!])
                          } else {
                            setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{user.department || "—"}</TableCell>
                    <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={editingUser?.id === user.id}
                          onOpenChange={(open) => !open && setEditingUser(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>Update user information and permissions.</DialogDescription>
                            </DialogHeader>
                            {editingUser && (
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingUser.name}
                                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={editingUser.email}
                                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                      value={editingUser.role}
                                      onValueChange={(value: any) => setEditingUser({ ...editingUser, role: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                      value={editingUser.status}
                                      onValueChange={(value: any) => setEditingUser({ ...editingUser, status: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-department">Department</Label>
                                  <Input
                                    id="edit-department"
                                    value={editingUser.department || ""}
                                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button onClick={handleUpdateUser}>Update User</Button>
                                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id!)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page * pagination.limit >= pagination.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
