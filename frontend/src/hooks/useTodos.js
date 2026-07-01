import { useContext, useState, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { TodoContext } from '../context/TodoContext'

const API_URL = import.meta.env.VITE_API_URL || 'todo-list-production-7c09.up.railway.app'

export function useTodos() {
  const { user } = useContext(AuthContext)
  const { todos, dispatch } = useContext(TodoContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Helper to construct request headers with token
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('todo_jwt_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }, [])

  // Fetch all user todos
  const fetchTodos = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'GET',
        headers: getHeaders()
      })

      if (!res.ok) {
        throw new Error('Failed to fetch todos from server')
      }

      const data = await res.json()
      dispatch({ type: 'SET_ALL', payload: data })
    } catch (err) {
      console.error('Error fetching todos', err)
      setError('Failed to fetch todos.')
    } finally {
      setLoading(false)
    }
  }, [user, dispatch, getHeaders])

  // Add a new todo
  const addTodo = async (title, priority, dueDate) => {
    if (!user) return
    setError(null)

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title,
          priority: priority || 'medium',
          dueDate: dueDate || null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add todo')
      }

      dispatch({ type: 'ADD', payload: data })
    } catch (err) {
      console.error('Error adding todo', err)
      setError('Failed to add todo.')
      throw err
    }
  }

  // Toggle todo completion (Optimistic UI with Rollback)
  const toggleTodo = async (id, forceFail = false) => {
    if (!user) return
    setError(null)

    const originalTodo = todos.find(t => t.id === id)
    if (!originalTodo) return

    // 1. Optimistic Update (Immediate UI response)
    dispatch({ type: 'TOGGLE', payload: id })

    try {
      if (forceFail) {
        throw new Error('Simulated network error')
      }

      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          completed: !originalTodo.completed
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update todo status')
      }
    } catch (err) {
      // 3. Rollback on Failure
      dispatch({
        type: 'UPDATE',
        payload: { id, updates: { completed: originalTodo.completed } }
      })
      setError('Failed to update todo status. Reverting.')
      console.warn('Optimistic toggle rolled back due to error:', err)
      throw err
    }
  }

  // Delete a todo (Optimistic UI with Rollback)
  const deleteTodo = async (id, forceFail = false) => {
    if (!user) return
    setError(null)

    const originalTodoIndex = todos.findIndex(t => t.id === id)
    if (originalTodoIndex === -1) return
    const originalTodos = [...todos]

    // 1. Optimistic Update (Immediate UI response)
    dispatch({ type: 'DELETE', payload: id })

    try {
      if (forceFail) {
        throw new Error('Simulated network error')
      }

      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete todo')
      }
    } catch (err) {
      // 3. Rollback on Failure
      dispatch({ type: 'SET_ALL', payload: originalTodos })
      setError('Failed to delete todo. Restoring.')
      console.warn('Optimistic delete rolled back due to error:', err)
      throw err
    }
  }

  // Update todo details (title, priority, due date)
  const updateTodo = async (id, updates) => {
    if (!user) return
    setError(null)

    const originalTodo = todos.find(t => t.id === id)
    if (!originalTodo) return

    // 1. Optimistic Update (Immediate UI response)
    dispatch({ type: 'UPDATE', payload: { id, updates } })

    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update todo details')
      }
    } catch (err) {
      // Rollback
      dispatch({ type: 'UPDATE', payload: { id, updates: originalTodo } })
      setError('Failed to update todo details.')
      throw err
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  }
}

