'use client'

import { useEffect } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function useTypingAnimation(ref, text, options = {}) {
  const { trigger, duration = 1, startDelay = 0 } = options

  useEffect(() => {
    const target = ref?.current
    if (!target || !text) return

    const chars = Array.from(text)
    const reduceMotion =
      typeof window !== 'undefined' &&
      (!window.matchMedia || window.matchMedia(REDUCED_MOTION_QUERY).matches)

    // Reduced motion renders the full string on the first frame.
    const totalMs = reduceMotion ? 0 : Math.max(0.05, duration) * 1000
    const startedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + startDelay * 1000

    let frameId = 0
    let observer = null

    const render = (now) => {
      const elapsed = now - startedAt

      if (elapsed < 0) {
        target.textContent = ''
        frameId = requestAnimationFrame(render)
        return
      }

      const progress = totalMs > 0 ? Math.min(1, elapsed / totalMs) : 1
      const count = progress >= 1 ? chars.length : Math.ceil(progress * chars.length)

      target.textContent = chars.slice(0, count).join('')

      if (count < chars.length) frameId = requestAnimationFrame(render)
    }

    const start = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(render)
    }

    const triggerNode = trigger?.current

    if (triggerNode && !reduceMotion && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          observer = null
          start()
        },
        { threshold: 0.25 }
      )

      observer.observe(triggerNode)
    } else {
      // No trigger, no observer support, or reduced motion — render right away.
      start()
    }

    return () => {
      cancelAnimationFrame(frameId)
      if (observer) observer.disconnect()
    }
  }, [ref, text, trigger, duration, startDelay])
}

export default useTypingAnimation