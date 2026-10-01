'use client'

import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from '@/data/siteData'
import { ShieldCheck, ClipboardCheck, FileText, Lock, Wrench, Calendar, MessageCircle, Send, Mail, ChevronRight, CodeXml, ChartNoAxesColumn } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const scrollToVideo = (e) => {
  e.preventDefault()
  const target = document.getElementById('video-demo')
  if (target) {
    // Check if Lenis is available globally or use native smooth scroll
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: 70 })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function RichText({ html, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

function SectionHeading({ eyebrow, heading, sub, style }) {
  return (
    <>
      <div className="section-eyebrow">{eyebrow}</div>
      <div className="section-heading">{heading}</div>
      {sub && <div className="section-sub" style={style}>{sub}</div>}
    </>
  )
}

export default function CaseStudyDetail({ data, audience = 'upwork' }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const fadeEls = gsap.utils.toArray('[data-fade]')
      if (!fadeEls.length) return

      gsap.set(fadeEls, { opacity: 0, y: 30 })

      fadeEls.forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      ScrollTrigger.refresh()
      const rafId = requestAnimationFrame(() => ScrollTrigger.refresh())
      let fontsReady = null
      if (document.fonts && document.fonts.ready) {
        fontsReady = document.fonts.ready.then(() => ScrollTrigger.refresh())
      }

      const revealVisible = () => {
        fadeEls.forEach((el) => {
          const rect = el.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (Number(gsap.getProperty(el, 'opacity')) < 1) {
              gsap.to(el, {
                opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                overwrite: true,
              })
            }
          }
        })
      }
      window.addEventListener('scroll', revealVisible, { passive: true })
      revealVisible()

      return () => {
        cancelAnimationFrame(rafId)
        if (fontsReady && typeof fontsReady.cancel === 'function') fontsReady.cancel()
        window.removeEventListener('scroll', revealVisible)
      }
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  if (!data) {
    return (
      <div className={`case-study ${audience === 'cold' ? 'cold-theme' : 'upwork-theme'} wrap`} style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <h1>Case study not found</h1>
        <p style={{ margin: '12px 0 24px', color: '#A8A8A8' }}>We couldn&apos;t find the case study you&apos;re looking for.</p>
        <Link href="/" className="watch-demo-btn">Back to home</Link>
      </div>
    )
  }

  const { builder, hero, problem, video, built, outcome, testimonial, process, cta } = data

  const riskData = {
    eyebrow: 'Built to remove the risk',
    heading: (
      <>
        The build is only half the job.{' '}
        <span className="rr-accent">Making sure it works after handoff</span>{' '}
        is the other half.
      </>
    ),
    sub: 'You’re not left with code and a “good luck.”',
    items: [
      { icon: CodeXml, title: 'Full ownership of your system', desc: 'Source code, assets and access.' },
      { icon: ChartNoAxesColumn, title: '30-day performance audit', desc: 'Make sure everything is working as expected.' },
      { icon: FileText, title: 'Documentation + walkthrough', desc: 'Your team can manage it easily.' },
      { icon: Lock, title: 'NDA, confidentiality & IP agreements welcome', desc: 'Your business stays protected.' },
      { icon: ShieldCheck, title: '1-week free post-launch maintenance', desc: 'We’re here after delivery.' },
    ],
    videoKicker: 'Don’t take my word for it.',
    videoTitle: 'Real clients. Proven results. 🏆',
    videoUrl: 'https://www.youtube.com/embed/8KGhyl4qld0?rel=0',
    locations: [
      { flag: '/images/flags/us.png', name: 'USA' },
      { flag: '/images/flags/gb.png', name: 'UK' },
      { flag: '/images/flags/ae.png', name: 'UAE' },
      { flag: '/images/flags/ca.png', name: 'CANADA' },
      { flag: '/images/flags/au.png', name: 'AUSTRALIA' },
      { flag: '/images/global.png', name: 'GLOBAL' },
    ],
  }

  const mail = (su) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteData.contactEmail)}&su=${encodeURIComponent(su)}`

  const ctaButtons = [
    { href: mail('Book a Call'), cls: 'cx-call', icon: Calendar, label: 'Book a Quick Call', caption: '15-minute call to discuss your project.' },
    { href: siteData.whatsappLink, cls: 'cx-wa', icon: MessageCircle, label: 'WhatsApp Me', caption: 'Fastest way to reach me.' },
    { href: siteData.telegramLink, cls: 'cx-tg', icon: Send, label: 'Telegram', caption: 'Message me directly.' },
  ]

  return (
    <div className={`case-study ${audience === 'cold' ? 'cold-theme' : 'upwork-theme'}`} ref={rootRef}>
      <header className="cs-topbar">
        <div className="cs-topbar-inner">
          <Link href="/" className="cs-logo">
            Mudassir <span className="cs-logo-accent">H.</span>
          </Link>
          {audience === 'upwork' && cta?.upworkUrl && (
            <a href={cta.upworkUrl} target="_blank" rel="noopener noreferrer" className="cs-upwork-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
              </svg>
              Hire me on Upwork
            </a>
          )}
        </div>
      </header>

      <div className="wrap">

        {/* ── 1. Builder intro ── */}
        <section className="builder-section">
          <div className="builder-card" data-fade>
            <div className="builder-avatar">
              <img
                src={audience === 'upwork' ? '/images/mudassir-green.jpeg' : '/images/mudassir.png'}
                alt={builder.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div className="builder-meta">
              <div className="builder-from">Sent personally by</div>
              <div className="builder-name">{builder.name}</div>
              <div className="builder-expertise">CRM Automation & Sales Systems Expert</div>
              <p className="builder-note">
                {builder.note}
              </p>
              <button onClick={scrollToVideo} className="watch-demo-btn">
                Watch the live demo
                <span className="arrow-wrap">
                  <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. Hero ── */}
        <section className="hero-section" data-fade>
          <div className="project-tag">
            <div className="project-tag-dot"></div>
            {hero.tag}
          </div>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: hero.title }}></h1>
          <p className="hero-body">{hero.body}</p>
          {Array.isArray(hero.pills) && hero.pills.length > 0 && (
            <div className="result-pills">
              {hero.pills.map((pill, index) => (
                <span key={`pill-${index}`} className="pill"><span className="pill-dot"></span>{pill}</span>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. The problem ── */}
        <section className="problem-section" data-fade>
          <SectionHeading eyebrow={problem.eyebrow} heading={problem.heading} sub={problem.sub} />
          {Array.isArray(problem.pains) && problem.pains.length > 0 && (
            <div className="pain-list-minimal">
              {problem.pains.map((pain, index) => (
                <div key={`pain-${index}`} className="pain-item-minimal">
                  <span className="pain-dot"></span>
                  <span className="pain-text-minimal">{pain}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Video anchor section ── */}
        <section className="video-section" id="video-demo" data-fade>
          <SectionHeading eyebrow={video.eyebrow} heading={video.heading} sub={video.sub} />
          {typeof video.embedUrl === 'string' && video.embedUrl.length > 0 && (
            <div className="browser-frame">
              <div className="browser-bar">
                <div className="browser-dots">
                  <div className="dot-r"></div><div className="dot-y"></div><div className="dot-g"></div>
                </div>
                <div className="browser-url">
                  <span className="lock-icon">🔒</span>
                  {video.label || 'Live System Demo'}
                </div>
              </div>
              <div className="browser-video">
                <iframe
                  src={video.embedUrl}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={`${builder.name} ${hero.tag} demo`}
                ></iframe>
              </div>
              <div className="browser-footer">
                <div className="bfooter-label">
                  <div className="rec-dot"></div>
                  {video.label}
                </div>
                {typeof video.openUrl === 'string' && video.openUrl.length > 0 && (
                  <a href={video.openUrl} target="_blank" rel="noopener" className="open-link">
                    Open fullscreen ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── 5. What was built ── */}
        <section className="built-section" data-fade>
          <SectionHeading eyebrow={built.eyebrow} heading={built.heading} sub={built.sub} />
          {Array.isArray(built.items) && built.items.length > 0 && (
            <div className="built-grid">
              {built.items.map((item, index) => (
                <div key={`built-${index}`} className="built-card">
                  <div className="built-num">{item.num}</div>
                  <div className="built-title">{item.title}</div>
                  <div className="built-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 6. Outcome numbers ── */}
        <section className="outcome-section" data-fade>
          <SectionHeading eyebrow={outcome.eyebrow} heading={outcome.heading} sub={outcome.sub} style={{ marginBottom: '20px' }} />
          {Array.isArray(outcome.items) && outcome.items.length > 0 && (
            <div className="outcome-grid">
              {outcome.items.map((item, index) => (
                <div key={`outcome-${index}`} className="outcome-card">
                  <div className="outcome-num">{item.num}</div>
                  <div className="outcome-label">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 7. Testimonial ── */}
        {testimonial && (
          <section className="testimonial-section" data-fade>
            <SectionHeading eyebrow={testimonial.eyebrow} heading={testimonial.heading} sub={testimonial.sub} style={{ marginBottom: '20px' }} />
            <div className="tcard">
              <div className="tcard-quote-mark">&ldquo;</div>
              <div className="tcard-stars">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="tcard-text"><RichText html={testimonial.quote} /></p>
              <div className="tcard-author">
                <div className="tcard-avatar">{testimonial.initials}</div>
                <div>
                  <div className="tcard-name">{testimonial.author}</div>
                  <div className="tcard-role">{testimonial.role}</div>
                </div>
                <div className="tp-badge">Verified Client</div>
              </div>
            </div>
          </section>
        )}

        {/* ── Risk Reversal ── */}
        <section className="rr-section" data-fade>
          <div className="rr-eyebrow">{riskData.eyebrow}</div>

          <div className="rr-grid">
            <div className="rr-left">
              <h2 className="rr-heading">{riskData.heading}</h2>
              <p className="rr-sub">{riskData.sub}</p>

              <div className="rr-card">
                {riskData.items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={`risk-${i}`} className="rr-item">
                      <div className="rr-icon"><Icon size={22} /></div>
                      <div>
                        <div className="rr-item-title">{item.title}</div>
                        <div className="rr-item-desc">{item.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="rr-flags">
                {riskData.locations.map((loc) => (
                  <span key={loc.name} className="rr-flag">
                    <img src={loc.flag} alt="" width="20" height="20" loading="lazy" />
                    {loc.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="rr-right">
              <div className="rr-video-card">
                <div className="rr-video-head">
                  <div className="rr-video-kicker"><span className="rr-line" />{riskData.videoKicker}</div>
                  <div className="rr-video-title">{riskData.videoTitle}</div>
                </div>
                <div className="rr-video-player">
                  <iframe
                    src={riskData.videoUrl}
                    title="Client Results"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. How I work ── */}
        <section className="process-section" data-fade>
          <SectionHeading eyebrow={process.eyebrow} heading={process.heading} sub={process.sub} style={{ marginBottom: '28px' }} />
          {Array.isArray(process.steps) && process.steps.length > 0 && (
            <div className="process-steps">
              {process.steps.map((step, index) => (
                <div key={`step-${index}`} className="process-step">
                  <div className="pstep-num">{step.num}</div>
                  <div className="pstep-content">
                    <div className="pstep-title">{step.title}</div>
                    <div className="pstep-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Multi-Option CTA ── */}
        <section className="cx-section" data-fade>
          <div className="cx-divider" />
          <div className="cx-grid">
            <div className="cx-left">
              <div className="rr-eyebrow">Let’s see if this makes sense</div>
              <h2 className="cx-heading">
                Got something you’re trying to <span className="rr-accent">build or fix?</span>
              </h2>
              <p className="cx-sub">
                Send me what you have. A Loom, screenshots, existing system or even a rough idea.
                I’ll take a look and tell you how I’d approach it.
              </p>
            </div>

            <div className="cx-right">
              <div className="cx-btn-row">
                {ctaButtons.map((b) => {
                  const Icon = b.icon
                  return (
                    <div key={b.label} className="cx-btn-wrap">
                      <a href={b.href} target="_blank" rel="noopener noreferrer" className={`cx-btn ${b.cls}`}>
                        <span className="cx-btn-icon"><Icon size={20} /></span>
                        <span className="cx-btn-label">{b.label}</span>
                        <ChevronRight size={16} className="cx-chevron" />
                      </a>
                      <div className="cx-caption">{b.caption}</div>
                    </div>
                  )
                })}
              </div>

              <div className="cx-details">
                <a href={mail('Project Details')} target="_blank" rel="noopener noreferrer" className="cx-details-btn">
                  <span className="cx-details-icon"><Mail size={18} /></span>
                  <span className="cx-btn-label">Send Project Details</span>
                  <ChevronRight size={16} className="cx-chevron" />
                </a>
                <div className="cx-details-note">
                  Not a call person? No problem.<br />Message me instead.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. Footer ── */}
        <footer className="cs-footer" data-fade>
          <div className="cs-footer-inner">
            <div className="cs-footer-brand">
              <div className="cs-logo">Mudassir <span className="cs-logo-accent">H.</span></div>
              <p className="cs-footer-tagline">CRM Automation · Sales Systems · SaaS MVPs · Custom Platforms</p>
            </div>
            <div className="cs-footer-links">
              {audience === 'upwork' && cta?.upworkUrl && (
                <a href={cta.upworkUrl} target="_blank" rel="noopener noreferrer" className="cs-footer-link cs-footer-upwork">
                  Upwork Profile
                </a>
              )}
              {siteData.contactEmail && (
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteData.contactEmail)}`} className="cs-footer-link">
                  Direct Email
                </a>
              )}
            </div>
          </div>
          <div className="cs-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Mudassir H. All rights reserved.</p>
          </div>
        </footer>

      </div>

      {/* Floating Contact Icons */}
      <div className="cs-floating-contacts">
        <a href={siteData.whatsappLink} target="_blank" rel="noopener noreferrer" className="cs-float-btn cs-whatsapp" aria-label="WhatsApp" title="Chat on WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
        </a>
        <a href={siteData.telegramLink} target="_blank" rel="noopener noreferrer" className="cs-float-btn cs-telegram" aria-label="Telegram" title="Message on Telegram">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.324-.437.89-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
        </a>
        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteData.contactEmail)}`} target="_blank" rel="noopener noreferrer" className="cs-float-btn cs-gmail" aria-label="Email" title="Send an email">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
        </a>
      </div>
    </div>
  )
}
