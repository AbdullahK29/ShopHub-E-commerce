// Validates all env variables at startup
// If anything is missing, the app crashes immediately with a clear error
// Better than crashing later when the missing value is actually used

import dotenv from 'dotenv'
dotenv.config()

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const env = {
  port:               parseInt(process.env.PORT || '5000'),
  nodeEnv:            process.env.NODE_ENV || 'development',
  isDev:              process.env.NODE_ENV !== 'production',

  databaseUrl:        requireEnv('DATABASE_URL'),

  jwtSecret:          requireEnv('JWT_SECRET'),
  jwtExpiresIn:       process.env.JWT_EXPIRES_IN    || '7d',
  jwtRefreshSecret:   requireEnv('JWT_REFRESH_SECRET'),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  frontendUrl:        process.env.FRONTEND_URL || 'http://localhost:3000',

  stripeSecretKey:    process.env.STRIPE_SECRET_KEY    || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

  emailHost:          process.env.EMAIL_HOST || '',
  emailPort:          parseInt(process.env.EMAIL_PORT || '587'),
  emailUser:          process.env.EMAIL_USER || '',
  emailPass:          process.env.EMAIL_PASS || '',
  emailFrom:          process.env.EMAIL_FROM || '',
}