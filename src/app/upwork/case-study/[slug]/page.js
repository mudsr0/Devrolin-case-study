import Link from 'next/link'
import dbConnect from '@/lib/dbConnect'
import CaseStudy from '@/models/CaseStudy'
import CaseStudyDetail from '@/components/CaseStudyDetail'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params

  await dbConnect()
  const caseStudy = await CaseStudy.findOne({ slug }).lean()

  if (!caseStudy) {
    return { title: 'Case Study Not Found' }
  }

  return {
    title: caseStudy.clientName,
    description: caseStudy.hero?.body || `Case study for ${caseStudy.clientName}`,
  }
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params

  await dbConnect()
  const data = await CaseStudy.findOne({ slug }).lean()

  if (!data) {
    return (
      <div
        className="case-study upwork-theme wrap"
        style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}
      >
        <h1>Case study not found</h1>
        <p style={{ margin: '12px 0 24px', color: '#A8A8A8' }}>
          We couldn&apos;t find the case study you&apos;re looking for.
        </p>
        <Link href="/" className="watch-demo-btn">
          Back to home
        </Link>
      </div>
    )
  }

  const serialized = {
    ...data,
    _id: String(data._id),
  }

  return <CaseStudyDetail data={serialized} audience="upwork" />
}
