import express from 'express'
import { dbService } from '../services/dbService.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Apply protect middleware to all routes in this file
router.use(protect)

// @desc    Get all user todos
// @route   GET /api/todos
// @access  Private
router.get('/', async (req, res) => {
  try {
    const formattedTodos = await dbService.getTodos(req.user._id)
    res.json(formattedTodos)
  } catch (error) {
    console.error('Fetch todos error:', error.message)
    res.status(500).json({ error: 'Server error fetching todos' })
  }
})

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const todo = await dbService.createTodo(
      req.user._id,
      title,
      priority,
      dueDate
    )

    res.status(201).json(todo)
  } catch (error) {
    console.error('Create todo error:', error.message)
    res.status(500).json({ error: 'Server error creating todo' })
  }
})

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const todoId = req.params.id
    const userId = req.user._id
    
    // Extract allowed fields to update
    const { title, completed, priority, dueDate } = req.body

    const updatedTodo = await dbService.updateTodo(todoId, userId, {
      title,
      completed,
      priority,
      dueDate
    })

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found or not authorized' })
    }

    res.json(updatedTodo)
  } catch (error) {
    console.error('Update todo error:', error.message)
    if (error.message === 'Not authorized') {
      return res.status(403).json({ error: 'Not authorized to update this todo' })
    }
    res.status(500).json({ error: 'Server error updating todo' })
  }
})

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id
    const userId = req.user._id

    const deletedInfo = await dbService.deleteTodo(todoId, userId)

    if (!deletedInfo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    res.json({ message: 'Todo deleted successfully', id: todoId })
  } catch (error) {
    console.error('Delete todo error:', error.message)
    if (error.message === 'Not authorized') {
      return res.status(403).json({ error: 'Not authorized to delete this todo' })
    }
    res.status(500).json({ error: 'Server error deleting todo' })
  }
})

export default router
