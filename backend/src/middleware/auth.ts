import { Response, NextFunction } from 'express'
import { AuthRequest } from '@/types'
import { verifyToken } from '@/utils/jwt'
import { UnauthorizedError, ForbiddenError } from '@/utils/AppError'
import { prisma } from '@/config/database'
import { Role } from '@prisma/client'

// Verifies JWT and attaches user to req.user
export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    // Verify user still exists in database
    // (handles case where user was deleted after token was issued)
    const user = await prisma.user.findUnique({
      where:  { id: decoded.id },
      select: { id: true, email: true, role: true },
    })

    if (!user) throw new UnauthorizedError('User no longer exists')

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

// Role-based authorization — use after authenticate
// Example: router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser)
export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to perform this action'))
      return
    }
    next()
  }
}