import { Request } from 'express'
import { PaginationParams } from '@/types'

export function getPagination(req: Request): PaginationParams {
  const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10)
  const skip  = (page - 1) * limit
  return { page, limit, skip }
}

export function buildPaginatedResponse<T>(
  data:  T[],
  total: number,
  { page, limit }: PaginationParams
) {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext:    page * limit < total,
    hasPrev:    page > 1,
  }
}