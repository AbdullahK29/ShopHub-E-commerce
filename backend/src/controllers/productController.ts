import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { sendSuccess, sendCreated } from '@/utils/response'
import { NotFoundError } from '@/utils/AppError'
import { getPagination, buildPaginatedResponse } from '@/utils/pagination'
import { AuthRequest } from '@/types'
import { withCache, cache } from '@/config/cache'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = getPagination(req)
    const { category, search, minPrice, maxPrice, minRating, sortBy } = req.query

    const where: Record<string, unknown> = { isActive: true }

    if (category) where.category = { slug: category as string }
    if (search) {
      where.OR = [
        { name:        { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ]
    }
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice as string) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice as string) } : {}),
      }
    }
    if (minRating) where.rating = { gte: parseFloat(minRating as string) }

    type OrderByType = Record<string, string>
    const orderByMap: Record<string, OrderByType> = {
      'price-asc':  { price: 'asc'  },
      'price-desc': { price: 'desc' },
      'rating':     { rating: 'desc' },
      'newest':     { createdAt: 'desc' },
      'featured':   { reviewCount: 'desc' },
    }
    const orderBy = orderByMap[(sortBy as string) || 'featured'] || orderByMap.featured

    const fetchFromDB = async () => {
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { category: { select: { id: true, name: true, slug: true } } },
          orderBy, skip, take: limit,
        }),
        prisma.product.count({ where }),
      ])
      return buildPaginatedResponse(products, total, { page, limit, skip })
    }

    // Only cache simple unfiltered requests
    // Build a unique cache key — different for every filter combination
    const hasFilters = category || search || minPrice || maxPrice || minRating
    const cacheKey   = `products:${sortBy || 'featured'}:p${page}:l${limit}:cat${category || 'all'}`

    const result = hasFilters
      ? await fetchFromDB()                        // filtered → no cache, always fresh
      : await withCache(cacheKey, fetchFromDB, 300) // unfiltered → cache 5 min

    sendSuccess(res, result)
  } catch (e) { next(e) }
}

export const getProductById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const product = await withCache(
      `product:${req.params.id}`,
      async () => {
        const p = await prisma.product.findUnique({
          where:   { id: req.params.id, isActive: true },
          include: {
            category: true,
            reviews: {
              include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
              orderBy: { createdAt: 'desc' },
              take:    10,
            },
          },
        })
        if (!p) throw new NotFoundError('Product not found')
        return p
      },
      600  // cache product pages for 10 minutes
    )

    sendSuccess(res, product)
  } catch (e) { next(e) }
}

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.create({
      data: { ...req.body, vendorId: req.user!.id },
      include: { category: true },
    })
    sendCreated(res, product, 'Product created successfully')
  } catch (e) { next(e) }
}

export const updateProduct = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.update({
      where:   { id: req.params.id },
      data:    req.body,
      include: { category: true },
    })
    // Clear cache for this product
    await cache.del(`product:${req.params.id}`)
    sendSuccess(res, product, 'Product updated successfully')
  } catch (e) { next(e) }
}

export const deleteProduct = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    // Soft delete — just mark as inactive instead of removing from DB
    await prisma.product.update({
      where: { id: req.params.id },
      data:  { isActive: false },
    })
    // Clear cache for this product
    await cache.del(`product:${req.params.id}`)
    sendSuccess(res, null, 'Product deleted successfully')
  } catch (e) { next(e) }
}