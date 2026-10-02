import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const TOKEN_COOKIE = 'admin_token'
const SALES_ROLE = 'sales'
const ADMIN_ONLY_PREFIXES = ['/admin/new', '/admin/edit', '/admin/dashboard']
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

// Role data is intentionally duplicated rather than imported from
// `@/lib/roles`: Proxy is documented to run standalone, outside the app's
// main runtime, so it must not depend on shared modules.
function verifyToken(token, secret) {
  if (!token || !secret) {
    return null
  }
  try {
    return jwt.verify(token, secret, {
      issuer: 'case-study-admin',
      audience: 'case-study-admin',
    })
  } catch {
    return null
  }
}

function isAdminOnlyPath(pathname) {
  return ADMIN_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function forbidden() {
  return NextResponse.json(
    { message: 'Forbidden' },
    {
      status: 403,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
      },
    }
  )
}

export function proxy(request) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const payload = verifyToken(
    request.cookies.get(TOKEN_COOKIE)?.value,
    process.env.JWT_SECRET
  )

  // /api/* auth stays with the route handlers; the proxy only adds the
  // role restriction below so API auth behavior is unchanged.
  const isApiRequest = pathname.startsWith('/api/')

  // Only the `sales` role is restricted. Admins fall through untouched, which
  // is what keeps /sales/dashboard (and everything else) reachable for them.
  if (payload?.role === SALES_ROLE) {
    if (WRITE_METHODS.has(method)) {
      return forbidden()
    }

    if (isAdminOnlyPath(pathname)) {
      return NextResponse.redirect(new URL('/sales/dashboard', request.url))
    }
  }

  // Authenticated: let everything through, for both /admin and /sales.
  if (payload) {
    return NextResponse.next()
  }

  // Unauthenticated page request -> send to login, remembering where they
  // were headed so ?from= can restore it after a role-appropriate login.
  if (!isApiRequest) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/sales/:path*', '/api/case-studies/:path*'],
}