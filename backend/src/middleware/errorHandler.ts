import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { AppError } from '@/utils/AppError'
import { logger } from '@/config/logger'
import { env } from '@/config/environment'

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Log all errors
  logger.error({
    message: err.message,
    stack:   err.stack,
    url:     req.url,
    method:  req.method,
  })

  // Known operational errors (our AppErrors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.isDev && { stack: err.stack }),
    })
    return
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErr = err
    if (prismaErr.code === 'P2002') {
      const target = prismaErr.meta?.target as string[] | undefined
      res.status(409).json({
        success: false,
        message: `${target?.join(', ')} already exists`,
      })
      return
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Record not found' })
      return
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' })
    return
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' })
    return
  }

  // Unknown errors — don't leak details in production
  res.status(500).json({
    success: false,
    message: env.isDev ? err.message : 'Internal server error',
    ...(env.isDev && { stack: err.stack }),
  })
}