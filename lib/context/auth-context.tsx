"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

// Mock user types for development
interface MockUser {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "analyst" | "viewer"
  department: "pricing" | "sales" | "finance" | "operations"
  avatar?: string
}

interface AuthState {
  user: User | MockUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isDevelopmentMode: boolean
  mockUsers: MockUser[]
  currentMockUser: MockUser | null
}

type AuthAction =
  | { type: "SET_USER"; payload: User | MockUser | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DEVELOPMENT_MODE"; payload: boolean }
  | { type: "SET_MOCK_USER"; payload: MockUser | null }
  | { type: "CLEAR_AUTH" }

// Mock users for development
const mockUsers: MockUser[] = [
  {
    id: "mock-admin-1",
    email: "admin@company.com",
    name: "Sarah Admin",
    role: "admin",
    department: "operations",
    avatar: "/professional-woman-diverse.png",
  },
  {
    id: "mock-manager-1",
    email: "manager@company.com",
    name: "Mike Manager",
    role: "manager",
    department: "pricing",
    avatar: "/professional-man.jpg",
  },
  {
    id: "mock-analyst-1",
    email: "analyst@company.com",
    name: "Anna Analyst",
    role: "analyst",
    department: "finance",
    avatar: "/professional-woman-analyst.jpg",
  },
  {
    id: "mock-viewer-1",
    email: "viewer@company.com",
    name: "Victor Viewer",
    role: "viewer",
    department: "sales",
    avatar: "/professional-man-sales.jpg",
  },
]

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isDevelopmentMode: process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_AUTH !== "true",
  mockUsers,
  currentMockUser: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      }

    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "SET_DEVELOPMENT_MODE":
      return { ...state, isDevelopmentMode: action.payload }

    case "SET_MOCK_USER":
      return {
        ...state,
        currentMockUser: action.payload,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      }

    case "CLEAR_AUTH":
      return {
        ...state,
        user: null,
        currentMockUser: null,
        isAuthenticated: false,
        error: null,
        loading: false,
      }

    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  switchMockUser: (user: MockUser | null) => void
  hasRole: (role: string | string[]) => boolean
  hasDepartment: (department: string | string[]) => boolean
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const supabase = createClient()

  // Initialize auth state
  useEffect(() => {
    if (state.isDevelopmentMode) {
      // In development mode, set a default mock user
      const defaultUser = mockUsers[0] // Admin user
      dispatch({ type: "SET_MOCK_USER", payload: defaultUser })
      return
    }

    // Production auth initialization
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        dispatch({ type: "SET_USER", payload: session?.user ?? null })
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Auth initialization failed" })
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      dispatch({ type: "SET_USER", payload: session?.user ?? null })
    })

    return () => subscription.unsubscribe()
  }, [state.isDevelopmentMode, supabase.auth])

  const signIn = async (email: string, password: string) => {
    if (state.isDevelopmentMode) {
      // Mock sign in - find user by email
      const mockUser = mockUsers.find((u) => u.email === email)
      if (mockUser) {
        dispatch({ type: "SET_MOCK_USER", payload: mockUser })
      } else {
        dispatch({ type: "SET_ERROR", payload: "Mock user not found" })
      }
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Sign in failed" })
    }
  }

  const signOut = async () => {
    if (state.isDevelopmentMode) {
      dispatch({ type: "CLEAR_AUTH" })
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "Sign out failed" })
    }
  }

  const switchMockUser = (user: MockUser | null) => {
    if (state.isDevelopmentMode) {
      dispatch({ type: "SET_MOCK_USER", payload: user })
    }
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!state.user) return false
    const userRole = (state.user as MockUser).role
    if (!userRole) return false

    return Array.isArray(role) ? role.includes(userRole) : userRole === role
  }

  const hasDepartment = (department: string | string[]): boolean => {
    if (!state.user) return false
    const userDept = (state.user as MockUser).department
    if (!userDept) return false

    return Array.isArray(department) ? department.includes(userDept) : userDept === department
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        signIn,
        signOut,
        switchMockUser,
        hasRole,
        hasDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { MockUser }
