import { Router } from 'express'
import * as ctrl from '@/controllers/adminController'
import { authenticate, authorize } from '@/middleware/auth'

const router = Router()

router.use(authenticate, authorize('ADMIN'))

router.get('/stats',           ctrl.getDashboardStats)
router.get('/users',           ctrl.getUsers)
router.patch('/users/:id/role', ctrl.updateUserRole)
router.get('/orders',          ctrl.getAllOrders)
router.patch('/orders/:id/status', ctrl.updateOrderStatus)

export default router