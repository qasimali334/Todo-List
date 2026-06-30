import { ListTodo, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

export function Sidebar({ currentFilter, setCurrentFilter, todos = [] }) {
  // Helpers to calculate counts for side links
  const getCounts = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    const allCount = todos.length
    const todayCount = todos.filter(t => !t.completed && t.dueDate === todayStr).length
    const priorityCount = todos.filter(t => !t.completed && t.priority === 'high').length
    const completedCount = todos.filter(t => t.completed).length

    return { allCount, todayCount, priorityCount, completedCount }
  }

  const { allCount, todayCount, priorityCount, completedCount } = getCounts()

  const links = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: ListTodo,
      count: allCount,
      color: 'text-slate-400'
    },
    {
      id: 'today',
      label: 'Today',
      icon: Calendar,
      count: todayCount,
      color: 'text-emerald-400'
    },
    {
      id: 'priority',
      label: 'High Priority',
      icon: AlertCircle,
      count: priorityCount,
      color: 'text-amber-400'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: completedCount,
      color: 'text-indigo-400'
    }
  ]

  return (
    <aside className="w-full">
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = currentFilter === link.id

          return (
            <button
              key={link.id}
              onClick={() => setCurrentFilter(link.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap select-none cursor-pointer
                ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 text-violet-750 dark:from-violet-600/15 dark:to-indigo-600/15 dark:border-violet-500/20 dark:text-violet-400 shadow-sm shadow-violet-950/5'
                    : 'border border-transparent bg-slate-200/20 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:bg-slate-900/30 dark:text-slate-450 dark:hover:bg-slate-800/40 dark:hover:text-slate-200'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-violet-600 dark:text-violet-400' : link.color}`} />
                <span>{link.label}</span>
              </div>
              <span
                className={`flex h-5.5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs font-semibold leading-none transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-violet-100 text-violet-650 dark:bg-violet-400/20 dark:text-violet-400'
                      : 'bg-slate-200/80 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400'
                  }`}
              >
                {link.count}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
