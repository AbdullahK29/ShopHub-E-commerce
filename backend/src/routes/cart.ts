import { Router } from 'express'
import * as ctrl from '@/controllers/cartController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'
import { AddCartItemSchema, UpdateCartItemSchema, SyncCartSchema } from '@/validators/cart'

const router = Router()

// All cart routes require authentication
router.use(authenticate)

router.get( '/',                           ctrl.getCart)
router.post('/items',    validate(AddCartItemSchema),    ctrl.addItem)
router.put( '/items/:productId', validate(UpdateCartItemSchema), ctrl.updateItem)
router.delete('/items/:productId',         ctrl.removeItem)
router.delete('/',                         ctrl.clearCart)
router.post('/sync',     validate(SyncCartSchema),       ctrl.syncCart)

export default router