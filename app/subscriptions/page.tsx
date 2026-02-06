'use client'

import { formatCurrency, formatBillingCycle, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
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

export default function Subscriptions() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly' as const,
    nextRenewalDate: '',
    type: 'expense' as const,
    notes: ''
  })

  // Load subscriptions from localStorage on component mount
  useEffect(() => {
    if (session?.user?.email) {
      const storageKey = `subscriptions_${session.user.email}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setSubscriptions(JSON.parse(stored))
      }
    }
  }, [session?.user?.email])

  // Save subscriptions to localStorage when they change
  const saveSubscriptions = (updatedSubscriptions: Subscription[]) => {
    if (session?.user?.email) {
      const storageKey = `subscriptions_${session.user.email}`
      localStorage.setItem(storageKey, JSON.stringify(updatedSubscriptions))
      setSubscriptions(updatedSubscriptions)
    }
  }

  const handleAddSubscription = async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        // Add new subscription to state
        const newSub = result.subscription
        const updated = [...subscriptions, newSub]
        saveSubscriptions(updated)
        setFormData({
          name: '',
          amount: '',
          billingCycle: 'monthly' as const,
          nextRenewalDate: '',
          type: 'expense' as const,
          notes: ''
        })
        setShowAddForm(false)
      } else {
        alert(result.error || 'Failed to add subscription')
      }
    } catch (error) {
      alert('Failed to add subscription')
    }
  }

  const handleDeleteSubscription = async (id: string) => {
    if (!session?.user?.email) return

    try {
      const response = await fetch(`/api/subscriptions?id=${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        const updated = subscriptions.filter(sub => sub.id !== id)
        saveSubscriptions(updated)
      } else {
        alert(result.error || 'Failed to delete subscription')
      }
    } catch (error) {
      alert('Failed to delete subscription')
    }
  }

  if (!session?.user) {
    return (
      <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2>Please Sign In</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              You need to be signed in to view your subscriptions.
            </p>
            <Link href="/api/auth/signin" className="btn btn-primary">
              Sign In
            </Link>
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
              You haven&apos;t added any subscriptions yet. Add your first subscription to start tracking your recurring income sources and expenses.
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              Add Your First Subscription
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Subscriptions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your recurring income and expenses
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            Add Subscription
          </button>
        </div>

        {/* Add Subscription Form */}
        {showAddForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Subscription</h3>
            
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Subscription Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="e.g., Netflix"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Billing Cycle
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as 'monthly' | 'yearly' })}
                  style={{ width: '100%' }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Next Renewal Date
                </label>
                <input
                  type="date"
                  value={formData.nextRenewalDate}
                  onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                  style={{ width: '100%' }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={handleAddSubscription}
                disabled={!formData.name || !formData.amount || !formData.nextRenewalDate || !formData.type}
                className="btn btn-primary"
              >
                Add Subscription
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Subscriptions Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
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
                  <th style={{ padding: '1rem 24px', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr 
                    key={subscription.id}
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={() => setHoveredRow(subscription.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={{ padding: '1rem 24px' }}>
                      <div>
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
                            margin: '0.25rem 0', 
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
                      </div>
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
                          backgroundColor: subscription.status === 'active' 
                            ? 'rgba(16, 185, 129, 0.1)' 
                            : subscription.status === 'paused'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(156, 163, 175, 0.1)',
                          color: subscription.status === 'active' 
                            ? 'var(--success)' 
                            : subscription.status === 'paused'
                            ? 'var(--warning)' 
                            : 'var(--text-tertiary)'
                        }}
                      >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 24px' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          value={subscription.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as 'active' | 'paused' | 'cancelled'
                            const updated = subscriptions.map(sub => 
                              sub.id === subscription.id ? { ...sub, status: newStatus } : sub
                            )
                            // In real app, this would save to backend
                            saveSubscriptions(updated)
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.75rem'
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--error)',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--error)',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
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