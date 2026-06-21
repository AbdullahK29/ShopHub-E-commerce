import { Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '@/config/database'
import { AuthRequest } from '@/types'
import { sendSuccess } from '@/utils/response'
import { ValidationError, NotFoundError } from '@/utils/AppError'

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user!.id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, avatar: true, isEmailVerified: true, createdAt: true }
    })
    sendSuccess(res, user)
  } catch (e) { next(e) }
}

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body
    const user = await prisma.user.update({
      where:  { id: req.user!.id },
      data:   { firstName, lastName, phone, avatar },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true }
    })
    sendSuccess(res, user, 'Profile updated')
  } catch (e) { next(e) }
}

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) throw new NotFoundError('User not found')

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) throw new ValidationError('Current password is incorrect')

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: req.user!.id }, data: { passwordHash } })

    sendSuccess(res, null, 'Password changed successfully')
  } catch (e) { next(e) }
}

export const addToWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.wishlist.upsert({
      where:  { userId_productId: { userId: req.user!.id, productId: req.params.productId as string } },
      update: {},
      create: { userId: req.user!.id, productId: req.params.productId as string }
    })
    sendSuccess(res, null, 'Added to wishlist')
  } catch (e) { next(e) }
}

export const removeFromWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.id, productId: req.params.productId as string }
    })
    sendSuccess(res, null, 'Removed from wishlist')
  } catch (e) { next(e) }
}

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where:   { userId: req.user!.id },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' }
    })
    sendSuccess(res, wishlist)
  } catch (e) { next(e) }
}