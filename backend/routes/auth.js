import express from 'express'
import jwt from 'jsonwebtoken'
import { dbService } from '../services/dbService.js'
import { protect } from '../middleware/auth.js'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'

const router = express.Router()

// Helper to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Basic Fields Presence
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' })
    }

    // 2. Name Validation
    if (!name.trim()) {
      return res.status(400).json({ error: 'Name cannot be blank' })
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' })
    }

    // 3. Email Format Validation
    const emailNormalized = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailNormalized)) {
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    // 4. Password Strength Validation
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    // 5. Check if user already exists
    const userExists = await dbService.findUserByEmail(emailNormalized)
    if (userExists) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    // Create user
    const user = await dbService.createUser(name, email, password)

    if (user) {
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({ error: 'Invalid user data' })
    }
  } catch (error) {
    console.error('Registration error:', error.message)
    res.status(500).json({ error: 'Server error during registration' })
  }
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' })
    }

    // Email format validation before database lookup
    const emailNormalized = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailNormalized)) {
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    // Find user by email
    const user = await dbService.findUserByEmail(emailNormalized)
    
    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: 'This email is not registered. Please create an account.' })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token: generateToken(user._id)
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ error: 'Server error during login' })
  }
})

// @desc    Authenticate with Supabase Google Access Token
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { access_token } = req.body

    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' })
    }

    if (!isSupabaseConfigured()) {
      return res.status(500).json({ error: 'Supabase database is not configured' })
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(access_token)

    if (error || !user) {
      console.error('Supabase token verification failed:', error?.message)
      return res.status(401).json({ error: 'Invalid Google session token' })
    }

    const email = user.email
    const emailNormalized = email.toLowerCase().trim()
    const name = user.user_metadata?.full_name || email.split('@')[0]

    // Check if user already exists in custom users table
    let appUser = await dbService.findUserByEmail(emailNormalized)

    if (!appUser) {
      // User doesn't exist, register them
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      appUser = await dbService.createUser(name, emailNormalized, randomPassword, user.id)
    }

    res.json({
      user: {
        id: appUser._id,
        name: appUser.name,
        email: appUser.email,
        createdAt: appUser.createdAt
      },
      token: generateToken(appUser._id)
    })
  } catch (error) {
    console.error('Google OAuth backend error:', error.message)
    res.status(500).json({ error: 'Server error during Google authentication' })
  }
})

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private (JWT token required)
router.get('/me', protect, async (req, res) => {
  try {
    // req.user was populated by the protect middleware
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    })
  } catch (error) {
    console.error('Get profile error:', error.message)
    res.status(500).json({ error: 'Server error retrieving user data' })
  }
})

export default router
