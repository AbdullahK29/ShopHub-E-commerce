// src/middleware.ts
// This file is special — Next.js runs it on EVERY request
// before the page even loads. It's the fastest way to protect routes.
// Place this file at src/middleware.ts (same level as src/app/)

import { NextRequest, NextResponse } from 'next/server'

// Routes that require login
const PROTECTED_ROUTES = ['/dashboard', '/checkout', '/orders']

// Routes that logged-in users shouldn't see (login, register)
const AUTH_ROUTES = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // If trying to access protected route without token → redirect to login
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname) // remember where they were going
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in and trying to access login/register → redirect to dashboard
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run middleware on these paths (skip static files, API routes)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}