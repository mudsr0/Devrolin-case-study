'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const EMPTY = {
  slug: '',
  category: '',
  clientName: '',
  builder: { initials: '', name: '', expertise: '', note: '' },
  hero: { tag: '', title: '', body: '', pills: [] },
  problem: { eyebrow: '', heading: '', sub: '', pains: [] },
  video: {
    eyebrow: '',
    heading: '',
    sub: '',
    embedUrl: '',
    label: '',
    openUrl: '',
  },
  built: { eyebrow: '', heading: '', sub: '', items: [] },
  outcome: { eyebrow: '', heading: '', sub: '', items: [] },
  testimonial: {
    eyebrow: '',
    heading: '',
    sub: '',
    quote: '',
    initials: '',
    author: '',
    role: '',
  },
  process: { eyebrow: '', heading: '', sub: '', steps: [] },
  cta: { heading: '', sub: '', upworkUrl: '', email: '' },
}

function hydrate(data) {
  const base = JSON.parse(JSON.stringify(EMPTY))
  if (!data || typeof data !== 'object') {
    return base
  }

  const merged = { ...base }
  for (const key of Object.keys(base)) {
    const value = data[key]
    if (value === undefined || value === null) continue
    if (Array.isArray(base[key])) {
      merged[key] = Array.isArray(value) ? value : base[key]
    } else if (typeof base[key] === 'object') {
      merged[key] = { ...base[key], ...(value && typeof value === 'object' ? value : {}) }
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      merged[key] = value
    }
  }

  merged.hero.pills = Array.isArray(merged.hero.pills) ? merged.hero.pills : []
  merged.problem.pains = Array.isArray(merged.problem.pains) ? merged.problem.pains : []
  merged.built.items = Array.isArray(merged.built.items) ? merged.built.items : []
  merged.outcome.items = Array.isArray(merged.outcome.items) ? merged.outcome.items : []
  merged.process.steps = Array.isArray(merged.process.steps) ? merged.process.steps : []

  return merged
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const inputClass =
  'w-full rounded-md border border-admin-border bg-admin-bg2 px-3.5 py-2.5 text-sm text-admin-text placeholder-admin-muted outline-none transition-colors focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/25'

function Section({ number, title, children }) {
  return (
    <section className="rounded-xl border border-admin-border bg-admin-bg2 p-5 sm:p-7">
      <h2 className="flex items-center gap-3">
        <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-admin-accent" />
        <span className="text-base font-bold tracking-tight text-admin-text">
          <span className="mr-2 text-sm font-semibold text-admin-muted">{number}</span>
          {title}
        </span>
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-admin-muted">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-admin-muted/70">{hint}</p> : null}
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-admin-accent/40 px-3 py-1.5 text-xs font-medium text-admin-accent transition-colors hover:border-admin-accent hover:bg-admin-accent/10"
    >
      <span aria-hidden="true" className="text-sm leading-none">+</span>
      {label}
    </button>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-end rounded-md px-3 py-1.5 text-xs font-medium text-admin-danger transition-colors hover:bg-admin-danger/10"
    >
      Remove
    </button>
  )
}

