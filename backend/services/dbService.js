import bcrypt from 'bcryptjs'
import { supabase } from '../config/supabase.js'

const checkSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check your environment variables.')
  }
}

export const dbService = {
  // --- AUTH SERVICES ---

  // Find user by email
  findUserByEmail: async (email) => {
    checkSupabase()
    const emailNormalized = email.toLowerCase().trim()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailNormalized)
      .maybeSingle()

    if (error) {
      console.error('Supabase findUserByEmail error:', error.message)
      throw new Error(error.message)
    }

    if (!data) return null

    return {
      _id: data.id,
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.created_at,
      matchPassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
      }
    }
  },

  // Find user by ID
  findUserById: async (id) => {
    checkSupabase()
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    if (!isUUID) return null

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Supabase findUserById error:', error.message)
      throw new Error(error.message)
    }

    if (!data) return null

    return {
      _id: data.id,
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.created_at
    }
  },

  // Create new user
  createUser: async (name, email, password, id = null) => {
    checkSupabase()
    const emailNormalized = email.toLowerCase().trim()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const insertData = {
      name: name.trim(),
      email: emailNormalized,
      password: hashedPassword
    }

    if (id) {
      insertData.id = id
    }

    const { data, error } = await supabase
      .from('users')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase createUser error:', error.message)
      throw new Error(error.message)
    }

    return {
      _id: data.id,
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.created_at
    }
  },

  // --- TODO SERVICES ---

  // Get todos for user
  getTodos: async (userId) => {
    checkSupabase()
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
    if (!isUUID) return []

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase getTodos error:', error.message)
      throw new Error(error.message)
    }

    return data.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      priority: todo.priority,
      dueDate: todo.due_date,
      createdAt: todo.created_at
    }))
  },

  // Create todo
  createTodo: async (userId, title, priority, dueDate) => {
    checkSupabase()
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
    if (!isUUID) throw new Error('Invalid user ID format')

    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: title.trim(),
        priority: priority || 'medium',
        due_date: dueDate || null
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase createTodo error:', error.message)
      throw new Error(error.message)
    }

    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      priority: data.priority,
      dueDate: data.due_date,
      createdAt: data.created_at
    }
  },

  // Update todo
  updateTodo: async (todoId, userId, updates) => {
    checkSupabase()
    const isTodoUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todoId)
    const isUserUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
    if (!isTodoUUID || !isUserUUID) return null

    const supabaseUpdates = {}
    if (updates.title !== undefined) supabaseUpdates.title = updates.title.trim()
    if (updates.completed !== undefined) supabaseUpdates.completed = updates.completed
    if (updates.priority !== undefined) supabaseUpdates.priority = updates.priority
    if (updates.dueDate !== undefined) supabaseUpdates.due_date = updates.dueDate

    const { data, error } = await supabase
      .from('todos')
      .update(supabaseUpdates)
      .eq('id', todoId)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) {
      console.error('Supabase updateTodo error:', error.message)
      throw new Error(error.message)
    }

    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      priority: data.priority,
      dueDate: data.due_date,
      createdAt: data.created_at
    }
  },

  // Delete todo
  deleteTodo: async (todoId, userId) => {
    checkSupabase()
    const isTodoUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todoId)
    const isUserUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
    if (!isTodoUUID || !isUserUUID) return null

    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) {
      console.error('Supabase deleteTodo error:', error.message)
      throw new Error(error.message)
    }

    if (!data) return null
    return { id: todoId }
  }
}
