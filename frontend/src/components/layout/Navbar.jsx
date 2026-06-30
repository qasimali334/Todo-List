import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LogOut, Sun, Moon, CheckSquare } from 'lucide-react'

export function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useContext(AuthContext)

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2.5 transition-all duration-200 ${user ? 'pl-11' : ''}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-950/20 dark:shadow-violet-950/50">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-slate-350 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              TaskFlow
            </span>
          </div>
        </div>

        {/* User Actions Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* User Profile Info & Sign Out */}
          {user && (
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-805 pl-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 text-sm font-semibold text-violet-600 dark:text-violet-400 shadow-inner">
                  {getInitials(user.name)}
                </div>
                <div className="hidden flex-col md:flex">
                  <span className="text-sm font-semibold text-slate-850 dark:text-slate-200 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-455">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Log out */}
              <button
                onClick={logout}
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-red-900/30 dark:hover:bg-red-950/20 dark:hover:text-red-400 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
