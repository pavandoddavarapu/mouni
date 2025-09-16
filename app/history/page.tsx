"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getBillHistory } from "@/lib/bill-service"
import type { Bill } from "@/lib/types"

export default function HistoryPage() {
  const { user, isAuthenticated } = useAuth()
  const [bills, setBills] = useState<Bill[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const billHistory = getBillHistory(user.id)
      setBills(billHistory)
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 px-6 py-8">
      {/* Header with Illustration */}
      <div className="mb-8">
        <div className="w-64 h-32 bg-white rounded-lg mx-auto flex items-center justify-center mb-6">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <rect x="20" y="20" width="160" height="60" fill="#f0f0f0" rx="5" />
            <circle cx="60" cy="40" r="8" fill="#4ade80" />
            <rect x="80" y="35" width="60" height="4" fill="#333" />
            <rect x="80" y="45" width="40" height="3" fill="#666" />
            <circle cx="150" cy="50" r="6" fill="#fbbf24" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white text-center">HISTORY</h1>
      </div>

      {/* Bill History Cards */}
      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">{bill.billDate}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  bill.status === "paid" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {bill.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bill Date :</span>
                <span className="text-gray-900">{bill.billDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consumption :</span>
                <span className="text-gray-900">{bill.consumption} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bill Amount :</span>
                <span className="text-gray-900 font-bold">RS.{bill.amount}</span>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  bill.status === "paid" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {bill.status === "paid" ? (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-red-500 text-xs">!</span>
                )}
              </div>
            </div>
          </div>
        ))}
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
