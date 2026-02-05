'use client'

'use client'

import { getUserSubscriptions } from '@/lib/actions/subscriptions'
import { formatCurrency, formatBillingCycle, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { SubscriptionType, SubscriptionStatus } from '@/lib/types'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Subscriptions() {
  const { isAuthenticated } = useAuth()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadSubscriptions()
    }
  }, [isAuthenticated])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await getUserSubscriptions()
      setSubscriptions(data)
    } catch (err) {
      setError('Failed to load subscriptions')
      console.error('Error loading subscriptions:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null // Will be handled by middleware redirect
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading subscriptions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--error)' }}>
              Error Loading Subscriptions
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {error}
            </p>
            <button 
              onClick={loadSubscriptions}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
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

        {/* Subscriptions Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Name
                  </th>
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Amount
                  </th>
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Billing Cycle
                  </th>
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Next Renewal
                  </th>
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Type
                  </th>
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr 
                    key={subscription.id}
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: hoveredRow === subscription.id ? 'var(--bg-primary)' : 'transparent'
                    }}
                    onMouseEnter={() => setHoveredRow(subscription.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={{ padding: '1rem 24px' }}>
                      <Link 
                        href={`/subscriptions/${subscription.id}`}
                        style={{ 
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        {subscription.name}
                      </Link>
                      {subscription.notes && (
                        <p style={{ 
                          margin: '0.25rem 0 0', 
                          fontSize: '0.875rem', 
                          color: 'var(--text-tertiary)',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {subscription.notes}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '1rem 24px' }}>
                      <span style={{ 
                        fontWeight: '500',
                        color: subscription.type === 'income' ? 'var(--success)' : 'var(--text-primary)'
                      }}>
                        {subscription.type === 'income' ? '+' : '-'}{formatCurrency(subscription.amount)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 24px', color: 'var(--text-secondary)' }}>
                      {formatBillingCycle(subscription.billingCycle)}
                    </td>
                    <td style={{ padding: '1rem 24px', color: 'var(--text-secondary)' }}>
                      {formatDate(subscription.nextRenewalDate)}
                    </td>
                    <td style={{ padding: '1rem 24px' }}>
                      <span 
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: subscription.type === 'income' 
                            ? 'rgba(16, 185, 129, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                          color: subscription.type === 'income' 
                            ? 'var(--success)' 
                            : 'var(--error)'
                        }}
                      >
                        {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 24px' }}>
                      <span 
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: getStatusBackgroundColor(subscription.status),
                          color: getStatusColor(subscription.status)
                        }}
                      >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function getStatusColor(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'var(--success)'
    case 'paused':
      return 'var(--warning)'
    case 'cancelled':
      return 'var(--text-tertiary)'
    default:
      return 'var(--text-secondary)'
  }
}

function getStatusBackgroundColor(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'rgba(16, 185, 129, 0.1)'
    case 'paused':
      return 'rgba(245, 158, 11, 0.1)'
    case 'cancelled':
      return 'rgba(156, 163, 175, 0.1)'
    default:
      return 'rgba(107, 114, 128, 0.1)'
  }
}