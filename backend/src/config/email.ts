import nodemailer from 'nodemailer'
import { env } from './environment'
import { logger } from './logger'

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: env.emailPort === 465,
  auth: { user: env.emailUser, pass: env.emailPass },
})

interface SendEmailOptions {
  to:      string
  subject: string
  html:    string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    await transporter.sendMail({ from: env.emailFrom, to, subject, html })
    logger.info(`Email sent to ${to}: ${subject}`)
  } catch (error) {
    logger.error('Failed to send email:', error)
    // Don't throw — email failure shouldn't break the request
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

export function orderConfirmationEmail(order: {
  orderNumber: string
  totalAmount: number
  items: { product: { name: string }; quantity: number; unitPrice: number }[]
}) {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${item.product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align:center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align:right;">$${item.unitPrice.toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0;">ShopHub</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #1a1a1a;">Order Confirmed! 🎉</h2>
        <p style="color: #555;">Your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="background: #f8f8f8;">
              <th style="padding: 12px 8px; text-align: left;">Product</th>
              <th style="padding: 12px 8px; text-align: center;">Qty</th>
              <th style="padding: 12px 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #1D9E75;">
          Total: $${Number(order.totalAmount).toFixed(2)}
        </div>
        <div style="margin-top: 32px; padding: 16px; background: #f0fdf4; border-radius: 8px;">
          <p style="margin: 0; color: #166534;">Thank you for shopping with ShopHub!</p>
        </div>
      </div>
    </div>
  `
}

export function welcomeEmail(firstName: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0;">ShopHub</h1>
      </div>
      <div style="padding: 32px;">
        <h2>Welcome, ${firstName}! 👋</h2>
        <p style="color: #555;">Your account has been created successfully. Start exploring thousands of premium products.</p>
        <a href="${env.frontendUrl}/products" style="display:inline-block; background:#1D9E75; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
          Start Shopping
        </a>
      </div>
    </div>
  `
}

export function passwordResetEmail(resetUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1D9E75; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0;">ShopHub</h1>
      </div>
      <div style="padding: 32px;">
        <h2>Reset Your Password</h2>
        <p style="color: #555;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block; background:#1D9E75; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
          Reset Password
        </a>
        <p style="color:#999; font-size:12px; margin-top:24px;">If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `
}