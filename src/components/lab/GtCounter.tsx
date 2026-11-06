"use client"

// A number that counts up once, when it first comes into view.
// One observer, no library — the same mechanism the repo already uses for reveals.

import { useEffect, useRef, useState } from "react"

export default function GtCounter({ to, ms = 900 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(to)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setN(0)
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
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
