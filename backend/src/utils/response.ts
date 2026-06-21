import { Response } from 'express'
import { ApiResponse } from '@/types'

// Consistent response helpers used by every controller
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = { success: true, data, message }
  return res.status(statusCode).json(response)
}

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: string[]
): Response => {
  const response: ApiResponse = { success: false, message, errors }
  return res.status(statusCode).json(response)
}

export const sendCreated = <T>(res: Response, data: T, message = 'Created successfully') =>
  sendSuccess(res, data, message, 201)