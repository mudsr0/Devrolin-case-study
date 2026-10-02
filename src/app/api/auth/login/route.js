import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { ROLES, TOKEN_COOKIE } from '@/lib/auth'

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

/**
 * Builds the list of role candidates to test a submitted login against.
 * Admin is always first so that a shared email resolves to the more
 * privileged role. Roles whose env config is incomplete are skipped.
 */
function credentialCandidates() {
  const candidates = []

  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash = process.env.ADMIN_PASSWORD_HASH
  if (adminEmail && adminHash) {
    candidates.push({
      role: ROLES.ADMIN,
      email: adminEmail.toLowerCase(),
      hash: adminHash,
    })
  }

  const salesEmail = process.env.SALES_EMAIL
  const salesHash = process.env.SALES_PASSWORD_HASH
  if (salesEmail && salesHash && salesEmail.toLowerCase() !== adminEmail?.toLowerCase()) {
    candidates.push({
      role: ROLES.SALES,
      email: salesEmail.toLowerCase(),
      hash: salesHash,
    })
  }

  return candidates
}

export async function POST(request) {
  const jwtSecret = process.env.JWT_SECRET
  const candidates = credentialCandidates()

  if (!jwtSecret || candidates.length === 0) {
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

  let matched = null
  if (submittedEmail.length > 0 && submittedPassword.length > 0) {
    for (const candidate of candidates) {
      // Always run bcrypt so a non-matching email does not answer faster.
      const passwordMatches = await bcrypt.compare(
        submittedPassword,
        candidate.hash
      )
      if (submittedEmail === candidate.email && passwordMatches) {
        matched = candidate
        break
      }
    }
  }

  // Single generic failure for every case: unknown email, unknown role, or
  // wrong password. Never reveal which one was wrong.
  if (!matched) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401, headers: securityHeaders() }
    )
  }

  const token = jwt.sign(
    { email: matched.email, role: matched.role },
    jwtSecret,
    {
      expiresIn: JWT_MAX_AGE,
      issuer: 'case-study-admin',
      audience: 'case-study-admin',
    }
  )

  const response = NextResponse.json(
    { success: true, role: matched.role },
    { headers: securityHeaders() }
  )

  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: JWT_MAX_AGE,
  })

  return response
}
