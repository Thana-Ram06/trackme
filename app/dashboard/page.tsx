'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

interface Subscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  nextRenewalDate: string
  type: 'income' | 'expense'
  status: 'active' | 'paused' | 'cancelled'
  notes: string
  userEmail: string
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  // Load subscriptions from localStorage on component mount
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const storageKey = `subscriptions_${user.email}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setSubscriptions(JSON.parse(stored))
      }
    }
  }, [isAuthenticated, user?.email])

  // Calculate summary from subscriptions
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const monthlyRecurringIncome = activeSubscriptions
    .filter(sub => sub.type === 'income')
    .reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12
      return total + monthlyAmount
    }, 0)
  
  const monthlyRecurringExpenses = activeSubscriptions
    .filter(sub => sub.type === 'expense')
    .reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12
      return total + monthlyAmount
    }, 0)
  
  const netMonthlyBalance = monthlyRecurringIncome - monthlyRecurringExpenses

  // Calculate upcoming renewals
  const today = new Date()
  const upcomingRenewals = subscriptions
    .filter(sub => sub.status === 'active')
    .map(sub => {
      const renewalDate = new Date(sub.nextRenewalDate)
      const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        subscription: sub,
        daysUntilRenewal,
        renewalAmount: sub.amount
      }
    })
    .filter(item => item.daysUntilRenewal >= 0 && item.daysUntilRenewal <= 30)
    .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)

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
              You haven&apos;t added any subscriptions yet. Add your first subscription to start tracking your recurring income and expenses.
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
              Manage All
            </Link>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              {upcomingRenewals.length > 0 ? (
                upcomingRenewals.map((item, index) => (
                  <div
                    key={item.subscription.id}
                    style={{
                      padding: '1.5rem 24px',
                      borderBottom: index < upcomingRenewals.length - 1 ? '1px solid var(--border-color)' : 'none'
                    }}
                  >
                    <div>
                      <Link 
                        href={`/subscriptions/${item.subscription.id}`}
                        style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '500', 
                          color: 'var(--text-primary)',
                          textDecoration: 'none'
                        }}
                      >
                        {item.subscription.name}
                      </Link>
                      <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {item.subscription.billingCycle.charAt(0).toUpperCase() + item.subscription.billingCycle.slice(1)} • {item.subscription.type}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '500' }}>
                        {formatCurrency(item.renewalAmount)}
                      </p>
                      <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {item.daysUntilRenewal === 0 ? 'Today' : 
                         item.daysUntilRenewal === 1 ? 'Tomorrow' : 
                         `In ${item.daysUntilRenewal} days`}
                      </p>
                      <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                        {formatDate(item.subscription.nextRenewalDate)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 24px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    No upcoming renewals in next 30 days
                  </p>
                  <Link href="/subscriptions" className="btn btn-primary">
                    Manage Subscriptions
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}