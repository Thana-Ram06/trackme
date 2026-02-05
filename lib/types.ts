export type SubscriptionType = 'income' | 'expense'

export type BillingCycle = 'monthly' | 'yearly'

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export interface Subscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: BillingCycle
  nextRenewalDate: string
  type: SubscriptionType
  status: SubscriptionStatus
  notes: string
  createdAt: string
}

export interface DashboardSummary {
  activeSubscriptions: number
  monthlyRecurringIncome: number
  monthlyRecurringExpenses: number
  netMonthlyBalance: number
}

export interface UpcomingRenewal {
  subscription: Subscription
  daysUntilRenewal: number
  renewalAmount: number
}