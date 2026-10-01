import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  ROLES,
  ROLE_PERMISSIONS,
  normalizeRole,
  permissionsFor,
} from '@/lib/roles'

// Role primitives live in `@/lib/roles` so client components can use them too.
// Re-exported here for server callers that already import from this module.
export {
  ROLES,
  ROLE_PERMISSIONS,
  normalizeRole,
  permissionsFor,
  defaultDashboardPath,
  isAdminOnlyPath,
  canAccessPath,
  resolvePostLoginPath,
} from '@/lib/roles'

export const TOKEN_COOKIE = 'admin_token'

const SECURE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
}

export function verifyAdminToken(token) {
  const secret = process.env.JWT_SECRET
  if (!secret || !token) {
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

/**
 * Returns `{ authenticated, role, email }` or `null` when there is no valid
 * session. `role` is always one of ROLES when `authenticated` is true.
 */
export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  const payload = verifyAdminToken(token)

  if (!payload) {
    return null
  }

  return {
    authenticated: true,
    role: normalizeRole(payload.role),
    email: typeof payload.email === 'string' ? payload.email : null,
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401, headers: SECURE_HEADERS }
  )
}

export function forbiddenResponse() {
  return NextResponse.json(
    { message: 'Forbidden' },
    { status: 403, headers: SECURE_HEADERS }
  )
}

export function errorResponse(message, status = 400) {
  return NextResponse.json(
    { message },
    { status, headers: SECURE_HEADERS }
  )
}
