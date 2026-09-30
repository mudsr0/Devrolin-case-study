'use client'

import { useEffect, useState } from 'react'

export default function usePauseOnHidden(ref) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref?.current
    if (!node) return

    // No IntersectionObserver support — assume visible and never pause.
    if (typeof IntersectionObserver === 'undefined') {
      const id = setTimeout(() => setIsVisible(true), 0)
      return () => clearTimeout(id)
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [ref])

  return isVisible
}