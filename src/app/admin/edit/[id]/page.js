import mongoose from 'mongoose'
import { redirect, notFound } from 'next/navigation'
import dbConnect from '@/lib/dbConnect'
import CaseStudy from '@/models/CaseStudy'
import { requireAdmin } from '@/lib/auth'
import AdminForm from '@/components/admin/AdminForm'

export const dynamic = 'force-dynamic'

export default async function EditCaseStudyPage({ params }) {
  const session = await requireAdmin()
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound()
  }

  await dbConnect()
  const data = await CaseStudy.findById(id).lean()
  if (!data) {
    notFound()
  }

  const serialized = {
    ...data,
    _id: String(data._id),
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : null,
  }

  return <AdminForm mode="edit" caseStudyId={serialized._id} initialData={serialized} />
}
