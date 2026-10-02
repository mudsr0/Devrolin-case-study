import { redirect } from 'next/navigation'
import { getAdminSession, permissionsFor } from '@/lib/auth'
import AdminForm from '@/components/admin/AdminForm'

export const dynamic = 'force-dynamic'

export default async function NewCaseStudyPage() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  if (!permissionsFor(session.role).canCreate) {
    redirect('/admin/dashboard')
  }

  return <AdminForm mode="create" />
}
