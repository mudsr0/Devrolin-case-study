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
  { value: '18+ YRS', label: 'Building Systems' },
  { value: 'FORBES', label: 'Featured Client Experience' },
  { value: '1M+', label: 'Audience Systems' },
  { value: 'GLOBAL', label: 'Systems Built Across Markets' },
]

const SERVICES = [
  {
    icon: '⚙️',
    title: 'AI Automation & Integration',
    subtitle: 'Remove the work your team shouldn’t be doing.',
    desc: ' Connect your tools, APIs, data, and workflows so repetitive processes happen automatically instead of depending on someone remembering.',
    stack: ['n8n', 'Make', 'Zapier', 'APIs', 'Webhooks'],
  },
  {
    icon: '📈',
    title: 'CRM & Revenue Systems',
    subtitle: 'Make your CRM move revenue, not just store contacts.',
    desc: ' Lead routing, pipeline automation, follow-ups, lifecycle workflows, reporting, and integrations built to keep opportunities moving.',
    stack: ['GoHighLevel', 'Zoho CRM', 'HubSpot', 'Salesforce', 'Pipedrive'],
  },
  {
    icon: '🤖',
    title: 'AI Agents',
    subtitle: 'AI that does the work, not just talks about it.',
    desc: 'Agents for qualification, support, research, document processing, internal operations, and multi-step business workflows.',
    stack: ['OpenAI', 'Claude', 'LangGraph', 'CrewAI', 'RAG'],
  },
  {
    icon: '🚀',
    title: 'AI SaaS & MVPs',
    subtitle: 'Turn an idea into a product people can actually use.',
    desc: 'AI-powered products with the backend, authentication, dashboards, payments, integrations, and infrastructure required to move beyond a prototype.',
    stack: ['Next.js', 'React', 'Python', 'FastAPI', 'Supabase'],
  },
  {
    icon: '🐍',
    title: 'Python & Backend Systems',
    subtitle: 'When off-the-shelf automation isn’t enough.',
    desc: 'Custom APIs, backend services, databases, webhooks, and business logic for systems that need more flexibility and control.',
    stack: ['Python', 'FastAPI', 'Django', 'Node.js', 'REST APIs'],
  },
  {
    icon: '🎙️',
    title: 'Voice AI',
    subtitle: 'AI that can listen, respond, and take action.',
    desc: 'Voice agents built for inbound calls, lead qualification, appointment booking, support, and multilingual customer experiences.',
    stack: ['Vapi', 'Retell', 'ElevenLabs', 'Deepgram', 'Twilio'],
  },
]

