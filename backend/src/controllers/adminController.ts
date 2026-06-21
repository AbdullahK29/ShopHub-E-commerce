import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { sendSuccess } from '@/utils/response'
import { getPagination, buildPaginatedResponse } from '@/utils/pagination'

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers, totalProducts, totalOrders,
      revenueResult, pendingOrders, lowStockProducts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } }
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { stockQuantity: { lte: 5 }, isActive: true } }),
    ])

    sendSuccess(res, {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue:    Number(revenueResult._sum.totalAmount || 0),
      pendingOrders,
      lowStockProducts,
    })
  } catch (e) { next(e) }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req)
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isEmailVerified: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
      }),
      prisma.user.count()
    ])
    sendSuccess(res, buildPaginatedResponse(users, total, { page, limit, skip }))
  } catch (e) { next(e) }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.update({
      where:  { id: req.params.id as string },
      data:   { role: req.body.role },
      select: { id: true, email: true, role: true }
    })
    sendSuccess(res, user, 'User role updated')
  } catch (e) { next(e) }
}

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req)
    const { status } = req.query

    const where = status ? { status: status as unknown as any } : {}
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
      }),
      prisma.order.count({ where })
    ])
    sendSuccess(res, buildPaginatedResponse(orders, total, { page, limit, skip }))
  } catch (e) { next(e) }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data:  { status: req.body.status }
    })
    sendSuccess(res, order, 'Order status updated')
  } catch (e) { next(e) }
}