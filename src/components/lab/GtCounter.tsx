"use client"

// A number that counts up once, when it first comes into view.
// The true value is what renders — SSR, no-JS and screen readers all get the real
// number. The count-up only starts at the moment the counter is actually visible,
// so the page never states a false zero waiting for an animation.

import { useEffect, useRef, useState } from "react"

export default function GtCounter({ to, ms = 900 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(to)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        setN(0)
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / ms)
          setN(Math.round(to * p))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, ms])

  return <span ref={ref}>{n}</span>
}
