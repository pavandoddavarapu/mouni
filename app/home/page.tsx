"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getCurrentBill, payBill, getServices } from "@/lib/bill-service"
import type { Bill, Service } from "@/lib/types"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [currentBill, setCurrentBill] = useState<Bill | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const bill = getCurrentBill(user.id)
      setCurrentBill(bill)

      const userServices = getServices(user.id)
      setServices(userServices)
    }
  }, [isAuthenticated, user, router])

  const handlePayment = async () => {
    if (!currentBill || !user) return

    if (services.length > 0) {
      router.push("/service-selection")
      return
    }

    setIsPaymentLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const success = payBill(currentBill.id, user.id)

    if (success) {
      router.push("/payment-completed")
    } else {
      alert("Payment failed. Please try again.")
    }

    setIsPaymentLoading(false)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!currentBill) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading your bill...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex flex-col">
      {/* Header */}
      <div className="flex-1 px-6 py-8">
        {/* Bill Illustration */}
        <div className="mb-8">
          <div className="w-64 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <rect x="20" y="20" width="160" height="60" fill="#f0f0f0" rx="5" />
              <circle cx="60" cy="40" r="8" fill="#4ade80" />
              <rect x="80" y="35" width="60" height="4" fill="#333" />
              <rect x="80" y="45" width="40" height="3" fill="#666" />
              <circle cx="150" cy="50" r="6" fill="#fbbf24" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">HOME</h1>
        <h2 className="text-xl font-semibold text-white text-center mb-8">ELECTRICITY BILL</h2>

        {/* Bill Details Card */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Bill date</span>
              <span className="text-gray-900">{currentBill.billDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">account number</span>
              <span className="text-gray-900">{currentBill.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name</span>
              <span className="text-gray-900">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Address</span>
              <span className="text-gray-900">{user.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">taxes</span>
              <span className="text-gray-900">₹{currentBill.taxes}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">amount</span>
              <span className="text-gray-900 font-bold">₹{currentBill.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Due date</span>
              <span className="text-gray-900">{currentBill.dueDate}</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">printed on {currentBill.printedOn}</div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isPaymentLoading || currentBill.status === "paid"}
          className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-xl transition-colors block text-center mb-8"
        >
          {isPaymentLoading
            ? "Processing Payment..."
            : currentBill.status === "paid"
              ? "PAID"
              : services.length > 0
                ? "SELECT SERVICE TO PAY"
                : "PAY NOW"}
        </button>

        {services.length > 0 && (
          <div className="text-center text-white mb-4">
            {services.length} service{services.length > 1 ? "s" : ""} registered
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/20 backdrop-blur-sm px-6 py-4">
        <div className="flex justify-around">
          <Link href="/add-service" className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">Add service</span>
          </Link>

          <Link href="/history" className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">History</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
