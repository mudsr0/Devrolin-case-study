import Link from 'next/link'
import { getAdminSession, defaultDashboardPath } from '@/lib/auth'
import LogoutButton from '@/components/admin/LogoutButton'

export const metadata = {
  title: 'Sales Dashboard',
  description: 'DevRolin Case Study CMS',
}

export default async function SalesLayout({ children }) {
  const session = await getAdminSession()

  return (
    <div className="min-h-screen bg-admin-bg1 text-admin-text" style={{ backgroundColor: '#000000' }}>
      <header className="h-14 border-b border-admin-border bg-admin-bg1">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={session ? defaultDashboardPath(session.role) : '/admin/login'}
            className="flex items-center gap-2 font-semibold tracking-tight text-admin-text transition-opacity hover:opacity-80"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-admin-accent"
            />
            DevRolin <span className="text-admin-accent">Sales</span>
          </Link>

          {session ? <LogoutButton /> : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}