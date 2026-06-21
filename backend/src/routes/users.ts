import { Router } from 'express'
import * as ctrl from '@/controllers/userController'
import { authenticate } from '@/middleware/auth'

const router = Router()

router.use(authenticate)

router.get(   '/me',          ctrl.getProfile)
router.put(   '/me',          ctrl.updateProfile)
router.put(   '/me/password', ctrl.changePassword)
router.post(  '/me/wishlist/:productId', ctrl.addToWishlist)
router.delete('/me/wishlist/:productId', ctrl.removeFromWishlist)
router.get(   '/me/wishlist',            ctrl.getWishlist)

export default router