'use server'

import { getCurrentUserId } from '@/lib/auth'
import connectDB from '@/lib/mongoose'
import Subscription, { SubscriptionType, BillingCycle, SubscriptionStatus } from '@/lib/models/Subscription'

// Get all subscriptions for the current user
// Data is isolated by userId - users can only see their own data
export async function getUserSubscriptions() {
  try {
    const userId = await getCurrentUserId()
    await connectDB()
    
    const subscriptions = await Subscription.find({ userId })
      .sort({ nextRenewalDate: 1 })
      .lean()
    
    return JSON.parse(JSON.stringify(subscriptions))
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    throw new Error('Failed to fetch subscriptions')
  }
}

// Create a new subscription for the current user
export async function createSubscription(subscriptionData: {
  name: string
  amount: number
  currency?: string
  billingCycle: BillingCycle
  nextRenewalDate: string
  type: SubscriptionType
  status?: SubscriptionStatus
  notes?: string
}) {
  try {
    const userId = await getCurrentUserId()
    await connectDB()
    
    const subscription = await Subscription.create({
      ...subscriptionData,
      userId,
      nextRenewalDate: new Date(subscriptionData.nextRenewalDate),
    })
    
    return JSON.parse(JSON.stringify(subscription))
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw new Error('Failed to create subscription')
  }
}

// Update a subscription (only if it belongs to the current user)
export async function updateSubscription(id: string, updateData: Partial<typeof subscriptionData>) {
  try {
    const userId = await getCurrentUserId()
    await connectDB()
    
    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, userId }, // Ensure user can only update their own subscriptions
      updateData,
      { new: true }
    )
    
    if (!subscription) {
      throw new Error('Subscription not found or access denied')
    }
    
    return JSON.parse(JSON.stringify(subscription))
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw new Error('Failed to update subscription')
  }
}

// Delete a subscription (only if it belongs to the current user)
export async function deleteSubscription(id: string) {
  try {
    const userId = await getCurrentUserId()
    await connectDB()
    
    const result = await Subscription.deleteOne({ _id: id, userId })
    
    if (result.deletedCount === 0) {
      throw new Error('Subscription not found or access denied')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting subscription:', error)
    throw new Error('Failed to delete subscription')
  }
}