import { Router, Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import { prisma } from '@/config/database'
import { authenticate } from '@/middleware/auth'
import { AuthRequest } from '@/types'
import { sendSuccess } from '@/utils/response'
import { env } from '@/config/environment'

const router = Router()
const stripe = new Stripe(env.stripeSecretKey)

// Create a payment intent — frontend uses this to collect card details
router.post('/create-intent', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, currency = 'usd' } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100), // Stripe works in cents
      currency,
      metadata: { userId: req.user!.id },
    })

    sendSuccess(res, {
      clientSecret:    paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (e) { next(e) }
})

// Stripe webhook — Stripe calls this when payment is confirmed
// This is how we know payment actually succeeded on Stripe's side
router.post('/webhook',
  // Raw body needed for Stripe signature verification
  // Add this BEFORE express.json() in server.ts for this route
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.stripeWebhookSecret
      )

      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object as any

        // Update payment and order status
        await prisma.payment.updateMany({
          where: { stripePaymentId: intent.id },
          data:  { status: 'COMPLETED' }
        })

        const payment = await prisma.payment.findFirst({
          where: { stripePaymentId: intent.id }
        })

        if (payment) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data:  { status: 'PAID', paymentStatus: 'COMPLETED' }
          })
        }
      }

      if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object as any
        await prisma.payment.updateMany({
          where: { stripePaymentId: intent.id },
          data:  { status: 'FAILED' }
        })
      }

      res.json({ received: true })
    } catch (err) {
      res.status(400).json({ error: 'Webhook error' })
    }
  }
)

export default router