"use client"
import Link from "next/link"
import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getServices, addService } from "@/lib/bill-service"
import type { Service } from "@/lib/types"

export default function AddServicePage() {
  const [showForm, setShowForm] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [serviceNumber, setServiceNumber] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const userServices = getServices(user.id)
      setServices(userServices)
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setIsLoading(true)

    if (!serviceNumber || !name) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (serviceNumber.length !== 16) {
      setError("Service number must be 16 digits")
      setIsLoading(false)
      return
    }

    const success = addService(user.id, serviceNumber, name)

    if (success) {
      const updatedServices = getServices(user.id)
      setServices(updatedServices)
      setServiceNumber("")
      setName("")
      setShowForm(false)
    } else {
      setError("Failed to add service. Maximum 5 services allowed.")
    }

    setIsLoading(false)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (services.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="3" />
              <path d="M40 50 L60 50 M42 55 L58 55 M44 60 L56 60" stroke="black" strokeWidth="3" />
              <path d="M35 25 L45 35" stroke="black" strokeWidth="3" fill="none" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">ADD SERVICE</h1>
        </div>

        {/* Add Service Card */}
        <div className="bg-white/90 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-700 text-sm">
              Add service number by tapping on the plus icon. You can register maximum 5 service numbers.
            </p>
          </div>
        </div>

        {/* Registered Services */}
        <div className="bg-white/90 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Registered Service Numbers</h3>
          </div>

          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-mono text-gray-900">{service.serviceNumber}</div>
                  <div className="text-gray-600">{service.name}</div>
                </div>
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {services.length < 5 && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Add Another Service
            </button>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/home" className="text-white hover:underline font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="3" />
              <path d="M40 50 L60 50 M42 55 L58 55 M44 60 L56 60" stroke="black" strokeWidth="3" />
              <path d="M35 25 L45 35" stroke="black" strokeWidth="3" fill="none" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">ADD SERVICE</h1>
        </div>

        {/* Add Service Instructions */}
        <div className="bg-white/90 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-700 text-sm">
              Add service number by tapping on the plus icon. You can register maximum 5 service numbers.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div className="relative">
            <input
              type="text"
              placeholder="Enter service number(16 digit)"
              value={serviceNumber}
              onChange={(e) => setServiceNumber(e.target.value)}
              maxLength={16}
              className="w-full px-4 py-4 pl-12 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
              required
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 pl-12 bg-white rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-gray-700"
              required
            />
            <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-bold py-4 rounded-lg text-lg transition-colors"
          >
            {isLoading ? "Adding Service..." : "SUBMIT"}
          </button>
        </form>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/home" className="text-white hover:underline font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex flex-col items-center justify-center px-6 text-center">
      {/* Header */}
      <div className="mb-12">
        <div className="w-16 h-16 mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="3" />
            <path d="M40 50 L60 50 M42 55 L58 55 M44 60 L56 60" stroke="black" strokeWidth="3" />
            <path d="M35 25 L45 35" stroke="black" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white">ADD SERVICE</h1>
      </div>

      {/* Plus Icon */}
      <button
        onClick={() => setShowForm(true)}
        className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-8 hover:bg-gray-800 transition-colors"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Instructions */}
      <p className="text-black text-lg font-medium max-w-xs">
        Add service number by tapping on the plus icon. You can register maximum 5 service numbers.
      </p>

      {/* Back Button */}
      <div className="mt-12">
        <Link href="/home" className="text-white hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
