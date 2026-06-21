import { z } from 'zod'

export const AddCartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity:  z.number().int().min(1).max(99),
})

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(99),
})

export const SyncCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity:  z.number().int().min(1),
  })),
})