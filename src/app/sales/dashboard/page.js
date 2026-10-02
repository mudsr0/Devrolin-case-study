import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import DashboardView from '@/components/admin/DashboardView'

export const dynamic = 'force-dynamic'

export default async function SalesDashboardPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  // Any authenticated role may open this route. Admins deliberately get the
  // read-only view so they can see exactly what the sales team sees.
  return <DashboardView role="sales" />
}