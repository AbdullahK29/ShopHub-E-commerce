import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/environment'
import { requestLogger } from './middleware/requestLogger'
import { errorHandler } from './middleware/errorHandler'
import { swaggerSpec } from './config/swagger'
// Add with other imports
import paymentRoutes from './routes/payments'
import adminRoutes from './routes/admin'


// Route imports (we'll add these as we build each feature)
import authRoutes    from './routes/auth'
import productRoutes from './routes/products'
import categoryRoutes from './routes/categories'
import cartRoutes    from './routes/cart'
import orderRoutes   from './routes/orders'
import userRoutes    from './routes/users'

const app = express()

// ─── Security Middleware ──────────────────────────────────────────────────────
app.set('trust proxy', 1) // ADD THIS LINE
// Helmet sets secure HTTP headers (prevents XSS, clickjacking, etc.)
app.use(helmet())

// CORS — only allow requests from our frontend
app.use(cors({
  origin:      env.frontendUrl,
  credentials: true,    // allow cookies
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting — max 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders:   false,
}))

// Stricter limit for auth endpoints — prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Too many login attempts, please try again in 15 minutes' },
})

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(requestLogger)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ShopHub API is running', timestamp: new Date().toISOString() })
})

// ─── API Documentation ────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       authLimiter, authRoutes)
app.use('/api/products',               productRoutes)
app.use('/api/categories',             categoryRoutes)
app.use('/api/cart',                   cartRoutes)
app.use('/api/orders',                 orderRoutes)
app.use('/api/users',                  userRoutes)
app.use('/api/admin',                  adminRoutes)
// Add with other routes
app.use('/api/payments',               paymentRoutes)

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── Global Error Handler (MUST be last) ─────────────────────────────────────
app.use(errorHandler)

export default app