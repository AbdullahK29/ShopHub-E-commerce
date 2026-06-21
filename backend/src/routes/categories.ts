import { Router } from 'express'
import { prisma } from '@/config/database'
import { sendSuccess } from '@/utils/response'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    })
    sendSuccess(res, categories)
  } catch (e) { next(e) }
})

export default router