"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getServicesWithBills, payServiceBill } from "@/lib/bill-service"

interface ServiceWithBill {
  id: string
  serviceNumber: string
  name: string
  userId: string
  isActive: boolean
  currentBill?: {
    amount: number
    dueDate: string
    consumption: number
  }
}

export default function ServiceSelectionPage() {
  const [services, setServices] = useState<ServiceWithBill[]>([])
  const [selectedService, setSelectedService] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const userServices = getServicesWithBills(user.id)
      setServices(userServices)
    }
  }, [user, isAuthenticated, router])

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handlePayNow = async () => {
    if (!selectedService) {
      alert("Please select a service to pay")
      return
    }

    setIsLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const success = payServiceBill(selectedService, user!.id)

    if (success) {
      router.push("/payment-completed")
    } else {
      alert("Payment failed. Please try again.")
    }

    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 flex flex-col items-center justify-center px-6">
      {/* Payment Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-16 h-16">
            <path d="M20 40 Q20 35 25 35 L45 35 Q50 35 50 40 L50 50 Q50 55 45 55 L25 55 Q20 55 20 50 Z" fill="black" />
            <circle cx="65" cy="45" r="12" fill="black" />
            <text x="60" y="50" fontSize="10" fill="white">
              $
            </text>
          </svg>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-white mb-2">pay your electricity</h1>
        <h2 className="text-2xl font-bold text-white mb-2">bill by tapping</h2>
        <h3 className="text-xl text-white">on the service number</h3>
      </div>

      {/* Service Cards */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        {services.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">No services registered yet</p>
            <button
              onClick={() => router.push("/add-service")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`bg-white rounded-lg p-4 cursor-pointer transition-all ${
                selectedService === service.id ? "ring-4 ring-orange-400 bg-orange-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center ${
                    selectedService === service.id ? "border-orange-400" : "border-gray-400"
                  }`}
                >
                  {selectedService === service.id && <div className="w-4 h-4 bg-orange-400 rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">{service.serviceNumber}</div>
                  <div className="text-gray-600 capitalize">{service.name}</div>
                  {service.currentBill && (
                    <div className="text-sm text-gray-500 mt-1">
                      Current Bill: ₹{service.currentBill.amount} ({service.currentBill.consumption} units)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pay Now Button */}
      {services.length > 0 && (
        <button
          onClick={handlePayNow}
          disabled={!selectedService || isLoading}
          className="w-full max-w-sm bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-bold py-4 rounded-lg text-lg transition-colors"
        >
          {isLoading ? "Processing Payment..." : "PAY NOW"}
        </button>
      )}

      {/* Back Button */}
      <button onClick={() => router.push("/home")} className="mt-6 text-white hover:underline">
        ← Back to Home
      </button>
    </div>
  )
}
