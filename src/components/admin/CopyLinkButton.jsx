'use client'

import { useRef, useState } from 'react'

export default function CopyLinkButton({ slug }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  function copyLink() {
    const url = `${window.location.origin}/case-study/${slug}`

    const done = () => {
      setCopied(true)
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 2200)
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done))
    } else {
      fallbackCopy(url, done)
    }
  }

  function fallbackCopy(text, done) {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      done()
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-md border border-admin-border bg-admin-bg2 px-3 py-1.5 text-xs font-medium text-admin-muted transition-colors hover:border-admin-accent hover:text-admin-accent"
        title={`Copy link to ${slug}`}
      >
        Copy Link
      </button>

      {copied && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-lg border border-admin-accent/40 bg-admin-bg1 px-4 py-3 text-sm font-medium text-white shadow-2xl shadow-black/50"
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-admin-accent" />
          Link copied to clipboard
        </div>
      )}
    </>
  )
}
