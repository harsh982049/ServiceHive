import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import eventRoutes from './routes/event.routes.js'
import swapRoutes from './routes/swap.routes.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// ✅ CORS FIRST (and explicit options)
const corsOptions = {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}
app.use(cors(corsOptions))

app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api', swapRoutes) // swappable-slots, swap-request, swap-requests, swap-response

// central error handler
app.use(errorHandler)

export default app
