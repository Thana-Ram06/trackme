import { Subscription, DashboardSummary, UpcomingRenewal } from './types'

export function calculateDashboardSummary(subscriptions: Subscription[]): DashboardSummary {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  
  const monthlyRecurringIncome = activeSubscriptions
    .filter(sub => sub.type === 'income')
    .reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'monthly' 
        ? sub.amount 
        : sub.amount / 12
      return total + monthlyAmount
    }, 0)
  
  const monthlyRecurringExpenses = activeSubscriptions
    .filter(sub => sub.type === 'expense')
    .reduce((total, sub) => {
      const monthlyAmount = sub.billingCycle === 'monthly' 
        ? sub.amount 
        : sub.amount / 12
      return total + monthlyAmount
    }, 0)
  
  const netMonthlyBalance = monthlyRecurringIncome - monthlyRecurringExpenses

  return {
    activeSubscriptions: activeSubscriptions.length,
    monthlyRecurringIncome,
    monthlyRecurringExpenses,
    netMonthlyBalance
  }
}

export function getUpcomingRenewals(subscriptions: Subscription[]): UpcomingRenewal[] {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
  
  return subscriptions
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
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatBillingCycle(cycle: 'monthly' | 'yearly'): string {
  return cycle === 'monthly' ? 'Monthly' : 'Yearly'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getSubscriptionById(subscriptions: Subscription[], id: string): Subscription | undefined {
  return subscriptions.find(sub => sub.id === id)
}