'use client'

import { useState, useEffect } from 'react'

interface User {
  id?: string
  name?: string
  email?: string
  image?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Simulate authentication check - in real app, this would check session
    const checkAuth = () => {
      // For demo purposes, we'll simulate an authenticated state after 1 second
      setTimeout(() => {
        setAuthState({
          user: {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@example.com',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4c75?w=32&h=32&fit=crop&crop=faces'
          },
          isLoading: false,
          isAuthenticated: true
        })
      }, 1000)
    }

    checkAuth()
  }, [])

  return authState
}