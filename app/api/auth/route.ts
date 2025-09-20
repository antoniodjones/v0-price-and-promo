// Authentication API endpoints for GTI Pricing Engine

import { type NextRequest, NextResponse } from "next/server"
import { createApiResponse, handleApiError } from "@/lib/api/utils"

// Mock authentication - replace with actual auth implementation
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@gti.com",
    password: "admin123", // In production, use hashed passwords
    role: "admin",
    name: "GTI Admin",
  },
  {
    id: "2",
    email: "manager@gti.com",
    password: "manager123",
    role: "manager",
    name: "Pricing Manager",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(createApiResponse(null, "Email and password are required", false), { status: 400 })
    }

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(createApiResponse(null, "Invalid credentials", false), { status: 401 })
    }

    // In production, generate actual JWT tokens
    const token = `mock-jwt-token-${user.id}`

    return NextResponse.json(
      createApiResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
          token,
        },
        "Login successful",
      ),
    )
  } catch (error) {
    return handleApiError(error)
  }
}
