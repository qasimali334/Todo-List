import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import todoRoutes from './routes/todos.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in this setup, or we can lock it to frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

// Root Endpoint / Health Check
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running smoothly' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
