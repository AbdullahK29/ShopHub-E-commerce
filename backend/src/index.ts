import { createServer } from 'http'
import { Server, type Socket } from 'socket.io'
import app from './server'
import { env } from './config/environment'
import { prisma } from './config/database'
import { logger } from './config/logger'

const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin:      env.frontendUrl,
    credentials: true,
  },
})

io.on('connection', (socket: Socket) => {
  logger.info(`Socket connected: ${socket.id}`)

  // User joins their personal room — so we can send them private updates
  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`)
    logger.info(`User ${userId} joined their room`)
  })

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`)
  })
})

async function main() {
  try {
    await prisma.$connect()
    logger.info('✅ Database connected')

    httpServer.listen(env.port, () => {
      logger.info(`🚀 ShopHub API running on http://localhost:${env.port}`)
      logger.info(`🔌 WebSocket server ready`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0) })
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0) })

main()