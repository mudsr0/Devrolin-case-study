'use client'

import { useRef } from 'react'
import { useTypingAnimation } from '@/hooks/useTypingAnimation'

const partnersText = {
  eyebrow: 'Trusted To Build What Businesses Depend On',
  headingLine1: 'More than a developer.',
  headingLine2: 'A systems partner.',
  subheading: 'I help businesses turn disconnected tools, manual processes and ambitious AI ideas into systems that actually work together.',
  description1: 'From the first workflow to the final deployment, I focus on what matters: <em>less manual work, stronger operations and systems built to scale with the business.</em>',
  locations: [
    { flag: '/images/flags/us.png', name: 'USA' },
    { flag: '/images/flags/gb.png', name: 'UK' },
    { flag: '/images/flags/ae.png', name: 'UAE' },
    { flag: '/images/flags/ca.png', name: 'CANADA' },
    { flag: '/images/flags/au.png', name: 'AUSTRALIA' },
    { flag: '/images/global.png', name: 'GLOBAL' }
  ],
  description2: 'From CRM automation and AI agents to custom APIs and SaaS platforms, every build starts with one question:',
  finalQuestion: 'What does this need to solve for the business?',
  videoUrl: 'https://www.youtube.com/embed/8KGhyl4qld0?rel=0'
}

export default function Partners() {
  const sectionRef = useRef(null)
  const eyebrowRef = useRef(null)

  useTypingAnimation(eyebrowRef, partnersText.eyebrow, { trigger: sectionRef, duration: 1.2 })

  return (
    <section className="partners-section" id="partners" ref={sectionRef}>
      <div className="partners-bg-glow" />
      <div className="partners-inner">
        <div className="partners-top-layout">
          <div className="partners-header">
            <div className="sec-eyebrow partners-eyebrow">
              <span className="eyebrow-line" />
              <span ref={eyebrowRef}></span>
              <span className="eyebrow-line" />
            </div>
            <h2 className="sec-h partners-heading">
              {partnersText.headingLine1} <span>{partnersText.headingLine2}</span>
            </h2>
            <h3 className="partners-subheading">{partnersText.subheading}</h3>
            <p className="sec-p partners-description" dangerouslySetInnerHTML={{ __html: partnersText.description1 }} />
            <div className="partners-locations">
              {partnersText.locations.map((loc, index) => (
                <span className="location-item" key={loc.name}>
                  <img src={loc.flag} alt={`${loc.name} Flag`} className="location-flag-img" />
                  {loc.name}
                  {index < partnersText.locations.length - 1 && <span className="location-dot"> · </span>}
                </span>
              ))}
            </div>
            <p className="sec-p partners-description">{partnersText.description2}</p>
            <h3 className="partners-final-question">{partnersText.finalQuestion}</h3>
          </div>
          <div className="partners-video">
            <iframe
              src={partnersText.videoUrl}
              title="YouTube testimonial video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}