const REVIEWS = [
  {
    quote: 'They were awesome and flexible, and they knocked our job out of the park. Beyond expectations, I will definitely use this team for our next project.',
    name: 'Mr.Julian',
    role: 'Noble School Chicago',
    initials: 'J',
  },
  {
    quote: 'Mudassir was great to work with.Delivered clean, thorough work across all milestones, communicated proactively, and met every deadline.Would gladly hire again.',
    name: 'Mr.Marco',
    role: 'Founder RubberDuck',
    initials: 'M',
  },
  {
    quote: 'Mudassir, worked really well, communicated well and completed quality work.We look forward to working with him again.',
    name: 'Mr.Dermot',
    role: 'Founder AWF',
    initials: 'D',
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
    <div className="landing" ref={rootRef} style={{ backgroundColor: '#000000' }}>
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

              <div className="landing-eyebrow">
                AI AUTOMATION &amp; INTEGRATION · CRM &amp; REVENUE SYSTEMS · AI AGENTS · AI SAAS &amp; MVPs
              </div>
              <h1 className="landing-title">Your business shouldn&apos;t depend on manual work.</h1>
              <p className="landing-sub">
                I build AI, automation, and CRM systems that connect your tools, remove operational bottlenecks,
                and keep critical workflows moving without constant human follow-up. <br />
              </p>
              <p className="landing-tags">Forbes-Featured Clients ·
                Systems Supporting 1M+ Audiences · 18+ Years Building Systems</p>

              <form id="lp-form" className="landing-form" onSubmit={handleSubmit} noValidate>
                <div className="landing-form-head">
                  <h2 className="landing-form-title">Have a bottleneck?</h2>
                  <p className="landing-form-sub">
                    Show me what&apos;s slowing the business down. A repetitive process, disconnected CRM, AI idea,
                    or workflow your team is still handling manually.
                  </p>
                  <p className="landing-form-sub-2">
                    Send me the problem. I&apos;ll tell you where
                    I&apos;d start.
                  </p>
                </div>

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
                    placeholder="What's slowing you down? Tell me about the process, system, or idea..."
                    value={values.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="landing-submit" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending…' : 'SHOW ME THE BOTTLENECK →'}
                </button>

                <p className="landing-form-foot">No sales pitch. Just a clear look at what I&apos;d solve first.</p>

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
            <div className="section-eyebrow">WHAT I DO</div>
            <h2 className="section-title">From one bottleneck to the system behind the business.</h2>
            <p className="section-sub">
              Sometimes the answer is one automation.
              Sometimes it&apos;s an entire platform. I build around the problem first, then choose the technology
              required to solve it properly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-fade>
            {SERVICES.map((service) => (
              <div
                className="bg-[#0e0e0e] border border-[#1F1F1F] rounded-xl p-6 transition-all duration-300 hover:border-[#ff7425] hover:shadow-[0_0_20px_rgba(255,116,37,0.15)]"
                key={service.title}
              >
                <div className="text-3xl text-[#ff7425] mb-4" aria-hidden="true">{service.icon}</div>
                <h3 className="font-bold text-white text-lg">{service.title}</h3>
                <p className="font-normal text-[#ff7425] text-sm">{service.subtitle}</p>
                <p className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">{service.desc}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.stack.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#1F1F1F] text-[#9CA3AF] text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Why Clients Hire Me ── */}
      <section className="landing-section" data-fade>
        <div className="landing-inner">
          <div className="section-head">
            <div className="section-eyebrow">Built around the business</div>
            <h2 className="section-title">You shouldn&apos;t have to manage your developer. </h2>
          </div>
          <div className="landing-about">
            <p className="section-sub">
              I don&apos;t start by asking which tool you want. I
              start by understanding <strong className="text-white">where time, revenue, or opportunities are being lost.</strong> Then I work backward from
              the outcome and build the simplest system that solves the problem properly.
            </p>
            <p className="section-sub">
              <strong className="text-white">Clear thinking. Clear communication. Real ownership. </strong>
              No forcing every problem into the same platform.
              No unnecessary technical complexity. No calling something finished because it worked once.
            </p>
            <p className="section-sub landing-about-highlight">
              <strong>Understand it. Build it. Break it. Test it. Ship it.</strong> That&apos;s how I build systems
              businesses can actually depend on.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Reviews ── */}
      <section className="landing-section landing-section--reviews">
        <div className="landing-inner">
          <div className="section-head">
            <div className="section-eyebrow">Client Reviews</div>
            <h2 className="section-title">The best proof is what happens after delivery.</h2>
            <p className="section-sub"> Real feedback from clients  I&apos;ve built with.</p>
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

      {/* ── 6. Final CTA ── */}
      <section className="landing-section" data-fade>
        <div className="landing-inner">
          <div className="landing-cta">
            <div className="section-eyebrow">HAVE SOMETHING THAT SHOULD WORK BETTER?</div>
            <h2 className="section-title">Show me the bottleneck.</h2>
            <p className="section-sub">
              You don&apos;t need to know whether the answer is AI, automation, CRM, Python,
              or a custom platform.  <strong className="text-[#ff7425]"> Just tell me what&apos;s not working the way it should. </strong>  I&apos;ll look at the
              problem and tell you where I&apos;d start.
            </p>
            <a className="landing-submit landing-submit--link" href="#lp-form">
              DISCUSS YOUR SYSTEM →
            </a>
            <p className="landing-cta-note">Available for selected projects and long-term collaborations.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">Mudassir.</div>
        <p className="landing-footer-tagline">
          AI Automation &amp; Integration · CRM &amp; Revenue Systems · AI Agents · AI SaaS &amp; MVPs. Building
          systems businesses can actually depend on.
        </p>
        <p className="landing-footer-copyright">© 2026 Mudassir H.</p>
      </footer>
    </div>
  )
}