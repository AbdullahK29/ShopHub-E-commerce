import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { logger } from './logger'
import { env } from './environment'

// Singleton pattern — one Prisma instance for the whole app
// In development, prevent hot-reloading from creating multiple instances
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma = global.__prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.databaseUrl }),
  log: [
    { emit: 'event', level: 'query'  },
    { emit: 'event', level: 'error'  },
    { emit: 'event', level: 'warn'   },
  ],
})

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

// Log slow queries in development
prisma.$on('query' as never, (e: { query: string; duration: number }) => {
  if (e.duration > 2000) {
    logger.warn(`Slow query (${e.duration}ms): ${e.query}`)
  }
})