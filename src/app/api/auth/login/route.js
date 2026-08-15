import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const JWT_MAX_AGE = 60 * 60 * 24 * 7

function securityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  }
}

export async function POST(request) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  const jwtSecret = process.env.JWT_SECRET

  if (!adminEmail || !adminPasswordHash || !jwtSecret) {
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500, headers: securityHeaders() }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401, headers: securityHeaders() }
    )
  }

  const submittedEmail =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const submittedPassword =
    typeof body.password === 'string' ? body.password : ''

  const emailMatches =
    submittedEmail.length > 0 && submittedEmail === adminEmail.toLowerCase()
  const passwordMatches =
    submittedPassword.length > 0 &&
    (await bcrypt.compare(submittedPassword, adminPasswordHash))

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401, headers: securityHeaders() }
    )
  }

  const token = jwt.sign(
    { email: adminEmail.toLowerCase(), role: 'admin' },
    jwtSecret,
    {
      expiresIn: JWT_MAX_AGE,
      issuer: 'case-study-admin',
      audience: 'case-study-admin',
    }
  )

  const response = NextResponse.json(
    { success: true },
    { headers: securityHeaders() }
  )

  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: JWT_MAX_AGE,
  })

  return response
}
