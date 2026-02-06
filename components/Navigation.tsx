'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { redirect: false })
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      localStorage.removeItem('theme')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
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
            {/* User section */}
            {session ? (
              <div className="flex items-center gap-3">
                {/* User avatar */}
                {session.user?.image && (
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundImage: `url(${session.user.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                    title={session.user.name || 'User'}
                  />
                )}
                {/* Logout button */}
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  {isLoading ? 'Signing out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
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
          </div>
        </nav>
      </div>
    </header>
  )
}