export default function AdminForm({ mode = 'create', caseStudyId, initialData }) {
  const router = useRouter()
  const [form, setForm] = useState(() => hydrate(initialData))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(section, patch) {
    setForm((f) => ({ ...f, [section]: { ...f[section], ...patch } }))
  }

  function updateStrArray(section, field, index, value) {
    setForm((f) => {
      const arr = [...(f[section][field] ?? [])]
      arr[index] = value
      return { ...f, [section]: { ...f[section], [field]: arr } }
    })
  }

  function addStr(section, field) {
    setForm((f) => ({
      ...f,
      [section]: { ...f[section], [field]: [...(f[section][field] ?? []), ''] },
    }))
  }

  function removeStr(section, field, index) {
    setForm((f) => {
      const arr = [...(f[section][field] ?? [])]
      arr.splice(index, 1)
      return { ...f, [section]: { ...f[section], [field]: arr } }
    })
  }

  function updateObjArray(section, field, index, key, value) {
    setForm((f) => {
      const arr = [...(f[section][field] ?? [])]
      arr[index] = { ...arr[index], [key]: value }
      return { ...f, [section]: { ...f[section], [field]: arr } }
    })
  }

  function addObj(section, field, template) {
    setForm((f) => ({
      ...f,
      [section]: {
        ...f[section],
        [field]: [...(f[section][field] ?? []), { ...template }],
      },
    }))
  }

  function removeObj(section, field, index) {
    setForm((f) => {
      const arr = [...(f[section][field] ?? [])]
      arr.splice(index, 1)
      return { ...f, [section]: { ...f[section], [field]: arr } }
    })
  }

  function isRowEmpty(row) {
    return !Object.values(row ?? {}).some(
      (value) => typeof value === 'string' && value.trim().length > 0
    )
  }

  function buildPayload() {
    const payload = JSON.parse(JSON.stringify(form))

    payload.hero.pills = (payload.hero.pills ?? []).filter(
      (value) => value && value.trim()
    )
    payload.problem.pains = (payload.problem.pains ?? []).filter(
      (value) => value && value.trim()
    )
    payload.built.items = (payload.built.items ?? []).filter((row) => !isRowEmpty(row))
    payload.outcome.items = (payload.outcome.items ?? []).filter((row) => !isRowEmpty(row))
    payload.process.steps = (payload.process.steps ?? []).filter((row) => !isRowEmpty(row))

    for (const value of Object.values(payload)) {
      if (value && typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (typeof value[key] === 'string') {
            value[key] = value[key].trim()
          }
        }
      }
    }

    if (!payload.slug || !payload.slug.trim()) {
      payload.slug = slugify(payload.clientName || payload.hero?.title || 'case-study')
    }
    payload.slug = payload.slug.trim()

    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = buildPayload()
      const url =
        mode === 'edit' ? `/api/case-studies/${caseStudyId}` : '/api/case-studies'
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!res.ok) {
        let message = mode === 'edit' ? 'Failed to save case study' : 'Failed to create case study'
        try {
          const body = await res.json()
          if (body && typeof body.message === 'string') {
            message = body.message
          }
        } catch {
          // keep default message
        }
        setError(message)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="sticky top-0 z-30 -mx-4 border-b border-admin-border bg-admin-bg2/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-md border border-admin-border bg-admin-bg2 px-2.5 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:border-admin-accent hover:text-admin-accent"
            >
              ← Back
            </Link>
            <h1 className="text-lg font-bold tracking-tight text-admin-text">
              {mode === 'edit' ? 'Edit Case Study' : 'Create Case Study'}
            </h1>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-admin-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Case Study'}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-admin-danger/40 bg-admin-danger/10 px-3 py-2 text-sm text-admin-danger"
        >
          {error}
        </p>
      )}

      <Section number="01" title="Basic Info">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Slug"
            hint="Used in the public URLs: /upwork/case-study/your-slug and /case-study/your-slug. Auto-generated from the client name if left blank."
          >
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputClass}
              placeholder="e.g. acme-sales-automation"
            />
          </Field>
          <Field label="Category">
            <input
              list="admin-categories"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={inputClass}
              placeholder="e.g. CRM, AI, SaaS"
            />
            <datalist id="admin-categories">
              <option value="CRM" />
              <option value="AI" />
              <option value="SaaS" />
              <option value="Automation" />
              <option value="E-commerce" />
              <option value="Web Development" />
              <option value="Other" />
            </datalist>
          </Field>
        </div>
        <Field label="Client Name">
          <input
            value={form.clientName}
            onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
            className={inputClass}
            placeholder="e.g. Acme Corp"
          />
        </Field>
      </Section>

      <Section number="02" title="Builder">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Initials">
            <input
              value={form.builder.initials}
              onChange={(e) => update('builder', { initials: e.target.value })}
              className={inputClass}
              placeholder="e.g. MH"
            />
          </Field>
          <Field label="Name">
            <input
              value={form.builder.name}
              onChange={(e) => update('builder', { name: e.target.value })}
              className={inputClass}
              placeholder="e.g. Mudassir H."
            />
          </Field>
          <Field label="Expertise">
            <input
              value={form.builder.expertise}
              onChange={(e) => update('builder', { expertise: e.target.value })}
              className={inputClass}
              placeholder="e.g. CRM Automation"
            />
          </Field>
        </div>
        <Field label="Note">
          <textarea
            value={form.builder.note}
            onChange={(e) => update('builder', { note: e.target.value })}
            className={inputClass}
            rows={5}
            placeholder="Personal note shown in the builder card…"
          />
        </Field>
      </Section>

      <Section number="03" title="Hero">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tag">
            <input
              value={form.hero.tag}
              onChange={(e) => update('hero', { tag: e.target.value })}
              className={inputClass}
              placeholder="e.g. CRM Automation"
            />
          </Field>
          <Field label="Pills">
            <div className="space-y-2">
              {(form.hero.pills ?? []).map((pill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={pill}
                    onChange={(e) => updateStrArray('hero', 'pills', index, e.target.value)}
                    className={inputClass}
                    placeholder={`Pill ${index + 1}`}
                  />
                  <RemoveButton onClick={() => removeStr('hero', 'pills', index)} />
                </div>
              ))}
              <AddButton onClick={() => addStr('hero', 'pills')} label="Add pill" />
            </div>
          </Field>
        </div>
        <Field label="Title">
          <textarea
            value={form.hero.title}
            onChange={(e) => update('hero', { title: e.target.value })}
            className={inputClass}
            rows={3}
            placeholder="Headline with <em> tags for emphasis"
          />
        </Field>
        <Field label="Body">
          <textarea
            value={form.hero.body}
            onChange={(e) => update('hero', { body: e.target.value })}
            className={inputClass}
            rows={3}
            placeholder="Supporting paragraph…"
          />
        </Field>
      </Section>

      <Section number="04" title="Problem">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Eyebrow">
            <input
              value={form.problem.eyebrow}
              onChange={(e) => update('problem', { eyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={form.problem.heading}
              onChange={(e) => update('problem', { heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Sub">
            <input
              value={form.problem.sub}
              onChange={(e) => update('problem', { sub: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Pains">
          <div className="space-y-2">
            {(form.problem.pains ?? []).map((pain, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={pain}
                  onChange={(e) => updateStrArray('problem', 'pains', index, e.target.value)}
                  className={inputClass}
                  placeholder={`Pain ${index + 1}`}
                />
                <RemoveButton onClick={() => removeStr('problem', 'pains', index)} />
              </div>
            ))}
            <AddButton onClick={() => addStr('problem', 'pains')} label="Add pain" />
          </div>
        </Field>
      </Section>

      <Section number="05" title="Video">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={form.video.eyebrow}
              onChange={(e) => update('video', { eyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={form.video.heading}
              onChange={(e) => update('video', { heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Embed URL">
            <input
              value={form.video.embedUrl}
              onChange={(e) => update('video', { embedUrl: e.target.value })}
              className={inputClass}
              placeholder="https://www.youtube.com/embed/…"
            />
          </Field>
          <Field label="Label">
            <input
              value={form.video.label}
              onChange={(e) => update('video', { label: e.target.value })}
              className={inputClass}
              placeholder="Live System Demo"
            />
          </Field>
          <Field label="Open URL">
            <input
              value={form.video.openUrl}
              onChange={(e) => update('video', { openUrl: e.target.value })}
              className={inputClass}
              placeholder="https://…"
            />
          </Field>
          <Field label="Sub">
            <input
              value={form.video.sub}
              onChange={(e) => update('video', { sub: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section number="06" title="Built">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Eyebrow">
            <input
              value={form.built.eyebrow}
              onChange={(e) => update('built', { eyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={form.built.heading}
              onChange={(e) => update('built', { heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Sub">
            <input
              value={form.built.sub}
              onChange={(e) => update('built', { sub: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Items">
          <div className="space-y-4">
            {(form.built.items ?? []).map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-admin-border/70 bg-admin-bg1 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[90px_1fr_1fr]">
                  <input
                    value={item.num ?? ''}
                    onChange={(e) => updateObjArray('built', 'items', index, 'num', e.target.value)}
                    className={inputClass}
                    placeholder="Num"
                  />
                  <input
                    value={item.title ?? ''}
                    onChange={(e) =>
                      updateObjArray('built', 'items', index, 'title', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Title"
                  />
                  <input
                    value={item.desc ?? ''}
                    onChange={(e) =>
                      updateObjArray('built', 'items', index, 'desc', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Description"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <RemoveButton onClick={() => removeObj('built', 'items', index)} />
                </div>
              </div>
            ))}
            <AddButton
              onClick={() => addObj('built', 'items', { num: '', title: '', desc: '' })}
              label="Add built item"
            />
          </div>
        </Field>
      </Section>

      <Section number="07" title="Outcome">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Eyebrow">
            <input
              value={form.outcome.eyebrow}
              onChange={(e) => update('outcome', { eyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={form.outcome.heading}
              onChange={(e) => update('outcome', { heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Sub">
            <input
              value={form.outcome.sub}
              onChange={(e) => update('outcome', { sub: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Items">
          <div className="space-y-4">
            {(form.outcome.items ?? []).map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-admin-border/70 bg-admin-bg1 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={item.num ?? ''}
                    onChange={(e) =>
                      updateObjArray('outcome', 'items', index, 'num', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Num (e.g. +38%)"
                  />
                  <input
                    value={item.label ?? ''}
                    onChange={(e) =>
                      updateObjArray('outcome', 'items', index, 'label', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Label"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <RemoveButton onClick={() => removeObj('outcome', 'items', index)} />
                </div>
              </div>
            ))}
            <AddButton
              onClick={() => addObj('outcome', 'items', { num: '', label: '' })}
              label="Add outcome item"
            />
          </div>
        </Field>
      </Section>

      <Section number="08" title="Testimonial">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Eyebrow">
            <input
              value={form.testimonial.eyebrow}
              onChange={(e) => update('testimonial', { eyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={form.testimonial.heading}
              onChange={(e) => update('testimonial', { heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Sub">
            <input
              value={form.testimonial.sub}
              onChange={(e) => update('testimonial', { sub: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Quote">
          <textarea
            value={form.testimonial.quote}
            onChange={(e) => update('testimonial', { quote: e.target.value })}
            className={inputClass}
            rows={5}
            placeholder="Client testimonial…"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Initials">
            <input
              value={form.testimonial.initials}
              onChange={(e) => update('testimonial', { initials: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Author">
            <input
              value={form.testimonial.author}
              onChange={(e) => update('testimonial', { author: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Role">
            <input
              value={form.testimonial.role}
              onChange={(e) => update('testimonial', { role: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section number="09" title="Process">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Eyebrow">
            <input
              value={form.process.eyebrow}
              onChange={(e) => update('process', { eyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={form.process.heading}
              onChange={(e) => update('process', { heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Sub">
            <input
              value={form.process.sub}
              onChange={(e) => update('process', { sub: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Steps">
          <div className="space-y-4">
            {(form.process.steps ?? []).map((step, index) => (
              <div
                key={index}
                className="rounded-lg border border-admin-border/70 bg-admin-bg1 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[70px_1fr]">
                  <input
                    value={step.num ?? ''}
                    onChange={(e) =>
                      updateObjArray('process', 'steps', index, 'num', e.target.value)
                    }
                    className={inputClass}
                    placeholder="01"
                  />
                  <input
                    value={step.title ?? ''}
                    onChange={(e) =>
                      updateObjArray('process', 'steps', index, 'title', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Step title"
                  />
                </div>
                <div className="mt-3">
                  <textarea
                    value={step.desc ?? ''}
                    onChange={(e) =>
                      updateObjArray('process', 'steps', index, 'desc', e.target.value)
                    }
                    className={inputClass}
                    rows={2}
                    placeholder="Step description"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <RemoveButton onClick={() => removeObj('process', 'steps', index)} />
                </div>
              </div>
            ))}
            <AddButton
              onClick={() => addObj('process', 'steps', { num: '', title: '', desc: '' })}
              label="Add step"
            />
          </div>
        </Field>
      </Section>

      <Section number="10" title="CTA">
        <Field label="Heading">
          <textarea
            value={form.cta.heading}
            onChange={(e) => update('cta', { heading: e.target.value })}
            className={inputClass}
            rows={3}
            placeholder="Closing headline…"
          />
        </Field>
        <Field label="Sub">
          <textarea
            value={form.cta.sub}
            onChange={(e) => update('cta', { sub: e.target.value })}
            className={inputClass}
            rows={3}
            placeholder="Supporting copy…"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Upwork URL">
            <input
              value={form.cta.upworkUrl}
              onChange={(e) => update('cta', { upworkUrl: e.target.value })}
              className={inputClass}
              placeholder="https://www.upwork.com/…"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.cta.email}
              onChange={(e) => update('cta', { email: e.target.value })}
              className={inputClass}
              placeholder="hello@example.com"
            />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/dashboard"
          className="rounded-lg border border-admin-border bg-admin-bg2 px-4 py-2.5 text-sm font-medium text-admin-muted transition-colors hover:border-admin-accent hover:text-admin-accent"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-admin-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Case Study'}
        </button>
      </div>
    </form>
  )
}
