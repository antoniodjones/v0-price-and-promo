export interface ApiUser {
  id?: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  status: "active" | "inactive"
  department?: string
  sso_id?: string
  source?: string
  created_at?: string
  updated_at?: string
}

export interface BulkOperationResult {
  success: boolean
  results: {
    created?: ApiUser[]
    updated?: ApiUser[]
    deactivated?: ApiUser[]
    unchanged?: ApiUser[]
    errors?: Array<{ user: any; error: string }>
  }
  summary: {
    total: number
    created?: number
    updated?: number
    deactivated?: number
    unchanged?: number
    errors: number
  }
}

export class UserManagementAPI {
  private baseUrl: string

  constructor(baseUrl = "/api/users") {
    this.baseUrl = baseUrl
  }

  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }): Promise<{ data: ApiUser[]; pagination: any }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)
    if (params?.role) searchParams.set("role", params.role)
    if (params?.status) searchParams.set("status", params.status)

    const response = await fetch(`${this.baseUrl}?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  }

  async createUser(user: Omit<ApiUser, "id" | "created_at" | "updated_at">): Promise<ApiUser> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to create user")
    const result = await response.json()
    return result.data
  }

  async updateUser(id: string, updates: Partial<ApiUser>): Promise<ApiUser> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update user")
    const result = await response.json()
    return result.data
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
  }

  async bulkCreate(users: Omit<ApiUser, "id" | "created_at" | "updated_at">[]): Promise<BulkOperationResult> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, operation: "create" }),
    })
    if (!response.ok) throw new Error("Bulk create failed")
    return response.json()
  }

  async bulkUpdate(users: Array<{ id?: string; email?: string } & Partial<ApiUser>>): Promise<BulkOperationResult> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, operation: "update" }),
    })
    if (!response.ok) throw new Error("Bulk update failed")
    return response.json()
  }

  async bulkDeactivate(users: Array<{ id?: string; email?: string }>): Promise<BulkOperationResult> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, operation: "deactivate" }),
    })
    if (!response.ok) throw new Error("Bulk deactivate failed")
    return response.json()
  }

  async syncUsers(users: any[], source = "sso"): Promise<BulkOperationResult> {
    const response = await fetch(`${this.baseUrl}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, source }),
    })
    if (!response.ok) throw new Error("User sync failed")
    return response.json()
  }
}

// Export singleton instance
export const userAPI = new UserManagementAPI()
