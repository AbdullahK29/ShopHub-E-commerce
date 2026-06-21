import { Router } from 'express'
import * as ctrl from '@/controllers/productController'
import { authenticate, authorize } from '@/middleware/auth'
import { validate } from '@/middleware/validate'
import { CreateProductSchema, UpdateProductSchema } from '@/validators/product'

const router = Router()

// Public routes
router.get('/',      ctrl.getProducts)
router.get('/:id',   ctrl.getProductById)

// Protected routes (Admin only)
router.post(  '/',     authenticate, authorize('ADMIN'), validate(CreateProductSchema), ctrl.createProduct)
router.put(   '/:id',  authenticate, authorize('ADMIN'), validate(UpdateProductSchema), ctrl.updateProduct)
router.delete('/:id',  authenticate, authorize('ADMIN'),                                ctrl.deleteProduct)

export default router