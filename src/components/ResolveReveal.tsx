"use client"

// ResolveReveal — sections arrive with THE RESOLVE and settle at 90% presence.
// The last 10% is earned by attention (hover/focus). Nothing bounces.

import { useEffect, useRef, useState } from "react"

export default function ResolveReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResolved(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setResolved(true)
            obs.disconnect()
          }
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${resolved ? "resolved" : ""}`}>
      {children}
    </div>
  )
}
