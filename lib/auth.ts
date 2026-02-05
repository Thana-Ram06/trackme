import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

// Server-side authentication check
export async function getSession() {
  return await getServerSession()
}

// Redirect unauthenticated users
export async function requireAuth() {
  const session = await getSession()
  
  if (!session?.user?.email) {
    redirect('/')
  }
  
  return session
}

// Get current user email securely (using email for data isolation)
export async function getCurrentUserEmail() {
  const session = await getSession()
  
  if (!session?.user?.email) {
    throw new Error('User not authenticated')
  }
  
  return session.user.email
}