'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('trove-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  const bgPrimary = { backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }
  const bgSecondary = { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
  const borderStyle = { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
  const textPrimary = { color: isDark ? '#ffffff' : '#000000' }
  const textMuted = { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ ...bgPrimary, ...textPrimary }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
              <defs>
                <linearGradient id="troveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <polygon points="50,5 90,35 75,95 25,95 10,35" fill="url(#troveGradient)" />
              <polygon points="50,5 90,35 50,45 10,35" fill="rgba(255,255,255,0.3)" />
              <polygon points="10,35 50,45 25,95" fill="rgba(0,0,0,0.1)" />
            </svg>
            <span className="text-2xl font-light">trove</span>
          </div>
        </div>

        {success ? (
          <div className="text-center p-6 rounded-2xl border" style={{ ...bgSecondary, ...borderStyle }}>
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Password updated!</h2>
            <p className="text-sm mb-6" style={textMuted}>
              Your password has been successfully reset.
            </p>
            <Link 
              href="/"
              className="block w-full py-3 rounded-lg font-medium text-sm text-center"
              style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border" style={{ ...bgSecondary, ...borderStyle }}>
            <h2 className="text-xl font-medium mb-2">Reset your password</h2>
            <p className="text-sm mb-6" style={textMuted}>
              Enter your new password below.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm pr-10"
                  style={{ ...bgSecondary, ...borderStyle, ...textPrimary }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={textMuted}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{ ...bgSecondary, ...borderStyle, ...textPrimary }}
              />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-50"
                style={{ backgroundColor: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <Link 
              href="/"
              className="flex items-center justify-center gap-2 mt-4 text-sm"
              style={textMuted}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}