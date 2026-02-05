import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

// Server-side authentication check
export async function getSession() {
  return await getServerSession()
}

// Redirect unauthenticated users
export async function requireAuth() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect('/')
  }
  
  return session
}

// Get current user ID securely
export async function getCurrentUserId() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  
  return session.user.id
}