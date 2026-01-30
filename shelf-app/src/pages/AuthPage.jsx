import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        if (!username.trim()) {
          throw new Error('Username is required')
        }
        const { error } = await signUp(email, password, username.toLowerCase().trim(), displayName || username)
        if (error) throw error
        setMessage('Check your email to confirm your account!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
        <span className="text-2xl font-light tracking-tight">shelf</span>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-light text-center mb-8">
          {isLogin ? 'Welcome back' : 'Create your library'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs text-white/50 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  placeholder="yourname"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30"
                  required={!isLogin}
                />
              </div>
              
              <div>
                <label className="block text-xs text-white/50 mb-2">Display Name (optional)</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs text-white/50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 transition-colors text-white placeholder-white/30 pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setMessage('')
            }}
            className="text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
