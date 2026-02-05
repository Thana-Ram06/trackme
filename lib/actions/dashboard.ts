'use server'

import { getCurrentUserId } from '@/lib/auth'
import connectDB from '@/lib/mongoose'
import Subscription from '@/lib/models/Subscription'

// Calculate dashboard summary for the current user only
export async function calculateUserDashboardSummary() {
  try {
    const userId = await getCurrentUserId()
    await connectDB()
    
    // Only fetch active subscriptions for the current user
    const activeSubscriptions = await Subscription.find({ 
      userId, 
      status: 'active' 
    }).lean()
    
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
  } catch (error) {
    console.error('Error calculating dashboard summary:', error)
    throw new Error('Failed to calculate dashboard summary')
  }
}

// Get upcoming renewals for the current user only
export async function getUserUpcomingRenewals() {
  try {
    const userId = await getCurrentUserId()
    await connectDB()
    
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    const subscriptions = await Subscription.find({
      userId,
      status: 'active',
      nextRenewalDate: { $gte: today, $lte: thirtyDaysFromNow }
    })
    .sort({ nextRenewalDate: 1 })
    .lean()
    
    const upcomingRenewals = subscriptions.map(sub => {
      const renewalDate = new Date(sub.nextRenewalDate)
      const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        subscription: sub,
        daysUntilRenewal,
        renewalAmount: sub.amount
      }
    })
    
    return upcomingRenewals
  } catch (error) {
    console.error('Error fetching upcoming renewals:', error)
    throw new Error('Failed to fetch upcoming renewals')
  }
}