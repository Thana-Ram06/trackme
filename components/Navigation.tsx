'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useAuth } from '@/hooks/useAuth'

export default function Navigation() {
  const pathname = usePathname()
  const { user, isLoading, isAuthenticated } = useAuth()
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

  const handleSignIn = () => {
    // Redirect to protected route which will trigger sign-in
    window.location.href = '/api/auth/signin'
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* LEFT SIDE: Logo only */}
          <Link href="/" className="text-2xl" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
            Track.me
          </Link>
          
          {/* RIGHT SIDE: Actions only */}
          <div className="flex items-center gap-4">
            {/* Navigation links - only show when authenticated */}
            {isAuthenticated && (
              <div className="flex gap-4 mr-6">
                <Link
                  href="/dashboard"
                  className={`transition-colors ${
                    pathname === '/dashboard' ? '' : 'hover:text-blue-600'
                  }`}
                  style={{ 
                    color: pathname === '/dashboard' ? 'var(--accent)' : 'var(--text-primary)' 
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  href="/subscriptions"
                  className={`transition-colors ${
                    pathname.startsWith('/subscriptions') ? '' : 'hover:text-blue-600'
                  }`}
                  style={{ 
                    color: pathname.startsWith('/subscriptions') ? 'var(--accent)' : 'var(--text-primary)' 
                  }}
                >
                  Subscriptions
                </Link>
              </div>
            )}
            
            {/* Theme toggle */}
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

            {/* User section */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {/* User avatar */}
                    {user?.image && (
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {/* Logout button */}
                    <button
                      onClick={handleSignOut}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Login
                  </button>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}