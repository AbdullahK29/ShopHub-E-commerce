import { Router } from 'express'
import * as ctrl from '@/controllers/authController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'
import { RegisterSchema, LoginSchema } from '@/validators/auth'

const router = Router()

router.post('/register', validate(RegisterSchema), ctrl.register)
router.post('/login',    validate(LoginSchema),    ctrl.login)
router.post('/logout',   authenticate,             ctrl.logout)
router.post('/refresh',                            ctrl.refreshToken)
router.get( '/me',       authenticate,             ctrl.getMe)

export default router