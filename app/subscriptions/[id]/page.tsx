'use client'

import { formatCurrency, formatBillingCycle, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function SubscriptionDetailPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isAuthenticated) {
    return null // Will be handled by middleware redirect
  }

  // Mock subscription for frontend demo
  const subscription = null // No subscription for demo

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <Link 
            href="/subscriptions"
            style={{ 
              color: 'var(--text-secondary)', 
              textDecoration: 'none',
              marginBottom: '1rem',
              display: 'inline-block'
            }}
          >
            ← Back to Subscriptions
          </Link>
          <h1>Subscription Details</h1>
        </div>

        {/* Empty State - No subscription found */}
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Subscription Not Found
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            The subscription you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link href="/subscriptions" className="btn btn-primary">
            Back to Subscriptions
          </Link>
        </div>
      </div>
    </div>
  )
}