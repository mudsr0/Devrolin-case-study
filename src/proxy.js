import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const TOKEN_COOKIE = 'admin_token'

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const secret = process.env.JWT_SECRET

  if (token && secret) {
    try {
      jwt.verify(token, secret, {
        issuer: 'case-study-admin',
        audience: 'case-study-admin',
      })
      return NextResponse.next()
    } catch {
      // invalid or expired token
    }
  }

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
