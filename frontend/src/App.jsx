import { useState, useEffect, useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { useTodos } from './hooks/useTodos'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'
import { StatsCards } from './components/todo/StatsCards'
import { AddTodoForm } from './components/todo/AddTodoForm'
import { FilterBar } from './components/todo/FilterBar'
import { TodoList } from './components/todo/TodoList'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { AlertCircle, X, CheckSquare, Menu, LogOut } from 'lucide-react'

function App() {
  const { isAuthenticated, isLoading, user, logout, loginWithSupabaseToken } = useContext(AuthContext)
  const [authView, setAuthView] = useState('login') // 'login' | 'register'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('todo_theme') || 'dark'
  })

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

  // Filter and Search states
  const [currentFilter, setCurrentFilter] = useState('all') // 'all' | 'today' | 'priority' | 'completed'
  const [statusFilter, setStatusFilter] = useState('all')    // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('')
  

  // Initialize custom todo hook
  const {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  } = useTodos()

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
    localStorage.setItem('todo_theme', theme)
  }, [theme])

  // Fetch todos when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos()
    }
  }, [isAuthenticated, fetchTodos])

  // Handle OAuth Redirect callback hash (e.g. from Google login)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        
        if (accessToken) {
          try {
            await loginWithSupabaseToken(accessToken)
          } catch (err) {
            console.error('OAuth sign in failed:', err)
          } finally {
            window.history.replaceState(null, '', window.location.pathname)
          }
        }
      }
    }
    handleOAuthCallback()
  }, [loginWithSupabaseToken])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Filter logic
  const getFilteredTodos = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    return todos.filter((todo) => {
      // 1. Sidebar Category Filter
      if (currentFilter === 'today') {
        if (todo.dueDate !== todayStr) return false
      } else if (currentFilter === 'priority') {
        if (todo.priority !== 'high') return false
      } else if (currentFilter === 'completed') {
        if (!todo.completed) return false
      }

      // 2. Status Tab Filter
      if (statusFilter === 'active') {
        if (todo.completed) return false
      } else if (statusFilter === 'completed') {
        if (!todo.completed) return false
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        if (!todo.title.toLowerCase().includes(query)) return false
      }

      return true
    })
  }

  const filteredTodos = getFilteredTodos()

  // Show general loading spinner on session check
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-violet-600"></span>
        </div>
      </div>
    )
  }

  // Auth screen routes
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onNavigateToRegister={() => setAuthView('register')} 
      />
    ) : (
      <RegisterPage 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onNavigateToLogin={() => setAuthView('login')} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Absolute Top-Left Hamburger Menu Trigger */}
      {isAuthenticated && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          type="button"
          className="fixed top-3.5 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white transition-all cursor-pointer shadow-sm"
          title="Open Categories Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Header */}
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Sliding Sidebar Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-76 max-w-xs transform bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col p-6
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-950/20">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-slate-350 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              TaskFlow
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-455 dark:hover:text-white hover:bg-slate-50 transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Drawer Menu Links */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1">
          <Sidebar
            currentFilter={currentFilter}
            setCurrentFilter={(filter) => {
              setCurrentFilter(filter)
              setIsSidebarOpen(false) // Automatically close drawer on selection
            }}
            todos={todos}
          />
        </div>

        {/* User Profile Info & Sign Out Footer */}
        {user && (
          <div className="mt-auto border-t border-slate-100 dark:border-slate-800/80 pt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 text-sm font-semibold text-violet-600 dark:text-violet-400 shadow-inner">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-850 dark:text-slate-200 leading-tight truncate">
                  {user.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-455 truncate text-left">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Log out */}
            <button
              onClick={() => {
                logout()
                setIsSidebarOpen(false)
              }}
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-red-900/30 dark:hover:bg-red-950/20 dark:hover:text-red-400 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Header greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Hey, {user?.name}! 👋
                </h1>
                <p className="text-sm text-slate-500">
                  Here's an overview of your schedule.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <StatsCards todos={todos} />

            {/* Error notifications */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-red-950/20 dark:border-red-900/30 px-4 py-3 text-sm text-rose-600 dark:text-red-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Add Todo Form */}
            <AddTodoForm onAdd={addTodo} />

            {/* Filters bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Todo Items List */}
            <TodoList
              todos={filteredTodos}
              loading={loading}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          </div>

        </div>
      </main>
    </div>
  )
}

export default App


