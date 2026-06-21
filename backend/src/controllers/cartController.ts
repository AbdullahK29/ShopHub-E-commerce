import { Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { AuthRequest } from '@/types'
import { sendSuccess } from '@/utils/response'
import { NotFoundError, ValidationError } from '@/utils/AppError'

// Helper — get or create cart for a user
async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where:  { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { category: { select: { id: true, name: true, slug: true } } }
          }
        }
      }
    }
  })
}

// Helper — format cart with calculated totals
function formatCart(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  const total = cart.items.reduce((sum, item) => {
    const price = Number(item.product.discountPrice ?? item.product.price)
    return sum + price * item.quantity
  }, 0)

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return { ...cart, total, itemCount }
}

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req.user!.id)
    sendSuccess(res, formatCart(cart))
  } catch (e) { next(e) }
}

export const addItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body

    // Verify product exists and has enough stock
    const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } })
    if (!product) throw new NotFoundError('Product not found')
    if (product.stockQuantity < quantity) {
      throw new ValidationError(`Only ${product.stockQuantity} units available`)
    }

    const cart = await getOrCreateCart(req.user!.id)

    // Check if item already in cart
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } }
    })

    if (existing) {
      const newQty = existing.quantity + quantity
      if (newQty > product.stockQuantity) {
        throw new ValidationError(`Cannot add more — only ${product.stockQuantity} in stock`)
      }
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data:  { quantity: newQty }
      })
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      })
    }

    const updatedCart = await getOrCreateCart(req.user!.id)
    sendSuccess(res, formatCart(updatedCart), 'Item added to cart')
  } catch (e) { next(e) }
}

export const updateItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId as string
    const { quantity }  = req.body

    const cart = await getOrCreateCart(req.user!.id)

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, productId }
      })
    } else {
      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) throw new NotFoundError('Product not found')
      if (quantity > product.stockQuantity) {
        throw new ValidationError(`Only ${product.stockQuantity} available`)
      }

      await prisma.cartItem.updateMany({
        where: { cartId: cart.id, productId },
        data:  { quantity }
      })
    }

    const updatedCart = await getOrCreateCart(req.user!.id)
    sendSuccess(res, formatCart(updatedCart), 'Cart updated')
  } catch (e) { next(e) }
}

export const removeItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req.user!.id)
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId: req.params.productId as string }
    })
    const updatedCart = await getOrCreateCart(req.user!.id)
    sendSuccess(res, formatCart(updatedCart), 'Item removed')
  } catch (e) { next(e) }
}

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await getOrCreateCart(req.user!.id)
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    sendSuccess(res, formatCart(cart), 'Cart cleared')
  } catch (e) { next(e) }
}

// Sync localStorage cart when user logs in
export const syncCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body as { items: { productId: string; quantity: number }[] }
    const cart = await getOrCreateCart(req.user!.id)

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId, isActive: true } })
      if (!product) continue

      const quantity = Math.min(item.quantity, product.stockQuantity)
      if (quantity <= 0) continue

      await prisma.cartItem.upsert({
        where:  { cartId_productId: { cartId: cart.id, productId: item.productId } },
        update: { quantity },
        create: { cartId: cart.id, productId: item.productId, quantity },
      })
    }

    const updatedCart = await getOrCreateCart(req.user!.id)
    sendSuccess(res, formatCart(updatedCart), 'Cart synced')
  } catch (e) { next(e) }
}