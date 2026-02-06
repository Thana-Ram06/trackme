import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'next-auth/react'

// Simple API to simulate adding subscriptions (frontend-only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, amount, billingCycle, nextRenewalDate, type, notes } = body

    // Validate required fields
    if (!name || !amount || !billingCycle || !nextRenewalDate || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, amount, billingCycle, nextRenewalDate, type' },
        { status: 400 }
      )
    }

    // Create new subscription object
    const newSubscription = {
      id: Date.now().toString(),
      userEmail: session.user.email,
      name: name.trim(),
      amount: parseFloat(amount),
      currency: 'USD',
      billingCycle: billingCycle as 'monthly' | 'yearly',
      nextRenewalDate: new Date(nextRenewalDate),
      type: type as 'income' | 'expense',
      status: 'active',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString()
    }

    // Store in localStorage (frontend-only approach)
    const storageKey = `subscriptions_${session.user.email}`
    const existingSubscriptions = JSON.parse(localStorage.getItem(storageKey) || '[]')
    
    const updatedSubscriptions = [...existingSubscriptions, newSubscription]
    localStorage.setItem(storageKey, JSON.stringify(updatedSubscriptions))

    return NextResponse.json({ 
      success: true, 
      subscription: newSubscription,
      totalSubscriptions: updatedSubscriptions.length 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add subscription' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subscriptions from localStorage
    const storageKey = `subscriptions_${session.user.email}`
    const subscriptions = JSON.parse(localStorage.getItem(storageKey) || '[]')

    return NextResponse.json({ subscriptions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}