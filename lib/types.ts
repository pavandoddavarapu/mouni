export interface User {
  id: string
  name: string
  email: string
  consumerNumber: string
  meterNumber: string
  address: string
  mobileNumber: string
  presentReading?: number
  previousReading?: number
}

export interface Bill {
  id: string
  userId: string
  billDate: string
  dueDate: string
  accountNumber: string
  consumption: number
  amount: number
  taxes: number
  status: "paid" | "pending"
  printedOn: string
}

export interface Service {
  id: string
  userId: string
  serviceNumber: string
  name: string
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
