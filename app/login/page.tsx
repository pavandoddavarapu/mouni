"use client"
import Link from "next/link"
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    const success = await login(email, password)

    if (success) {
      router.push("/home")
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex flex-col items-center justify-center px-6">
      {/* Bill Icon */}
      <div className="mb-12">
        <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-8">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <rect x="20" y="15" width="50" height="65" fill="white" stroke="black" strokeWidth="2" />
            <rect x="25" y="20" width="15" height="3" fill="orange" />
            <text x="25" y="35" fontSize="20" fill="black">
              $
            </text>
            <rect x="35" y="30" width="25" height="2" fill="black" />
            <rect x="35" y="35" width="25" height="2" fill="black" />
            <rect x="35" y="40" width="25" height="2" fill="black" />
            <circle cx="25" cy="65" r="8" fill="orange" />
            <path d="M20 60 L30 70" stroke="black" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Login Title */}
      <h1 className="text-4xl font-bold text-white mb-12">LOG IN</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

        <div className="relative">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 pl-12 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
            required
          />
          <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 pl-12 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
            required
          />
          <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-bold py-4 rounded-lg text-lg transition-colors"
        >
          {isLoading ? "Logging in..." : "LOG IN"}
        </button>

        <div className="text-center">
          <Link href="/forgot-password" className="text-white hover:underline">
            Forgot Password ?
          </Link>
        </div>

        <div className="text-center">
          <span className="text-white">Don't have an account? </span>
          <Link href="/register" className="text-white font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}
