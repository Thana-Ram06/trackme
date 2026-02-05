'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light'
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <header className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-serif">
            track.me
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-blue-600 ${
                  pathname === '/dashboard' ? 'text-blue-600' : ''
                }`}
                style={{ color: pathname === '/dashboard' ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                Dashboard
              </Link>
              <Link
                href="/subscriptions"
                className={`transition-colors hover:text-blue-600 ${
                  pathname.startsWith('/subscriptions') ? 'text-blue-600' : ''
                }`}
                style={{ color: pathname.startsWith('/subscriptions') ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                Subscriptions
              </Link>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-secondary)'
              }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}