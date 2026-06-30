import { TodoItem } from './TodoItem'
import { CheckSquare } from 'lucide-react'

export function TodoList({
  todos = [],
  loading = false,
  onToggle,
  onDelete,
  onUpdate
}) {
  
  // Skeleton loading template
  if (loading) {
    return (
      <div className="space-y-3.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800/40 dark:bg-slate-900/10 p-4.5 animate-pulse"
          >
            <div className="flex flex-1 items-center gap-3.5">
              <div className="h-5.5 w-5.5 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex gap-2">
                  <div className="h-3.5 w-12 rounded bg-slate-200/60 dark:bg-slate-800/60"></div>
                  <div className="h-3.5 w-20 rounded bg-slate-200/60 dark:bg-slate-800/60"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state display
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/40 dark:border-slate-800/50 dark:bg-slate-900/10 p-12 text-center backdrop-blur-md shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 mb-4 shadow-inner">
          <CheckSquare className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No tasks found</h3>
        <p className="mt-1 text-sm text-slate-550 dark:text-slate-500 max-w-xs">
          Get started by adding a task or adjusting your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
