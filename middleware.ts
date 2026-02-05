import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/subscriptions']
  
  // Check if current path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // Redirect to home if trying to access protected routes without authentication
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/subscriptions/:path*']
}