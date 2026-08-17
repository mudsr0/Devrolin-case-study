'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CopyLinkButton from '@/components/admin/CopyLinkButton'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  })
}

const rowActionsClass = 'flex flex-wrap items-center gap-2'

function CategoryBadge({ category }) {
  if (!category) return <span className="text-admin-muted">—</span>
  return (
    <span className="inline-block rounded-full border border-admin-border bg-admin-bg1 px-2.5 py-0.5 text-xs text-admin-accent">
      {category}
    </span>
  )
}

function RowActions({ caseStudy, deletingId, onDelete, linkPath }) {
  return (
    <div className={rowActionsClass}>
      <Link
        href={`/admin/edit/${caseStudy._id}`}
        className="rounded-md border border-admin-border bg-admin-bg2 px-3 py-1.5 text-xs font-medium text-admin-text transition-colors hover:border-admin-accent hover:text-admin-accent"
      >
        Edit
      </Link>
      <CopyLinkButton slug={caseStudy.slug} path={linkPath} />
      <button
        type="button"
        disabled={deletingId === caseStudy._id}
        onClick={() => onDelete(caseStudy)}
        className="rounded-md border border-admin-border px-3 py-1.5 text-xs font-medium text-admin-danger transition-colors hover:border-admin-danger/60 hover:bg-admin-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deletingId === caseStudy._id ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}

export default function CaseStudiesTable({ caseStudies }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [linkMode, setLinkMode] = useState('upwork')
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const linkPath = linkMode === 'upwork' ? 'upwork/case-study' : 'case-study'

  const categories = useMemo(() => {
    const set = new Set()
    caseStudies.forEach((cs) => {
      if (cs.category && cs.category.trim()) {
        set.add(cs.category.trim())
      }
    })
    return ['All', ...Array.from(set).sort()]
  }, [caseStudies])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return caseStudies.filter((cs) => {
      if (category !== 'All' && cs.category !== category) {
        return false
      }
      if (!q) return true
      const client = (cs.clientName ?? '').toLowerCase()
      const title = (cs.heroTitle ?? '').toLowerCase()
      return client.includes(q) || title.includes(q)
    })
  }, [caseStudies, query, category])

  async function handleDelete(caseStudy) {
    const confirmed = window.confirm(
      `Delete "${caseStudy.clientName || caseStudy.heroTitle || caseStudy.slug}"? This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(caseStudy._id)
    setError('')
    try {
      const res = await fetch(`/api/case-studies/${caseStudy._id}`, {
        method: 'DELETE',
      })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!res.ok) {
        throw new Error('Failed to delete case study')
      }

      router.refresh()
    } catch {
      setError('Could not delete this case study. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="inline-flex w-full self-start rounded-lg border border-admin-border bg-admin-bg2 p-1 md:w-auto">
          <button
            type="button"
            onClick={() => setLinkMode('upwork')}
            className={
              linkMode === 'upwork'
                ? 'flex-1 rounded-md bg-admin-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors md:flex-none'
                : 'flex-1 rounded-md px-3.5 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:text-admin-text md:flex-none'
            }
          >
            Upwork Links
          </button>
          <button
            type="button"
            onClick={() => setLinkMode('outreach')}
            className={
              linkMode === 'outreach'
                ? 'flex-1 rounded-md bg-admin-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors md:flex-none'
                : 'flex-1 rounded-md px-3.5 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:text-admin-text md:flex-none'
            }
          >
            Cold Outreach Links
          </button>
        </div>

        <label className="relative block w-full md:max-w-sm">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-admin-muted">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client or title…"
            className="w-full rounded-lg border border-admin-border bg-admin-bg2 py-2.5 pl-10 pr-3.5 text-sm text-admin-text placeholder-admin-muted outline-none transition-colors focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/25"
          />
        </label>
      </div>

      <p className="mt-3 text-xs text-admin-muted">
        Copy button will generate{' '}
        <code className="rounded bg-admin-bg2 px-1.5 py-0.5 text-admin-accent">
          /{linkPath}/
        </code>
        links
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = cat === category
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={
                active
                  ? 'rounded-full bg-admin-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors'
                  : 'rounded-full border border-admin-border bg-admin-bg2 px-3.5 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:border-admin-accent/60 hover:text-admin-text'
              }
            >
              {cat}
            </button>
          )
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-admin-danger/40 bg-admin-danger/10 px-3 py-2 text-sm text-admin-danger"
        >
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-admin-border bg-admin-bg1 px-4 py-12 text-center text-sm text-admin-muted">
          No case studies match your filters.
        </div>
      ) : (
        <>
          {/* ── Desktop: data table ── */}
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-admin-border bg-admin-bg1 md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cs) => (
                  <tr
                    key={cs._id}
                    className="border-b border-admin-border/60 transition-colors last:border-b-0 hover:bg-admin-bg2"
                  >
                    <td className="px-4 py-3.5 font-medium text-admin-text">
                      {cs.clientName || '—'}
                    </td>
                    <td className="max-w-[260px] truncate px-4 py-3.5 text-admin-muted">
                      {cs.heroTitle || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <CategoryBadge category={cs.category} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-admin-muted">
                      {formatDate(cs.updatedAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <RowActions
                          caseStudy={cs}
                          deletingId={deletingId}
                          onDelete={handleDelete}
                          linkPath={linkPath}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile: stacked cards ── */}
          <div className="mt-6 space-y-3 md:hidden">
            {filtered.map((cs) => (
              <article
                key={cs._id}
                className="rounded-xl border border-admin-border bg-admin-bg2 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-admin-text">
                    {cs.clientName || '—'}
                  </h3>
                  <CategoryBadge category={cs.category} />
                </div>
                <p className="mt-1 text-sm text-admin-muted">
                  {cs.heroTitle || '—'}
                </p>
                <p className="mt-3 text-xs text-admin-muted">
                  Updated {formatDate(cs.updatedAt)}
                </p>
                <div className="mt-4 border-t border-admin-border pt-3">
                  <RowActions
                    caseStudy={cs}
                    deletingId={deletingId}
                    onDelete={handleDelete}
                    linkPath={linkPath}
                  />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
