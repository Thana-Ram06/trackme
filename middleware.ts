import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple middleware for demo - just ensures routes work
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/subscriptions/:path*']
}