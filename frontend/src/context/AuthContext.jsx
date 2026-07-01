import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'https://todo-list-production-7c09.up.railway.app/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize: Check localStorage for existing JWT session
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('todo_jwt_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error('Session verification failed')
        }

        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error('Error verifying stored token session', error)
        localStorage.removeItem('todo_jwt_token')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [])

  // Register a new user
  const register = async (name, email, password) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('todo_jwt_token', data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      console.error('Registration error:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Log in an existing user
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('todo_jwt_token', data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      console.error('Login error:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Authenticate using Supabase OAuth token
  const loginWithSupabaseToken = async (accessToken) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: accessToken })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Google login failed')
      }

      localStorage.setItem('todo_jwt_token', data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      console.error('Google login error:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Log out current user
  const logout = () => {
    localStorage.removeItem('todo_jwt_token')
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
    loginWithSupabaseToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

