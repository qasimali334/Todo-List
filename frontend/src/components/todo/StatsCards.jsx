import { CheckCircle2, Circle, AlertCircle, Layers } from 'lucide-react'

export function StatsCards({ todos = [] }) {
  const getStats = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const active = total - completed
    const overdue = todos.filter(
      t => !t.completed && t.dueDate && t.dueDate < todayStr
    ).length

    return { total, active, completed, overdue }
  }

  const { total, active, completed, overdue } = getStats()

  const statsList = [
    {
      label: 'Total Tasks',
      value: total,
      icon: Layers,
      colorClass: 'text-violet-650 dark:text-violet-400 border-violet-100 dark:border-violet-500/25',
      glowClass: 'bg-violet-600/5 dark:bg-violet-600/5'
    },
    {
      label: 'Active',
      value: active,
      icon: Circle,
      colorClass: 'text-sky-655 dark:text-sky-400 border-sky-100 dark:border-sky-500/25',
      glowClass: 'bg-sky-600/5'
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      colorClass: 'text-emerald-650 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/25',
      glowClass: 'bg-emerald-600/5'
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertCircle,
      colorClass: overdue > 0 
        ? 'text-rose-650 dark:text-rose-400 border-rose-100 dark:border-rose-500/25' 
        : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50',
      glowClass: overdue > 0 ? 'bg-rose-600/5' : 'bg-slate-600/5'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsList.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl border bg-white/40 dark:bg-slate-900/40 p-4.5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg ${stat.colorClass}`}
          >
            {/* Glowing background bubble */}
            <div className={`absolute -right-6 -bottom-6 h-20 w-20 rounded-full blur-2xl pointer-events-none ${stat.glowClass}`}></div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
              <Icon className="h-5 w-5 opacity-80" />
            </div>
            
            <div className="mt-2.5 flex items-baseline">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-300">
                {stat.value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
