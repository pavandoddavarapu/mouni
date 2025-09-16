"use client"
import Link from "next/link"
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    consumerNumber: "",
    name: "",
    address: "",
    mobileNumber: "",
    email: "",
    presentReading: "",
    previousReading: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate required fields
    const requiredFields = ["consumerNumber", "name", "address", "mobileNumber", "email"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    const success = await register({
      consumerNumber: formData.consumerNumber,
      name: formData.name,
      address: formData.address,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      presentReading: formData.presentReading ? Number.parseInt(formData.presentReading) : undefined,
      previousReading: formData.previousReading ? Number.parseInt(formData.previousReading) : undefined,
    })

    if (success) {
      router.push("/home")
    } else {
      setError("Registration failed. Email may already be in use.")
    }

    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex flex-col items-center justify-start px-6 py-8">
      {/* Lightbulb Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="3" />
            <path d="M40 50 L60 50 M42 55 L58 55 M44 60 L56 60" stroke="black" strokeWidth="3" />
            <path d="M35 25 L45 35" stroke="black" strokeWidth="3" fill="none" />
          </svg>
        </div>
      </div>

      {/* Registration Title */}
      <h1 className="text-3xl font-bold text-white mb-8">Registration</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

        <input
          type="text"
          name="consumerNumber"
          placeholder="Consumer number"
          value={formData.consumerNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
          required
        />

        <input
          type="tel"
          name="mobileNumber"
          placeholder="Mobile number"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
          required
        />

        <input
          type="number"
          name="presentReading"
          placeholder="Present reading"
          value={formData.presentReading}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
        />

        <input
          type="number"
          name="previousReading"
          placeholder="Previous reading"
          value={formData.previousReading}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-bold py-4 rounded-lg text-lg transition-colors mt-6"
        >
          {isLoading ? "Creating Account..." : "SIGN UP"}
        </button>

        <div className="text-center mt-4">
          <span className="text-white">or</span>
        </div>

        <div className="text-center">
          <span className="text-white">Already have an account? </span>
          <Link href="/login" className="text-white font-bold hover:underline">
            log in
          </Link>
        </div>
      </form>
    </div>
  )
}
