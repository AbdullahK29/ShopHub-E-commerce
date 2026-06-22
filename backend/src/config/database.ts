// backend/src/config/database.ts
import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

// Singleton pattern — one Prisma instance for the whole app
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma = global.__prisma ?? new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn'  },
  ],
})

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

// Log warnings
prisma.$on('warn' as never, (e: { message: string }) => {
  logger.warn(e.message)
})

prisma.$on('error' as never, (e: { message: string }) => {
  logger.error(e.message)
})