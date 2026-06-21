import { z } from 'zod'

export const CreateProductSchema = z.object({
  name:          z.string().min(2).max(200),
  description:   z.string().min(10),
  price:         z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0),
  categoryId:    z.string().uuid(),
  images:        z.array(z.string().url()).min(1),
  sku:           z.string().min(2).max(50),
})

export const UpdateProductSchema = CreateProductSchema.partial()