import { redirect } from 'next/navigation'
import { getAdminSession, ROLES } from '@/lib/auth'
import DashboardView from '@/components/admin/DashboardView'

export const dynamic = 'force-dynamic'

export default async function UpworkDashboardPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  if (session.role !== ROLES.ADMIN) {
    redirect('/sales/dashboard')
  }

  return <DashboardView role="admin" linkMode="upwork" />
}
