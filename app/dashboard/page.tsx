'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { isAuthenticated } = useAuth()

  // Empty state for frontend-only version
  const activeSubscriptions = []
  const monthlyRecurringIncome = 0
  const monthlyRecurringExpenses = 0
  const netMonthlyBalance = 0
  const upcomingRenewals = []

  // Empty state for new users
  if (activeSubscriptions.length === 0 && upcomingRenewals.length === 0) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <h1>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Overview of your recurring income and expenses
            </p>
          </div>

          {/* Empty State */}
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Welcome to Track.me!
            </h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
              You haven&apos;t added any subscriptions yet. Start tracking your recurring income and expenses to get insights into your financial patterns.
            </p>
            <Link href="/subscriptions" className="btn btn-primary">
              Add Your First Subscription
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Overview of your recurring income and expenses
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4" style={{ marginBottom: '3rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Active Subscriptions
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '600', margin: 0 }}>
              {activeSubscriptions.length}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Monthly Recurring Income
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '600', margin: 0, color: 'var(--success)' }}>
              {formatCurrency(monthlyRecurringIncome)}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Monthly Recurring Expenses
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '600', margin: 0, color: 'var(--error)' }}>
              {formatCurrency(monthlyRecurringExpenses)}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Net Monthly Balance
            </h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              margin: 0,
              color: netMonthlyBalance >= 0 ? 'var(--success)' : 'var(--error)'
            }}>
              {formatCurrency(netMonthlyBalance)}
            </p>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Upcoming Renewals</h2>
            <Link href="/subscriptions" className="btn btn-secondary">
              View All
            </Link>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '3rem 24px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              No upcoming renewals in next 30 days
            </p>
            <Link href="/subscriptions" className="btn btn-primary">
              Manage Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}