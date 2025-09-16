import type { Bill, Service } from "./types"

export function generateBills(userId: string): Bill[] {
  const months = [
    { name: "MAY", year: "2025", consumption: 200, amount: 1940, status: "pending" as const },
    { name: "April", year: "2025", consumption: 224, amount: 1930, status: "paid" as const },
    { name: "March", year: "2025", consumption: 180, amount: 1470, status: "paid" as const },
    { name: "Feb", year: "2025", consumption: 262, amount: 2290, status: "paid" as const },
  ]

  return months.map((month, index) => ({
    id: `${userId}-${index}`,
    userId,
    billDate: `${String(index + 1).padStart(2, "0")}-${month.name.toLowerCase()}-${month.year}`,
    dueDate: `${String(index + 12).padStart(2, "0")}/08/25`,
    accountNumber: "1246557",
    consumption: month.consumption,
    amount: month.amount,
    taxes: Math.round(month.amount * 0.08),
    status: month.status,
    printedOn: "25/07/25",
  }))
}

export function getCurrentBill(userId: string): Bill {
  return {
    id: `${userId}-current`,
    userId,
    billDate: "27/07/25",
    dueDate: "12/08/25",
    accountNumber: "1246557",
    consumption: 200,
    amount: 600.15,
    taxes: 46.8,
    status: "pending",
    printedOn: "25/07/25",
  }
}

export function getBillHistory(userId: string): Bill[] {
  const saved = localStorage.getItem(`bills-${userId}`)
  if (saved) {
    return JSON.parse(saved)
  }

  const bills = generateBills(userId)
  localStorage.setItem(`bills-${userId}`, JSON.stringify(bills))
  return bills
}

export function payBill(billId: string, userId: string): boolean {
  try {
    const bills = getBillHistory(userId)
    const billIndex = bills.findIndex((b) => b.id === billId)

    if (billIndex !== -1) {
      bills[billIndex].status = "paid"
      localStorage.setItem(`bills-${userId}`, JSON.stringify(bills))
      return true
    }
    return false
  } catch (error) {
    console.error("Payment failed:", error)
    return false
  }
}

export function getServices(userId: string): Service[] {
  const saved = localStorage.getItem(`services-${userId}`)
  return saved ? JSON.parse(saved) : []
}

export function addService(userId: string, serviceNumber: string, name: string): boolean {
  try {
    const services = getServices(userId)

    if (services.length >= 5) {
      return false // Maximum 5 services
    }

    // Check if service number already exists
    const existingService = services.find((s) => s.serviceNumber === serviceNumber)
    if (existingService) {
      return false
    }

    const newService: Service = {
      id: Date.now().toString(),
      userId,
      serviceNumber,
      name,
      isActive: true,
    }

    services.push(newService)
    localStorage.setItem(`services-${userId}`, JSON.stringify(services))
    return true
  } catch (error) {
    console.error("Failed to add service:", error)
    return false
  }
}

export function getServicesWithBills(userId: string): Array<Service & { currentBill?: Bill }> {
  const services = getServices(userId)

  return services.map((service) => ({
    ...service,
    currentBill: {
      id: `${service.id}-current`,
      userId,
      billDate: new Date().toLocaleDateString("en-GB"),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB"),
      accountNumber: service.serviceNumber,
      consumption: Math.floor(Math.random() * 300) + 100,
      amount: Math.floor(Math.random() * 2000) + 500,
      taxes: Math.floor(Math.random() * 200) + 50,
      status: "pending" as const,
      printedOn: new Date().toLocaleDateString("en-GB"),
    },
  }))
}

export function payServiceBill(serviceId: string, userId: string): boolean {
  try {
    // Create payment record
    const payment = {
      id: Date.now().toString(),
      serviceId,
      userId,
      amount: Math.floor(Math.random() * 2000) + 500,
      date: new Date().toISOString(),
      status: "completed",
    }

    const existingPayments = JSON.parse(localStorage.getItem(`payments-${userId}`) || "[]")
    existingPayments.unshift(payment)
    localStorage.setItem(`payments-${userId}`, JSON.stringify(existingPayments))

    return true
  } catch (error) {
    console.error("Payment failed:", error)
    return false
  }
}
