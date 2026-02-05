import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Redirect to root after successful authentication
  return NextResponse.redirect(new URL('/', request.url))
}