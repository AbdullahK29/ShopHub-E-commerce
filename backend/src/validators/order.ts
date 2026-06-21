import { z } from 'zod'

export const CreateOrderSchema = z.object({
  shippingAddress: z.object({
    street:     z.string().min(1),
    city:       z.string().min(1),
    state:      z.string().min(1),
    postalCode: z.string().min(1),
    country:    z.string().min(1),
  }),
  paymentMethod:   z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
  paymentIntentId: z.string().optional(),
  notes:           z.string().optional(),
})