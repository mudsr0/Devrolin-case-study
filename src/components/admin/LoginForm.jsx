'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass =
  'w-full rounded-md border border-admin-border bg-admin-bg2 px-3.5 py-2.5 text-sm text-admin-text placeholder-admin-muted outline-none transition-colors focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/25'

export default function LoginForm({ redirectTo = '/admin/dashboard' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        let message = 'Invalid credentials'
        try {
          const body = await res.json()
          if (body && typeof body.message === 'string') {
            message = body.message
          }
        } catch {
          // fall back to default message
        }
        setError(message)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-admin-text">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-admin-accent" />
            DevRolin <span className="text-admin-accent">Admin</span>
          </div>
          <p className="mt-2 text-sm text-admin-muted">
            Sign in to manage your case studies
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-admin-border bg-admin-bg2 p-6 shadow-xl shadow-black/40 sm:p-8"
        >
          <label
            className="mb-1.5 block text-sm font-medium text-admin-muted"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />

          <label
            className="mb-1.5 mt-5 block text-sm font-medium text-admin-muted"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-admin-danger/40 bg-admin-danger/10 px-3 py-2 text-sm text-admin-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-admin-muted">
          Restricted area. Authorized access only.
        </p>
      </div>
    </div>
  )
}
