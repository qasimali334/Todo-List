import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { supabase, isSupabaseConfigured } from '../config/supabase.js'

const DB_FILE = path.resolve('data/db.json')

// Helper to read JSON DB
const readJSONDb = () => {
  try {
    const dir = path.dirname(DB_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], todos: [] }, null, 2))
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
  } catch (e) {
    console.error('Error reading local JSON db:', e)
    return { users: [], todos: [] }
  }
}

// Helper to write JSON DB
const writeJSONDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('Error writing to local JSON db:', e)
  }
}

export const dbService = {
  // --- AUTH SERVICES ---

  // Find user by email
  findUserByEmail: async (email) => {
    const emailNormalized = email.toLowerCase().trim()

    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailNormalized)
        .maybeSingle()

      if (error) {
        console.error('Supabase findUserByEmail error:', error.message)
      } else if (data) {
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
      }
    }
    
    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    const found = db.users.find(u => u.email === emailNormalized)
    if (!found) return null
    
    return {
      _id: found.id,
      id: found.id,
      name: found.name,
      email: found.email,
      password: found.password,
      createdAt: found.createdAt,
      matchPassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
      }
    }
  },

  // Find user by ID
  findUserById: async (id) => {
    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      if (!isUUID) return null

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        console.error('Supabase findUserById error:', error.message)
      } else if (data) {
        return {
          _id: data.id,
          id: data.id,
          name: data.name,
          email: data.email,
          createdAt: data.created_at
        }
      }
    }

    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    const found = db.users.find(u => u.id === id)
    if (!found) return null

    return {
      _id: found.id,
      id: found.id,
      name: found.name,
      email: found.email,
      createdAt: found.createdAt
    }
  },

  // Create new user
  createUser: async (name, email, password, id = null) => {
    const emailNormalized = email.toLowerCase().trim()

    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
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
    }

    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    const exists = db.users.some(u => u.email === emailNormalized)
    if (exists) {
      throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = {
      id: id || (Math.random().toString(36).substring(2, 15) + Date.now().toString(36)),
      name: name.trim(),
      email: emailNormalized,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    db.users.push(newUser)
    writeJSONDb(db)

    return {
      _id: newUser.id,
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  },

  // --- TODO SERVICES ---

  // Get todos for user
  getTodos: async (userId) => {
    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
      if (!isUUID) return []

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase getTodos error:', error.message)
      } else {
        return data.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          priority: todo.priority,
          dueDate: todo.due_date,
          createdAt: todo.created_at
        }))
      }
    }

    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    return db.todos
      .filter(t => t.user === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  // Create todo
  createTodo: async (userId, title, priority, dueDate) => {
    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
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
    }

    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    const newTodo = {
      id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
      user: userId,
      title: title.trim(),
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    }

    db.todos.unshift(newTodo)
    writeJSONDb(db)

    return newTodo
  },

  // Update todo
  updateTodo: async (todoId, userId, updates) => {
    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
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
    }

    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    const index = db.todos.findIndex(t => t.id === todoId)
    if (index === -1) return null
    
    const todo = db.todos[index]
    if (todo.user !== userId) {
      throw new Error('Not authorized')
    }

    if (updates.title !== undefined) todo.title = updates.title.trim()
    if (updates.completed !== undefined) todo.completed = updates.completed
    if (updates.priority !== undefined) todo.priority = updates.priority
    if (updates.dueDate !== undefined) todo.dueDate = updates.dueDate

    db.todos[index] = todo
    writeJSONDb(db)

    return todo
  },

  // Delete todo
  deleteTodo: async (todoId, userId) => {
    // 1. Supabase Tier
    if (isSupabaseConfigured()) {
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

    // 2. Local JSON Tier Fallback
    const db = readJSONDb()
    const index = db.todos.findIndex(t => t.id === todoId)
    if (index === -1) return null

    const todo = db.todos[index]
    if (todo.user !== userId) {
      throw new Error('Not authorized')
    }

    db.todos.splice(index, 1)
    writeJSONDb(db)

    return { id: todoId }
  }
}
