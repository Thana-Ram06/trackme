'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard'
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    )
  }

  // Show landing page only for non-authenticated users
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Track subscriptions. Know what&apos;s coming.
        </h1>
        
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
          track.me helps you manage recurring income and subscriptions without spreadsheets or complexity.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" className="btn btn-primary">
            Open Dashboard
          </Link>
          <Link href="/subscriptions" className="btn btn-secondary">
            View Subscriptions
          </Link>
        </div>
      </div>
    </div>
  )
}