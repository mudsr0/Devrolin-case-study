import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import LoginForm from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }) {
  const session = await getAdminSession()
  if (session) {
    redirect('/admin/dashboard')
  }

  const { from } = await searchParams
  const redirectTo =
    typeof from === 'string' && from.startsWith('/admin') && from !== '/admin/login'
      ? from
      : '/admin/dashboard'

  return <LoginForm redirectTo={redirectTo} />
}
