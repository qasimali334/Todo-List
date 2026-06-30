import { useState, useRef, useEffect } from 'react'
import { Check, Trash2, Edit2, Calendar, AlertCircle } from 'lucide-react'

export function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const inputRef = useRef(null)

  // Sync edit title if external props change (e.g. rollback)
  useEffect(() => {
    setEditTitle(todo.title)
  }, [todo.title])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title)
      setIsEditing(false)
    }
  }

  // Priority styling definitions
  const priorityBadges = {
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/25'
  }

  // Date Formatting helper
  const getDueDateInfo = (dateStr) => {
    if (!dateStr) return null
    
    const todayStr = new Date().toISOString().split('T')[0]
    const dateObj = new Date(dateStr)
    const todayObj = new Date(todayStr)
    
    // Calculate difference in days
    const diffTime = dateObj - todayObj
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const formattedDate = dateObj.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    })

    if (todo.completed) {
      return { text: `Completed · Due ${formattedDate}`, isOverdue: false, labelClass: 'text-slate-400 dark:text-slate-505' }
    }

    if (diffDays < 0) {
      return { text: `Overdue (${formattedDate})`, isOverdue: true, labelClass: 'text-rose-600 dark:text-rose-400 font-medium' }
    } else if (diffDays === 0) {
      return { text: 'Today', isOverdue: false, labelClass: 'text-amber-600 dark:text-amber-400 font-semibold' }
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', isOverdue: false, labelClass: 'text-sky-600 dark:text-sky-400 font-medium' }
    }
    return { text: formattedDate, isOverdue: false, labelClass: 'text-slate-500 dark:text-slate-400' }
  }

  const dateInfo = getDueDateInfo(todo.dueDate)

  return (
    <div
      className={`group flex items-center justify-between gap-4 rounded-xl border p-4.5 transition-all duration-200 backdrop-blur-md select-none
        ${
          todo.completed
            ? 'bg-slate-100/50 border-slate-200/50 dark:bg-slate-900/10 dark:border-slate-950/30 opacity-60'
            : 'bg-white border-slate-200 hover:bg-slate-50/50 hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-800/80 dark:hover:bg-slate-900/60 dark:hover:border-slate-700/80 hover:shadow-sm'
        }`}
    >
      <div className="flex flex-1 items-center gap-3.5 min-w-0">
        
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer
            ${
              todo.completed
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-950/20'
                : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950/40 text-transparent hover:border-slate-450 dark:hover:border-slate-500'
            }`}
        >
          <Check className="h-3.5 w-3.5 stroke-[3px]" />
        </button>

        {/* Todo Details */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full bg-white dark:bg-slate-950/80 border border-violet-500 rounded px-2 py-0.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-violet-500"
            />
          ) : (
            <span
              onDoubleClick={() => setIsEditing(true)}
              className={`block truncate text-sm font-semibold transition-all duration-200 cursor-text
                ${
                  todo.completed
                    ? 'text-slate-400 dark:text-slate-505 line-through'
                    : 'text-slate-800 dark:text-slate-202 group-hover:text-slate-950 dark:group-hover:text-white'
                }`}
              title="Double click to edit"
            >
              {todo.title}
            </span>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-3.5 mt-1.5 flex-wrap">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
                priorityBadges[todo.priority]
              }`}
            >
              {todo.priority}
            </span>

            {/* Due Date Indicator */}
            {dateInfo && (
              <span className={`inline-flex items-center gap-1 text-[11px] ${dateInfo.labelClass}`}>
                {dateInfo.isOverdue ? (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                )}
                <span>{dateInfo.text}</span>
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        
        {/* Toggle Edit Button */}
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Edit task title"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
          title="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

      </div>
    </div>
  )
}
