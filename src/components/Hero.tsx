"use client"

// Hero — the wordmark as a living organ.
// One carved channel through both scripts; fill = live mean confidence, capped at 98%.
// The unfinished 2% holds the ember point — ناتمامی می‌درخشد (the unfinished part glows).
// Beat 1: 300ms stillness · Beat 2–3: THE RESOLVE to 90% · Beat 4: the rest is earned by real data.
// Between 01:00–06:00 Tehran the ember smolders at 0.2Hz — THE SMOLDER, nowhere else.

import { useEffect, useRef, useState } from "react"
import { isTehranNight, toPersianDigits, wordmarkFill } from "@/lib/confidence"
import { useStatus } from "@/lib/useStatus"
import type { Dict, Lang } from "@/i18n/dictionaries"

export default function Hero({ t, lang }: { t: Dict; lang: Lang }) {
  const status = useStatus()
  const [phase, setPhase] = useState<"still" | "resolving" | "verified">("still")
  const [night, setNight] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced.current) {
      setPhase("resolving") // static at the hesitation point — fully legible
      return
    }
    const still = setTimeout(() => setPhase("resolving"), 300)
    return () => clearTimeout(still)
  }, [])

  useEffect(() => {
    // THE SMOLDER wakes only in Tehran's deep night — checked on mount, re-checked each minute
    setNight(isTehranNight())
    const id = setInterval(() => setNight(isTehranNight()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // the last stretch is earned only when real telemetry answers
    if (phase !== "resolving" || reduced.current) return
    if (status && status.meanConfidence !== null) {
      const t2 = setTimeout(() => setPhase("verified"), 1700)
      return () => clearTimeout(t2)
    }
  }, [phase, status])

  const fill = status ? wordmarkFill(status.meanConfidence) : 0.9
  const offset = phase === "still" ? 1 : phase === "verified" ? 1 - fill : 0.1

  const conf = status?.meanConfidence ?? null
  const witnessLine =
    conf === null
      ? t.hero.confidenceAbsent
      : lang === "fa"
        ? `${t.hero.confidenceLive} ${toPersianDigits(conf)}٪ · در جریان`
        : `${t.hero.confidenceLive} ${conf} · flowing`

  const veinClass = `vein-path ${phase === "resolving" ? "resolving" : ""} ${phase === "verified" ? "verified" : ""}`
  const emberClass = `ember-point ${night ? "night" : ""}`

  return (
    <section className="hero" aria-label="EHBARZ">
      <p className="hero-kicker">{t.hero.kicker}</p>

      <svg className="hero-svg" viewBox="0 0 1200 460" role="img" aria-label="EHBARZ · اح‌بارز">
        <text
          x="600" y="200" textAnchor="middle"
          fontFamily="'Monument Extended','Archivo Black','Arial Black',Arial,sans-serif"
          fontWeight="900" fontSize="120" letterSpacing="18" fill="var(--bone)"
        >EHBARZ</text>
        <text
          x="600" y="395" textAnchor="middle" direction="rtl"
          fontFamily="Estedad,'Noto Sans Arabic',Vazirmatn,sans-serif"
          fontWeight="900" fontSize="104" fill="var(--bone)"
        >اح‌بارز</text>

        {/* the carve — one channel through both scripts, cut from the same void */}
        <line x1="40" y1="157" x2="1160" y2="157" stroke="var(--void)" strokeWidth="18" />
        <line x1="40" y1="358" x2="1160" y2="358" stroke="var(--void)" strokeWidth="18" />

        {/* unlit channel walls — the full route is always visible */}
        <path d="M80,157 H1120 M1120,358 H80" className="vein-dark" strokeWidth="5" />

        {/* the current · enters through EHBARZ, returns through اح‌بارز · one circuit · stops at 98% */}
        <path
          d="M80,157 H1120 M1120,358 H80"
          className={veinClass}
          strokeWidth="5"
          pathLength={1}
          style={offsetStyle(offset)}
        />

        {/* the ember point · breathing in the unfinished gap · the frame's ONE ember moment */}
        <circle cx="56" cy="358" r="6" className={emberClass} />
      </svg>

      <p className="hero-statement">{t.hero.statement}</p>
      <p className="hero-witness" aria-live="polite">{status === undefined ? "…" : witnessLine}</p>
      <p className="hero-scroll" aria-hidden="true">↓ {t.hero.scrollHint}</p>
    </section>
  )
}

// verified fill is data-driven, so the dashoffset must be inline — built here to keep JSX free of object literals
function offsetStyle(offset: number): React.CSSProperties | undefined {
  if (offset === 0.1 || offset === 1) return undefined // CSS classes own the canonical beats
  return { strokeDashoffset: offset }
}
