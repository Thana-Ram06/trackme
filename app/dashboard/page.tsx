import { calculateUserDashboardSummary, getUserUpcomingRenewals } from '@/lib/actions/dashboard'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function Dashboard() {
  try {
    const summary = await calculateUserDashboardSummary()
    const upcomingRenewals = await getUserUpcomingRenewals()

    // Empty state for new users
    if (summary.activeSubscriptions === 0 && upcomingRenewals.length === 0) {
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
              {summary.activeSubscriptions}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Monthly Recurring Income
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '600', margin: 0, color: 'var(--success)' }}>
              {formatCurrency(summary.monthlyRecurringIncome)}
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Monthly Recurring Expenses
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: '600', margin: 0, color: 'var(--error)' }}>
              {formatCurrency(summary.monthlyRecurringExpenses)}
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
              color: summary.netMonthlyBalance >= 0 ? 'var(--success)' : 'var(--error)'
            }}>
              {formatCurrency(summary.netMonthlyBalance)}
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

          {upcomingRenewals.length > 0 ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {upcomingRenewals.map((item, index) => (
                  <div
                    key={item.subscription.id}
                    style={{
                      padding: '1.5rem 24px',
                      borderBottom: index < upcomingRenewals.length - 1 ? '1px solid var(--border-color)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 24px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No upcoming renewals in the next 30 days
              </p>
              <Link href="/subscriptions" className="btn btn-primary">
                Manage Subscriptions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--error)' }}>
              Error Loading Dashboard
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Unable to load your dashboard data. Please try refreshing the page or contact support if the problem persists.
            </p>
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }
}