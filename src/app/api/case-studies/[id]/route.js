import mongoose from 'mongoose'
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

export async function GET(_request, { params }) {
  if (!(await requireAdmin())) {
    return unauthorizedResponse()
  }

  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse('Invalid id', 400)
  }

  await dbConnect()
  const data = await CaseStudy.findById(id).lean()
  if (!data) {
    return errorResponse('Case study not found', 404)
  }

  return NextResponse.json({ caseStudy: serialize(data) })
}

export async function PUT(request, { params }) {
  if (!(await requireAdmin())) {
    return unauthorizedResponse()
  }

  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse('Invalid id', 400)
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

  if (typeof body.slug === 'string' && body.slug.trim().length === 0) {
    return errorResponse('Slug cannot be empty', 400)
  }

  await dbConnect()
  try {
    const updated = await CaseStudy.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: 'query',
    }).lean()

    if (!updated) {
      return errorResponse('Case study not found', 404)
    }

    return NextResponse.json({ caseStudy: serialize(updated) })
  } catch (error) {
    if (error && error.code === 11000) {
      return errorResponse('A case study with this slug already exists', 409)
    }
    const message =
      error && error.name === 'ValidationError'
        ? Object.values(error.errors)
            .map((err) => err.message)
            .join(', ')
        : 'Failed to update case study'
    return errorResponse(message, 400)
  }
}

export async function DELETE(_request, { params }) {
  if (!(await requireAdmin())) {
    return unauthorizedResponse()
  }

  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse('Invalid id', 400)
  }

  await dbConnect()
  const deleted = await CaseStudy.findByIdAndDelete(id)
  if (!deleted) {
    return errorResponse('Case study not found', 404)
  }

  return NextResponse.json({ success: true })
}
