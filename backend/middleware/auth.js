import jwt from 'jsonwebtoken'
import { dbService } from '../services/dbService.js'

const protect = async (req, res, next) => {
  let token

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token (exclude password) and attach to request object
      req.user = await dbService.findUserById(decoded.id)
      
      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' })
      }

      next()
    } catch (error) {
      console.error('Token verification failed:', error.message)
      return res.status(401).json({ error: 'Not authorized, token invalid or expired' })
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' })
  }
}

export { protect }
