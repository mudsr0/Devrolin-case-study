import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import AdminForm from '@/components/admin/AdminForm'

export const dynamic = 'force-dynamic'

export default async function NewCaseStudyPage() {
  const session = await requireAdmin()
  if (!session) {
    redirect('/admin/login')
  }

  return <AdminForm mode="create" />
}
