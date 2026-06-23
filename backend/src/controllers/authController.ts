import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '@/config/database'
import { signToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt'
import { sendSuccess, sendCreated } from '@/utils/response'
import { AppError, ConflictError, UnauthorizedError } from '@/utils/AppError'
import { AuthRequest } from '@/types'
import { logger } from '@/config/logger'
//import { sendEmail, welcomeEmail } from '@/config/email'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictError('An account with this email already exists')

    // Hash password — 12 rounds is the sweet spot (secure but not too slow)
    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash },
      select: {
        id: true, email: true, firstName: true,
        lastName: true, role: true, isEmailVerified: true, createdAt: true,
      },
    })

    // Send welcome email in background (no await)
    // sendEmail({
    //   to:      user.email,
    //   subject: 'Welcome to ShopHub! 🎉',
    //   html:    welcomeEmail(user.firstName),
    // })

    const token        = signToken({ id: user.id, email: user.email, role: user.role })
    const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role })

    // Store refresh token in DB
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })

    sendCreated(res, { user, token, refreshToken }, 'Account created successfully')
  } catch (e) { next(e) }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw new UnauthorizedError('Invalid email or password')

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) throw new UnauthorizedError('Invalid email or password')

    // #region agent log
    logger.info('[debug-login] password valid', { email, userId: user.id, hypothesisId: 'B' })
    // #endregion

    let token: string
    let refreshToken: string
    try {
      token = signToken({ id: user.id, email: user.email, role: user.role })
      // #region agent log
      logger.info('[debug-login] signToken ok', { hypothesisId: 'B' })
      // #endregion
    } catch (e) {
      logger.error('[debug-login] signToken failed', { error: e instanceof Error ? e.message : e })
      throw e
    }

    try {
      refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role })
      // #region agent log
      logger.info('[debug-login] signRefreshToken ok', { hypothesisId: 'B' })
      // #endregion
    } catch (e) {
      logger.error('[debug-login] signRefreshToken failed', { error: e instanceof Error ? e.message : e })
      throw e
    }

    try {
      await prisma.user.update({ where: { id: user.id }, data: { refreshToken } })
      // #region agent log
      logger.info('[debug-login] refreshToken saved', { hypothesisId: 'F' })
      // #endregion
    } catch (e) {
      logger.error('[debug-login] refreshToken update failed', { error: e instanceof Error ? e.message : e })
      throw e
    }

    const { passwordHash: _pw, refreshToken: _rt, ...safeUser } = user

    sendSuccess(res, { user: safeUser, token, refreshToken }, 'Login successful')
  } catch (e) {
    logger.error('[debug-login] login failed', { error: e instanceof Error ? e.message : e, stack: e instanceof Error ? e.stack : undefined })
    next(e)
  }
}

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Clear refresh token from DB
    await prisma.user.update({
      where: { id: req.user!.id },
      data:  { refreshToken: null },
    })
    sendSuccess(res, null, 'Logged out successfully')
  } catch (e) { next(e) }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw new UnauthorizedError('Refresh token required')

    const decoded = verifyRefreshToken(refreshToken)

    // Verify token matches what's stored in DB (rotation check)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const newToken        = signToken({ id: user.id, email: user.email, role: user.role })
    const newRefreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role })

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken } })

    sendSuccess(res, { token: newToken, refreshToken: newRefreshToken })
  } catch (e) { next(e) }
}

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, avatar: true, isEmailVerified: true, createdAt: true,
      },
    })
    sendSuccess(res, user)
  } catch (e) { next(e) }
}