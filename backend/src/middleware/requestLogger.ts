import morgan from 'morgan'
import { logger } from '@/config/logger'
import { env } from '@/config/environment'

// Stream Morgan output through Winston
const stream = {
  write: (message: string) => logger.http(message.trim()),
}

export const requestLogger = morgan(
  env.isDev ? 'dev' : 'combined',
  { stream }
)