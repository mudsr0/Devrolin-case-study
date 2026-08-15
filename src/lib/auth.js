import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const TOKEN_COOKIE = 'admin_token'

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

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  return verifyAdminToken(token)
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    return null
  }
  return session
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { message: 'Unauthorized' },
    {
      status: 401,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
      },
    }
  )
}

export function errorResponse(message, status = 400) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
      },
    }
  )
}
