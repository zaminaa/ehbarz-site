"use client"

// The StackWeight scan, replayed step by step on the tool's own sample dataset.
// One rAF clock drives every derived value — no library, no per-element animation state.
// The receipt is an inline SVG in the product card's own 1200×630 shape, downloadable as PNG.

import { useCallback, useEffect, useRef, useState } from "react"
import type { Dict } from "@/i18n/dictionaries"
import { SAMPLE_SCAN, fmtK } from "@/lib/lab"

// one clock for the whole scan: five steps, ~900ms each
const DURATION = 5 * 900 + 600

// The card sets its own type with presentation attributes rather than CSS classes, so a
// serialized copy (the PNG download) is self-contained instead of unstyled.
const CARD = {
  label: { fill: "#E8EAED", fontSize: 20, letterSpacing: 2, fontFamily: "ui-sans-serif, system-ui, sans-serif" },
  big: { fill: "#E8EAED", fontSize: 88, fontFamily: "ui-monospace, Consolas, monospace" },
  sub: { fill: "#E8EAED", fontSize: 28, fontFamily: "ui-sans-serif, system-ui, sans-serif" },
  body: { fill: "#E8EAED", fontSize: 24, fontFamily: "ui-sans-serif, system-ui, sans-serif" },
  row: { fill: "#E8EAED", fontSize: 18, fontFamily: "ui-sans-serif, system-ui, sans-serif" },
  mono: { fill: "#E8EAED", fontSize: 18, fontFamily: "ui-monospace, Consolas, monospace" },
  dead: { fill: "#FF5C5C", fontSize: 22, fontFamily: "ui-sans-serif, system-ui, sans-serif" },
} as const

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2)
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export default function StackWeightDemo({ t }: { t: Dict["lab"] }) {
  const s = t.sw
  const [progress, setProgress] = useState(0)
  const [runId, setRunId] = useState(0)
  const hostRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const raf = useRef(0)
  const started = useRef(false)

  const start = useCallback(() => {
    if (typeof window === "undefined") return
    cancelAnimationFrame(raf.current)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setProgress(1)
      return
    }
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = clamp01((now - t0) / DURATION)
      setProgress(p)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [])

  // runs once, when the demo first comes into view — and again whenever the visitor asks
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true
          start()
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
    }
  }, [start])

  useEffect(() => {
    if (runId > 0) start()
  }, [runId, start])

  const p = ease(progress)
  const step = Math.min(4, Math.floor(p * 5))
  const done = progress >= 1
  const w = SAMPLE_SCAN.totals

  // counters settle in the order the scan discovers them
  const stack = Math.round(w.stackWeight * clamp01((p - 0.1) / 0.25))
  const dead = Math.round(w.deadWeight * clamp01((p - 0.3) / 0.25))
  const after = Math.round(w.afterPruneWeight * clamp01((p - 0.75) / 0.2))
  const shownItems = Math.round(SAMPLE_SCAN.heaviest.length * clamp01((p - 0.2) / 0.35))

  const download = useCallback(async () => {
    const svg = svgRef.current
    if (!svg) return
    const xml = new XMLSerializer().serializeToString(svg)
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }))
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 1200
      canvas.height = 630
      canvas.getContext("2d")?.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (!blob) return
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = "stackweight-receipt-sample.png"
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      }, "image/png")
    }
    img.src = url
  }, [])

  return (
    <section className="lab-block" ref={hostRef} aria-labelledby="sw-label">
      <div className="lab-head">
        <h2 id="sw-label">{s.label}</h2>
        <span className="lab-badge">{t.sample}</span>
      </div>
      <p className="lab-body">{s.body}</p>

      <div className="sw-grid">
        <div className="sw-scan">
          <ol className="sw-steps">
            {s.steps.map((label, i) => (
              <li key={label} data-state={i < step ? "past" : i === step ? "now" : "next"}>
                <span className="sw-step-mark" aria-hidden="true" />
                <span>{label}</span>
                <span className="sw-step-time" aria-hidden="true">
                  {i < step || done ? "✓" : i === step ? "…" : ""}
                </span>
              </li>
            ))}
          </ol>

          <dl className="sw-metrics">
            <div>
              <dt>{s.stackWeight}</dt>
              <dd>
                <strong>{fmtK(stack)}</strong> <span>tokens/msg</span>
              </dd>
            </div>
            <div>
              <dt>{s.dead}</dt>
              <dd>
                <strong>{(stack ? Math.round((dead / w.stackWeight) * 100) : 0).toLocaleString("en-US")}%</strong>{" "}
                <span>{fmtK(dead)}</span>
              </dd>
            </div>
            <div>
              <dt>{s.after}</dt>
              <dd>
                <strong>{after ? fmtK(after) : "—"}</strong>
              </dd>
            </div>
          </dl>

          <ul className="sw-agents">
            {SAMPLE_SCAN.harnesses.map((h, i) => (
              <li key={h.label}>
                <span className="sw-agent-name">{h.label}</span>
                <span className="sw-agent-bar">
                  <i style={{ inlineSize: `${clamp01((p - 0.15 - i * 0.05) / 0.4) * (h.weight / 2660) * 100}%` }} />
                </span>
                <span className="sw-agent-num">
                  {fmtK(Math.round(h.weight * clamp01((p - 0.15 - i * 0.05) / 0.25)))}/msg
                </span>
                <span className="sw-agent-dead">{h.deadPct}%</span>
              </li>
            ))}
          </ul>

          <ul className="sw-heaviest">
            {SAMPLE_SCAN.heaviest.slice(0, shownItems).map((item) => (
              <li key={item.name}>
                <span className="sw-item-name">{item.name}</span>
                <span className="sw-item-w">{item.weight}</span>
                <span className="sw-item-v" data-v={item.verdict}>
                  {item.verdict}
                </span>
              </li>
            ))}
          </ul>

          <div className="lab-actions">
            <button type="button" className="lab-btn" onClick={() => setRunId((n) => n + 1)}>
              {progress > 0 ? s.rerun : s.run}
            </button>
            <p className="lab-note">{s.sampleNote}</p>
          </div>
        </div>

        <figure className={"sw-card-wrap" + (done ? " is-ready" : "")}>
          <svg
            ref={svgRef}
            className="sw-card"
            viewBox="0 0 1200 630"
            width="1200"
            height="630"
            role="img"
            aria-label={`${s.receipt}: ${fmtK(w.stackWeight)} tokens, ${w.deadPct}% dead`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="1200" height="630" fill="#0B0D10" />
            <text x="80" y="80" {...CARD.label}>
              MY AGENT STACK WEIGHS
            </text>
            <text x="80" y="190" {...CARD.big}>
              ≈{fmtK(Math.round(w.stackWeight * p))}
            </text>
            <text x="80" y="240" {...CARD.sub}>
              tokens
            </text>
            <text x="80" y="290" {...CARD.body}>
              {Math.round((w.deadWeight / w.stackWeight) * 100 * p)}% is dead weight — unused for {SAMPLE_SCAN.windowDays} days
            </text>
            <rect x="80" y="320" width="1040" height="18" rx="9" fill="#3DDC97" opacity={p} />
            <rect
              x={80 + 1040 - Math.round((w.deadPct / 100) * 1040 * p)}
              y="320"
              width={Math.round((w.deadPct / 100) * 1040 * p)}
              height="18"
              rx="9"
              fill="#FF5C5C"
            />
            {SAMPLE_SCAN.harnesses.map((h, i) => (
              <g key={h.label} opacity={clamp01((p - 0.2 - i * 0.08) / 0.2)}>
                <text x="80" y={370 + i * 36} {...CARD.row}>
                  {h.label}
                </text>
                <rect x="280" y={354 + i * 36} width="280" height="14" rx="7" fill="#1C2128" />
                <rect
                  x="280"
                  y={354 + i * 36}
                  width={(h.weight / 2660) * 280}
                  height="14"
                  rx="7"
                  fill="#3DDC97"
                />
                <text x="580" y={370 + i * 36} {...CARD.mono}>
                  {fmtK(h.weight)}/msg
                </text>
              </g>
            ))}
            <text x="80" y="540" {...CARD.dead} opacity={clamp01((p - 0.5) / 0.3)}>
              ≈{fmtK(w.deadTokensResent)} tokens of dead weight re-sent in the last {SAMPLE_SCAN.windowDays} days
            </text>
            <text x="80" y="590" {...CARD.mono}>
              npx stackweight
            </text>
            <text x="1120" y="590" {...CARD.row} textAnchor="end">
              local-only · SAMPLE DATA
            </text>
          </svg>
          <figcaption>
            <span>{s.receipt}</span>
            <button type="button" className="lab-btn lab-btn--quiet" onClick={download} disabled={!done}>
              {s.download}
            </button>
            <em>{s.cardNote}</em>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

