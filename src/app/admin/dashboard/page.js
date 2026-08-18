import Link from 'next/link'
import { redirect } from 'next/navigation'
import dbConnect from '@/lib/dbConnect'
import CaseStudy from '@/models/CaseStudy'
import { requireAdmin } from '@/lib/auth'
import CaseStudiesTable from '@/components/admin/CaseStudiesTable'

export const dynamic = 'force-dynamic'

function serialize(caseStudy) {
  return {
    _id: String(caseStudy._id),
    slug: caseStudy.slug,
    category: caseStudy.category ?? '',
    clientName: caseStudy.clientName ?? '',
    heroTitle: caseStudy.hero?.title ?? '',
    heroBody: caseStudy.hero?.body ?? '',
    heroTag: caseStudy.hero?.tag ?? '',
    heroPills: Array.isArray(caseStudy.hero?.pills) ? caseStudy.hero.pills : [],
    pains: Array.isArray(caseStudy.problem?.pains) ? caseStudy.problem.pains : [],
    builtItems: Array.isArray(caseStudy.built?.items) ? caseStudy.built.items : [],
    createdAt: caseStudy.createdAt
      ? new Date(caseStudy.createdAt).toISOString()
      : null,
    updatedAt: caseStudy.updatedAt
      ? new Date(caseStudy.updatedAt).toISOString()
      : null,
  }
}

export default async function DashboardPage() {
  const session = await requireAdmin()
  if (!session) {
    redirect('/admin/login')
  }

  await dbConnect()
  const caseStudies = await CaseStudy.find({}).sort({ createdAt: -1 }).lean()

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-admin-text">
            Case Studies
          </h1>
          <p className="mt-1 text-sm text-admin-muted">
            {caseStudies.length} case stud{caseStudies.length === 1 ? 'y' : 'ies'} in your library
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-accent/90"
        >
          <span aria-hidden="true" className="text-lg leading-none">+</span>
          Create New Case Study
        </Link>
      </div>

      <div className="mt-8">
        <CaseStudiesTable caseStudies={caseStudies.map(serialize)} />
      </div>
    </>
  )
}
