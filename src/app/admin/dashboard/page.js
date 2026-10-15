import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import DashboardView from '@/components/admin/DashboardView'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  return <DashboardView role={session.role} linkMode="cold" />
}