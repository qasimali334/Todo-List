import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { CheckSquare, Mail, Lock, AlertCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react'

export function LoginPage({ theme, toggleTheme, onNavigateToRegister }) {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Incorrect email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    const supabaseUrl = 'https://tldnnmczhihdoyivhrnc.supabase.co'
    const redirectUrl = `${window.location.origin}`
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}&prompt=select_account`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F2F9] dark:bg-[#0B0F19] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] px-4 py-8 relative overflow-hidden select-none transition-colors duration-300 font-sans">
      

      {/* Decorative Outer Shapes (similar to background shapes in Behance mockup) */}
      <div className="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-400/10 dark:bg-blue-600/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

      {/* Center Wrapper Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl z-10 transition-all duration-300">

        {/* Form Interface */}
        <div className="w-full bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-300">
          
          {/* Card Theme Toggle */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={toggleTheme}
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white shadow-sm backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 animate-[spin_10s_linear_infinite]" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-600" />
              )}
            </button>
          </div>
          
          {/* Center Content Group */}
          <div className="my-auto space-y-6">
            
            {/* Logo Container mimicking the image */}
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-950 shadow-md border border-slate-100 dark:border-slate-800 transform hover:scale-105 transition-transform duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-650">
                  <CheckSquare className="h-5.5 w-5.5 text-white" />
                </div>
              </div>
            </div>

            {/* Form Title */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                Hello ! Welcome back
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200/60 dark:bg-red-950/20 dark:border-red-900/30 px-4 py-3 text-sm text-rose-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 dark:text-red-400" />
                  <p className="font-semibold leading-5">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/30 py-3 pl-11 pr-4 text-sm text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 transition-all focus:bg-white dark:focus:bg-slate-950/80 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/30 py-3 pl-11 pr-11 text-sm text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 transition-all focus:bg-white dark:focus:bg-slate-950/80 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-650 dark:text-slate-550 dark:hover:text-slate-350 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 pt-1 select-none">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-blue-650 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Reset Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold tracking-wide bg-gradient-to-r from-blue-500 to-indigo-650 hover:from-blue-600 hover:to-indigo-750 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-200"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950/30 dark:hover:bg-slate-950/80 text-slate-700 dark:text-slate-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.47c0,-0.61 -0.05,-1.2 -0.15,-1.73z" fill="#4285f4" />
                  <path d="M12,20.6c2.59,0 4.77,-0.86 6.36,-2.33l-3.3,-2.57c-0.91,0.61 -2.08,0.98 -3.06,0.98c-2.35,0 -4.34,-1.59 -5.05,-3.72H3.54v2.66c1.57,3.12 4.79,5.26 8.46,5.26z" fill="#34a853" />
                  <path d="M6.95,12.97c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V6.91H3.54c-0.6,1.2 -0.94,2.56 -0.94,3.99c0,1.43 0.34,2.79 0.94,3.99l3.41,-2.92z" fill="#fbbc05" />
                  <path d="M12,6.13c1.41,0 2.68,0.49 3.68,1.44l2.76,-2.76C16.76,3.24 14.58,2.4 12,2.4c-3.67,0 -6.89,2.14 -8.46,5.26l3.41,2.92c0.71,-2.13 2.7,-3.72 5.05,-3.72z" fill="#ea4335" />
                </g>
              </svg>
              <span>Google</span>
            </button>

          </div>

          {/* Bottom Footer Signup text */}
          <div className="mt-8 text-center text-xs font-semibold">
            <span className="text-slate-400">Don't Have an account? </span>
            <button
              onClick={onNavigateToRegister}
              className="text-blue-650 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-all cursor-pointer font-bold"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
