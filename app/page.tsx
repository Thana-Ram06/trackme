import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Track subscriptions. Know what's coming.
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
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid grid-cols-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Manual Tracking
              </h3>
              <p style={{ fontSize: '0.95rem' }}>
                Add subscriptions with custom billing cycles, renewal dates, and detailed notes. No automatic imports, just clean manual control.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Clear Overview
              </h3>
              <p style={{ fontSize: '0.95rem' }}>
                See your monthly recurring income, expenses, and upcoming renewals at a glance. Focus on what matters, not complex charts.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Always Free
              </h3>
              <p style={{ fontSize: '0.95rem' }}>
                No paywalls, no premium features, no limits. Just a simple, effective subscription tracker that works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            A calm, simple subscription tracker. No tracking, no ads, just focus.
          </p>
        </div>
      </footer>
    </div>
  )
}