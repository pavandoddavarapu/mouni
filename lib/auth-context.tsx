"use client"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "./types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id">) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return { user: action.payload, isAuthenticated: true, isLoading: false }
    case "LOGIN_FAILURE":
      return { user: null, isAuthenticated: false, isLoading: false }
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false }
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  useEffect(() => {
    const savedUser = localStorage.getItem("electricity-bill-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("electricity-bill-user")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("electricity-bill-users") || "[]")
    const user = users.find((u: User) => u.email === email)

    if (user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
      localStorage.setItem("electricity-bill-user", JSON.stringify(user))
      return true
    } else {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const register = async (userData: Omit<User, "id">): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("electricity-bill-users") || "[]")
    const existingUser = users.find((u: User) => u.email === userData.email)

    if (existingUser) {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }

    // Create new user
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      meterNumber: Math.floor(Math.random() * 100000000).toString(),
    }

    users.push(newUser)
    localStorage.setItem("electricity-bill-users", JSON.stringify(users))

    dispatch({ type: "LOGIN_SUCCESS", payload: newUser })
    localStorage.setItem("electricity-bill-user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    localStorage.removeItem("electricity-bill-user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData }
      dispatch({ type: "UPDATE_USER", payload: userData })
      localStorage.setItem("electricity-bill-user", JSON.stringify(updatedUser))

      // Update in users array
      const users = JSON.parse(localStorage.getItem("electricity-bill-users") || "[]")
      const userIndex = users.findIndex((u: User) => u.id === state.user?.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("electricity-bill-users", JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
