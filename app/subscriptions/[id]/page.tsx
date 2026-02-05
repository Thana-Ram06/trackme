import { mockSubscriptions } from '@/lib/data'
import { getSubscriptionById, formatCurrency, formatBillingCycle, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface SubscriptionDetailPageProps {
  params: {
    id: string
  }
}

export default function SubscriptionDetailPage({ params }: SubscriptionDetailPageProps) {
  const subscription = getSubscriptionById(mockSubscriptions, params.id)

  if (!subscription) {
    notFound()
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ marginBottom: '0.5rem' }}>{subscription.name}</h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {subscription.notes}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span 
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
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
              <span 
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: getStatusBackgroundColor(subscription.status),
                  color: getStatusColor(subscription.status)
                }}
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
          {/* Main Information */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Amount
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  {subscription.type === 'income' ? '+' : '-'}{formatCurrency(subscription.amount)}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Billing Cycle
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                  {formatBillingCycle(subscription.billingCycle)}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Next Renewal Date
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                  {formatDate(subscription.nextRenewalDate)}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Currency
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                  {subscription.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Financial Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Monthly Amount
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  {subscription.type === 'income' ? '+' : '-'}
                  {formatCurrency(
                    subscription.billingCycle === 'monthly' 
                      ? subscription.amount 
                      : subscription.amount / 12
                  )}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Yearly Amount
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  {subscription.type === 'income' ? '+' : '-'}
                  {formatCurrency(
                    subscription.billingCycle === 'yearly' 
                      ? subscription.amount 
                      : subscription.amount * 12
                  )}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: '0 0 0.25rem 0' }}>
                  Created
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                  {formatDate(subscription.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {subscription.notes && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Notes</h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {subscription.notes}
            </p>
          </div>
        )}

        {/* Renewal Timeline */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Renewal Timeline</h3>
          
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '0.5rem',
              top: '0',
              bottom: '0',
              width: '2px',
              backgroundColor: 'var(--border-color)'
            }} />
            
            {/* Timeline Items */}
            {generateTimeline(subscription).map((item, index) => (
              <div 
                key={index}
                style={{ 
                  position: 'relative',
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: index < generateTimeline(subscription).length - 1 ? '1px solid var(--border-color)' : 'none'
                }}
              >
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  top: '0.25rem',
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  backgroundColor: item.past ? 'var(--text-tertiary)' : 
                                   item.current ? 'var(--accent)' : 'var(--border-color)',
                  border: '2px solid var(--bg-secondary)'
                }} />
                
                <div>
                  <p style={{ 
                    fontWeight: '500', 
                    margin: '0 0 0.25rem 0',
                    color: item.current ? 'var(--accent)' : 'var(--text-primary)'
                  }}>
                    {formatDate(item.date)}
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                  {!item.past && (
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      fontWeight: '500',
                      color: subscription.type === 'income' ? 'var(--success)' : 'var(--error)'
                    }}>
                      {subscription.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function generateTimeline(subscription: any) {
  const timeline = []
  const today = new Date()
  const nextRenewal = new Date(subscription.nextRenewalDate)
  
  // Generate past renewals
  for (let i = 2; i >= 0; i--) {
    const date = new Date(nextRenewal)
    if (subscription.billingCycle === 'monthly') {
      date.setMonth(date.getMonth() - (i + 1))
    } else {
      date.setFullYear(date.getFullYear() - (i + 1))
    }
    
    timeline.push({
      date: date.toISOString(),
      amount: subscription.amount,
      description: 'Previous renewal',
      past: true,
      current: false
    })
  }
  
  // Add current/next renewal
  timeline.push({
    date: subscription.nextRenewalDate,
    amount: subscription.amount,
    description: 'Next renewal',
    past: false,
    current: true
  })
  
  // Generate future renewals
  for (let i = 1; i <= 3; i++) {
    const date = new Date(nextRenewal)
    if (subscription.billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + i)
    } else {
      date.setFullYear(date.getFullYear() + i)
    }
    
    timeline.push({
      date: date.toISOString(),
      amount: subscription.amount,
      description: 'Future renewal',
      past: false,
      current: false
    })
  }
  
  return timeline
}

function getStatusColor(status: string): string {
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

function getStatusBackgroundColor(status: string): string {
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