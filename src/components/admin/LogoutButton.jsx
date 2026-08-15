'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-md border border-admin-border px-3 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:border-admin-accent hover:text-admin-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  )
}
