import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredTheme, setStoredTheme } from './supabase'

const ThemeContext = createContext({})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = getStoredTheme()
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    if (newTheme === 'light') {
      root.classList.add('light-mode')
      root.classList.remove('dark-mode')
    } else {
      root.classList.add('dark-mode')
      root.classList.remove('light-mode')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setStoredTheme(newTheme)
    applyTheme(newTheme)
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
