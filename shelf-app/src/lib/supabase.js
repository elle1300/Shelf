import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Theme helper functions
export const getStoredTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('shelf-theme') || 'dark'
  }
  return 'dark'
}

export const setStoredTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shelf-theme', theme)
  }
}
