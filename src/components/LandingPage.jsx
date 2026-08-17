'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT

if (typeof window !== 'undefined' && !FORMSPREE_ENDPOINT) {
  console.warn(
    '[LandingPage] NEXT_PUBLIC_FORMSPREE_ENDPOINT is not set — add it to your .env file for the contact form to work.'
  )
}

const STATS = [
  { value: '40+', label: 'Projects Shipped' },
  { value: '12+', label: 'Countries Served' },
  { value: '3', label: 'Companies Built' },
  { value: '5yr', label: 'Experience' },
]

const SERVICES = [
  { icon: '✦', title: 'Agentic AI', desc: 'Multi-agent pipelines, autonomous systems' },
  { icon: '⚡', title: 'Automations', desc: 'Code-first webhooks, API chains, GHL/CRM integrations' },
  { icon: '◈', title: 'Full-stack SaaS', desc: 'Next.js, MERN, custom CRMs, dashboards' },
  { icon: '✺', title: '3D & Premium Web', desc: 'Three.js, React Three Fiber, GSAP' },
  { icon: '◉', title: 'Mobile Apps', desc: 'Flutter cross-platform' },
  { icon: '◬', title: 'AI / ML Systems', desc: 'TTS, BCI pipelines, OpenAI integration' },
]

const REVIEWS = [
  {
    quote:
      'Most teams overpromise. Mudassir simply delivered. Clear updates, fast problem solving, and a level of ownership that’s hard to find.',
    name: 'David Morgan',
    role: 'Startup Owner',
    initials: 'DM',
  },
  {
    quote:
      'Strong technical team with real operational thinking. They fixed critical gaps and executed with professionalism from start to finish.',
    name: 'Rachit Patel',
    role: 'CEO GBNODES',
    initials: 'RP',
  },
  {
    quote:
      'Delivered clean, thorough work across all milestones, communicated proactively, and met every deadline. Would gladly hire again.',
    name: 'Mr. Marco',
    role: 'CEO RubberDuck',
    initials: 'MM',
  },
]

export default function LandingPage() {
  const rootRef = useRef(null)
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [avatarError, setAvatarError] = useState(false)
  const [portraitError, setPortraitError] = useState(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const fadeEls = gsap.utils.toArray('[data-fade]')
      if (!fadeEls.length) return

      gsap.set(fadeEls, { opacity: 0, y: 30 })

      fadeEls.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!FORMSPREE_ENDPOINT) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        setStatus('success')
        setValues({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="landing" ref={rootRef}>
      {/* ── 1. Hero ── */}
      <section className="landing-hero">
        <div className="landing-inner">
          <div className="landing-hero-grid">
            <div className="landing-copy" data-fade>
              <div className="landing-avatar-wrap">
                {avatarError ? (
                  <div className="landing-avatar landing-avatar--fallback">MH</div>
                ) : (
                  <Image
                    src="/images/mudassir.png"
                    alt="Mudassir H."
                    width={56}
                    height={56}
                    className="landing-avatar"
                    onError={() => setAvatarError(true)}
                  />
                )}
              </div>

              <div className="landing-eyebrow">CRM Automation · AI Systems Expert</div>
              <h1 className="landing-title">Turning Complex Business Problems into Automated Systems.</h1>
              <p className="landing-sub">
                COO &amp; Co-founder of DevRolin. I build custom AI SaaS platforms, CRM automations, and
                high-converting websites. 40+ systems deployed globally. No templates. No shortcuts.
              </p>

              <form className="landing-form" onSubmit={handleSubmit} noValidate>
                <div className="landing-field">
                  <label className="landing-label" htmlFor="lp-name">Name</label>
                  <input
                    id="lp-name"
                    className="landing-input"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="landing-field">
                  <label className="landing-label" htmlFor="lp-email">Email</label>
                  <input
                    id="lp-email"
                    className="landing-input"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="landing-field">
                  <label className="landing-label" htmlFor="lp-message">Message</label>
                  <textarea
                    id="lp-message"
                    className="landing-input landing-textarea"
                    name="message"
                    placeholder="Tell me about the problem you want automated…"
                    value={values.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="landing-submit" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <p className="landing-status landing-status--success">Thanks! I&apos;ll get back to you shortly.</p>
                )}
                {status === 'error' && (
                  <p className="landing-status landing-status--error">
                    Something went wrong — please try again, or reach out directly.
                  </p>
                )}
              </form>
            </div>

            <div className="landing-visual" data-fade>
              <div className="landing-frame">
                {portraitError ? (
                  <div className="landing-placeholder">
                    <span className="landing-placeholder-initials">MH</span>
                    <span className="landing-placeholder-text">Photo coming soon</span>
                  </div>
                ) : (
                  <Image
                    src="/images/mudassir.png"
                    alt="Mudassir H. — CRM Automation Expert"
                    fill
                    sizes="(max-width: 1023px) 100vw, 46vw"
                    className="landing-photo"
                    priority
                    onError={() => setPortraitError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Stats ── */}
      <section className="landing-stats" data-fade>
        <div className="landing-inner">
          <div className="stats-grid">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat-num">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Services ── */}
      <section className="landing-section">
        <div className="landing-inner">
          <div className="section-head">
            <div className="section-eyebrow">What I Do</div>
            <h2 className="section-title">Full-stack expertise, end to end.</h2>
            <p className="section-sub">From autonomous agents to polished interfaces — one team, no hand-offs.</p>
          </div>

          <div className="services-grid" data-fade>
            {SERVICES.map((service) => (
              <div className="service-card" key={service.title}>
                <div className="service-icon" aria-hidden="true">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Reviews ── */}
      <section className="landing-section landing-section--reviews">
        <div className="landing-inner">
          <div className="section-head">
            <div className="section-eyebrow">Client Reviews</div>
            <h2 className="section-title">What clients say.</h2>
            <p className="section-sub">Real feedback from teams I’ve built with across three continents.</p>
          </div>

          <div className="reviews-grid" data-fade>
            {REVIEWS.map((review) => (
              <div className="review-card" key={review.name}>
                <div className="review-stars" aria-hidden="true">★★★★★</div>
                <p className="review-text">“{review.quote}”</p>
                <div className="review-author">
                  <div className="review-initials">{review.initials}</div>
                  <div>
                    <div className="review-name">{review.name}</div>
                    <div className="review-role">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>
          © {new Date().getFullYear()} <span className="landing-footer-brand">Mudassir H.</span> — DevRolin.
          All rights reserved.
        </p>
      </footer>
    </div>
  )
}