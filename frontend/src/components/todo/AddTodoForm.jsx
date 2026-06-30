import { useState } from 'react'
import { Button } from '../ui/Button'
import { Calendar, Plus } from 'lucide-react'

export function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onAdd(title, priority, dueDate)
      // Reset form on success
      setTitle('')
      setPriority('medium')
      setDueDate('')
    } catch (err) {
      console.error('Failed to create todo', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 focus:ring-blue-500', activeClass: 'bg-blue-500 text-white border-blue-500' },
    { id: 'medium', label: 'Medium', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400 focus:ring-amber-500', activeClass: 'bg-amber-500 text-slate-950 border-amber-500 font-bold' },
    { id: 'high', label: 'High', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400 focus:ring-rose-500', activeClass: 'bg-rose-500 text-white border-rose-500' }
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900/40 p-5 backdrop-blur-md shadow-md space-y-4"
    >
      {/* Title Input */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-transparent text-lg font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border-none outline-none focus:ring-0 px-1 py-1"
          maxLength={100}
          required
        />
      </div>

      {/* Form Controls Row */}
      <div className="flex flex-col gap-4.5 pt-3 border-t border-slate-100 dark:border-slate-800/40 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Priority and Due Date Group */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Priority Pill Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority:</span>
            <div className="flex gap-1.5">
              {priorities.map((p) => {
                const isActive = priority === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium border transition-all duration-200 select-none cursor-pointer
                      ${
                        isActive
                          ? p.activeClass
                          : `bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-slate-950/40 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-200`
                      }`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-505" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white text-xs text-slate-600 border border-slate-200 dark:bg-slate-950/40 dark:text-slate-400 dark:border-slate-850 rounded-lg px-2 py-1.5 focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

        </div>

        {/* Action Button */}
        <Button
          type="submit"
          variant="primary"
          className="py-2.5 px-5 text-sm font-semibold sm:self-auto self-end cursor-pointer"
          isLoading={isSubmitting}
          disabled={!title.trim()}
        >
          <Plus className="h-4 w-4 mr-1.5 stroke-[2.5px]" /> Add Task
        </Button>

      </div>
    </form>
  )
}
