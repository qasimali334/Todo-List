import { Search } from 'lucide-react'

export function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}) {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-100/50 p-3 rounded-2xl border border-slate-200 dark:bg-slate-900/20 dark:border-slate-800/60 backdrop-blur-md transition-colors duration-200">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-505" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40 py-2 pl-9.5 pr-4 text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition-all focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          placeholder="Search tasks..."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-slate-200/50 p-1 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 select-none cursor-pointer
                ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-205'
                }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
