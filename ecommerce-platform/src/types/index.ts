// src/types/index.ts

export type UserRole = "CUSTOMER" | "ADMIN" | "VENDOR"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  avatar?: string
  isEmailVerified: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string
  comment?: string
  helpful: number
  user: {
    firstName: string
    lastName: string
    avatar?: string
  }
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  discountPrice?: number
  stockQuantity: number
  images: string[]
  sku: string
  isActive: boolean
  rating: number
  reviewCount: number
  category: Category
  reviews?: Review[]
  createdAt: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Cart {
  id?: string
  items: CartItem[]
  total: number
  itemCount: number
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL"

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  subtotal: number
  shippingCost: number
  tax: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: Address
  items: OrderItem[]
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  message: string
}