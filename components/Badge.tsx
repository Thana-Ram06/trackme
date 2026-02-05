import { SubscriptionType, SubscriptionStatus } from '@/lib/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--success)'
        }
      case 'warning':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: 'var(--warning)'
        }
      case 'error':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--error)'
        }
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          color: 'var(--text-secondary)'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.125rem 0.5rem',
          fontSize: '0.75rem'
        }
      case 'lg':
        return {
          padding: '0.5rem 1rem',
          fontSize: '1rem'
        }
      default:
        return {
          padding: '0.25rem 0.75rem',
          fontSize: '0.875rem'
        }
    }
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        fontWeight: '500',
        ...getVariantStyles(),
        ...getSizeStyles()
      }}
    >
      {children}
    </span>
  )
}

interface TypeBadgeProps {
  type: SubscriptionType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <Badge variant={type === 'income' ? 'success' : 'error'}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  )
}

interface StatusBadgeProps {
  status: SubscriptionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case 'active':
        return 'success'
      case 'paused':
        return 'warning'
      case 'cancelled':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Badge variant={getVariant()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}