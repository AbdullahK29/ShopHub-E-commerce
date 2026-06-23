import { Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { AuthRequest } from '@/types'
import { sendSuccess, sendCreated } from '@/utils/response'
import { NotFoundError, ValidationError, ForbiddenError } from '@/utils/AppError'
import { getPagination, buildPaginatedResponse } from '@/utils/pagination'
import { io } from '@/index'

// Generate readable order number: ORD-20241201-XXXX
function generateOrderNumber(): string {
  const date   = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${date}-${random}`
}

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
      notes
    } = req.body

    // ✅ VALIDATION
    if (!items || items.length === 0) {
      throw new ValidationError('Cart is empty')
    }

    // ✅ CALCULATE TOTALS (from request items)
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price || 0) * item.quantity
    }, 0)

    const shippingCost = subtotal >= 50 ? 0 : 9.99
    const tax = subtotal * 0.08
    const totalAmount = subtotal + shippingCost + tax

    const order = await prisma.$transaction(async (tx) => {

      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          totalAmount,
          subtotal,
          shippingCost,
          tax,
          paymentMethod,
          shippingAddress,
          notes,

          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.price
            }))
          },

          ...(paymentIntentId ? {
            payment: {
              create: {
                amount: totalAmount,
                status: 'PENDING',
                paymentMethod,
                stripePaymentId: paymentIntentId,
              }
            }
          } : {})
        },
        include: { items: true }
      })

      // ✅ STOCK UPDATE
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        })
      }

      return newOrder
    })

    io.to(`user:${userId}`).emit('orderCreated', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.totalAmount,
    })

    sendCreated(res, order, 'Order placed successfully')

  } catch (e) {
    next(e)
  }
}

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req)
    const userId = req.user!.id

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where:   { userId },
        include: {
          items:    { include: { product: { select: { id: true, name: true, images: true } } } },
          shipment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } })
    ])

    sendSuccess(res, buildPaginatedResponse(orders, total, { page, limit, skip }))
  } catch (e) { next(e) }
}

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where:   { id: req.params.id as string },
      include: {
        items:    { include: { product: true } },
        payment:  true,
        shipment: true,
      }
    })

    if (!order) throw new NotFoundError('Order not found')

    // Users can only see their own orders (admins can see all)
    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Access denied')
    }

    sendSuccess(res, order)
  } catch (e) { next(e) }
}

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id as string } })

    if (!order) throw new NotFoundError('Order not found')
    if (order.userId !== req.user!.id) throw new ForbiddenError('Access denied')

    // Can only cancel pending or processing orders
    if (!["PENDING", "PROCESSING"].includes(order.status)) {
      throw new ValidationError(`Cannot cancel an order with status: ${order.status}`)
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id as string },
      data:  { status: 'CANCELLED' }
    })

    sendSuccess(res, updated, 'Order cancelled successfully')
  } catch (e) { next(e) }
}