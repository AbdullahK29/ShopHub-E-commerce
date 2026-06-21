// Shared types for the entire backend
import { Request } from 'express'
import { Role } from '@prisma/client'

// Extends Express Request to include the authenticated user
// After auth middleware runs, req.user is available everywhere
export interface AuthRequest extends Request {
  user?: {
    id:    string
    email: string
    role:  Role
  }
}

export interface JwtPayload {
  id:    string
  email: string
  role:  Role
}

// Standard API response shape — every endpoint returns this
export interface ApiResponse<T = unknown> {
  success: boolean
  data?:   T
  message: string
  errors?: string[]
}

// Pagination params from query string
export interface PaginationParams {
  page:  number
  limit: number
  skip:  number
}