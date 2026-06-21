import { Router } from 'express'
import * as ctrl from '@/controllers/orderController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'
import { CreateOrderSchema } from '@/validators/order'

const router = Router()

router.use(authenticate)

router.post('/',                          validate(CreateOrderSchema), ctrl.createOrder)
router.get( '/',                                                       ctrl.getOrders)
router.get( '/:id',                                                    ctrl.getOrderById)
router.patch('/:id/cancel',                                            ctrl.cancelOrder)

export default router