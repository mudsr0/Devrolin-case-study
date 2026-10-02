import { redirect } from 'next/navigation'
import { getAdminSession, defaultDashboardPath } from '@/lib/auth'
import { isInternalPath, PORTAL_PREFIXES } from '@/lib/roles'
import LoginForm from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }) {
  const session = await getAdminSession()
  if (session) {
    redirect(defaultDashboardPath(session.role))
  }

  const { from } = await searchParams
  const isPortalPath =
    typeof from === 'string' &&
    PORTAL_PREFIXES.some(
      (prefix) => from === prefix || from.startsWith(`${prefix}/`)
    )
  const redirectTo =
    isInternalPath(from) && isPortalPath && from !== '/admin/login'
      ? from
      : null

  return <LoginForm redirectTo={redirectTo} />
}