import { z } from 'zod'

export const RegisterSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName:  z.string().min(2).max(50),
  email:     z.string().email(),
  password:  z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain number'),
})

export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const ResetPasswordSchema = z.object({
  token:    z.string(),
  password: z.string().min(8),
})