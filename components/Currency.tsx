interface CurrencyProps {
  amount: number
  currency?: string
  showSign?: boolean
  type?: 'income' | 'expense'
  size?: 'sm' | 'md' | 'lg'
}

export function Currency({ 
  amount, 
  currency = 'USD', 
  showSign = false, 
  type,
  size = 'md' 
}: CurrencyProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))

  const sign = showSign ? (type === 'income' || amount > 0 ? '+' : '-') : ''
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { fontSize: '0.875rem' }
      case 'lg':
        return { fontSize: '2rem' }
      default:
        return { fontSize: '1.125rem' }
    }
  }

  const getColor = () => {
    if (type === 'income') return 'var(--success)'
    if (type === 'expense') return 'var(--error)'
    return 'inherit'
  }

  return (
    <span 
      style={{ 
        fontWeight: '500',
        color: getColor(),
        ...getSizeStyles()
      }}
    >
      {sign}{formatted}
    </span>
  )
}