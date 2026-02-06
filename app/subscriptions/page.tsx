'use client'

import { formatCurrency, formatBillingCycle, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function Subscriptions() {
  const { isAuthenticated } = useAuth()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  // Empty state for frontend-only version
  const subscriptions = []

  if (!isAuthenticated) {
    return null // Will be handled by middleware redirect
  }

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <h1>Subscriptions</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage your recurring income and expenses
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              No Subscriptions Yet
            </h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
              You haven&apos;t added any subscriptions yet. Start by adding your recurring income sources and expenses to get a complete picture of your financial flow.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn btn-primary">
                View Dashboard
              </Link>
              <button className="btn btn-secondary" disabled>
                Add Subscription (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1>Subscriptions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your recurring income and expenses
          </p>
        </div>

        {/* Empty state for demo */}
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Subscription Management
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Subscription management interface coming soon. This is a frontend demonstration of the UI design.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Total Subscriptions
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
              {subscriptions.length}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Active Income Streams
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: 'var(--success)' }}>
              {subscriptions.filter(sub => sub.type === 'income' && sub.status === 'active').length}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Active Expenses
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: 'var(--error)' }}>
              {subscriptions.filter(sub => sub.type === 'expense' && sub.status === 'active').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}