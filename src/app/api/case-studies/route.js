import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import CaseStudy from '@/models/CaseStudy'
import {
  requireAdmin,
  unauthorizedResponse,
  errorResponse,
} from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function serialize(caseStudy) {
  return {
    ...caseStudy,
    _id: String(caseStudy._id),
    createdAt: caseStudy.createdAt
      ? new Date(caseStudy.createdAt).toISOString()
      : null,
    updatedAt: caseStudy.updatedAt
      ? new Date(caseStudy.updatedAt).toISOString()
      : null,
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return unauthorizedResponse()
  }

  await dbConnect()
  const caseStudies = await CaseStudy.find({}).sort({ createdAt: -1 }).lean()

  return NextResponse.json({
    caseStudies: caseStudies.map(serialize),
  })
}

export async function POST(request) {
  if (!(await requireAdmin())) {
    return unauthorizedResponse()
  }

  let body
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  if (!body || typeof body !== 'object') {
    return errorResponse('Invalid payload', 400)
  }

  if (typeof body.slug !== 'string' || body.slug.trim().length === 0) {
    return errorResponse('Slug is required', 400)
  }

  await dbConnect()
  try {
    const created = await CaseStudy.create(body)
    return NextResponse.json(
      { caseStudy: serialize(created.toObject()) },
      { status: 201 }
    )
  } catch (error) {
    if (error && error.code === 11000) {
      return errorResponse('A case study with this slug already exists', 409)
    }
    const message =
      error && error.name === 'ValidationError'
        ? Object.values(error.errors)
            .map((err) => err.message)
            .join(', ')
        : 'Failed to create case study'
    return errorResponse(message, 400)
  }
}
