"use client"

// VeinGraph — the living as-built map.
// Chambers are real systems from the registry; luminance comes only from /api/status.
// The frame never moves. Only the flow moves.
// V13 law: engine.decision is the ONE ember-framed chamber, and the final approach of its
// vein is the ONE gradient in the whole site — pulse resolving into ember, heat at the
// moment of decision. The gradient is userSpaceOnUse: bounding-box gradients vanish on
// axis-aligned lines, and a monument does not flicker.

import { useEffect, useState } from "react"
import { MOLTEN, SYSTEMS, VEINS } from "@/lib/systems"
import { luminance, toPersianDigits } from "@/lib/confidence"
import { useStatus } from "@/lib/useStatus"
import type { Dict, Lang } from "@/i18n/dictionaries"

const svgStyle = { width: "100%", height: "auto", display: "block" } as const
const moltenDim = { opacity: 0.4 } as const

export default function VeinGraph({ t, lang }: { t: Dict; lang: Lang }) {
  const status = useStatus()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true)
      return
    }
    const id = setTimeout(() => setEntered(true), 300)
    return () => clearTimeout(id)
  }, [])

  const stateOf = (id: string) => status?.systems.find((s) => s.id === id)

  return (
    <section className="monolith" aria-labelledby="graph-label">
      <span className="section-label" id="graph-label">{t.graph.label}</span>
      <div className="graph-wrap">
        <svg viewBox="0 0 1200 560" role="img" aria-label={t.graph.label} style={svgStyle}>
          <defs>
            {/* the one gradient · pulse → ember · anchored to the decision approach */}
            <linearGradient
              id="molten-vein"
              gradientUnits="userSpaceOnUse"
              x1={MOLTEN.x1} y1={MOLTEN.y1} x2={MOLTEN.x2} y2={MOLTEN.y2}
            >
              <stop offset="0" stopColor="var(--pulse)" />
              <stop offset="0.55" stopColor="var(--pulse)" />
              <stop offset="1" stopColor="var(--ember)" />
            </linearGradient>
          </defs>

          {VEINS.map((v, i) => {
            const src = stateOf(v.from)
            const lum = src ? luminance(src.confidence, src.state) : 0
            if (v.kind === "molten") {
              // the decision approach · molten only while the chamber is alive
              if (lum === 0) return <path key={i} d={v.d} className="vein-dark" />
              return (
                <path
                  key={i}
                  d={v.d}
                  fill="none"
                  stroke="url(#molten-vein)"
                  strokeWidth="3"
                  style={lum === 1 ? undefined : moltenDim}
                />
              )
            }
            if (v.kind === "dark" || lum === 0) {
              return <path key={i} d={v.d} className="vein-dark" />
            }
            const litStyle = { opacity: lum === 1 ? 1 : 0.4 }
            return (
              <path
                key={i}
                d={v.d}
                className={`vein-path ${entered ? "resolving" : ""} ${lum === 1 ? "verified" : ""}`}
                style={litStyle}
                pathLength={1}
              />
            )
          })}

          {SYSTEMS.map((sys) => {
            const st = stateOf(sys.id)
            const lit = st?.state === "up"
            const label = sys.id === "ask" ? "/ask" : sys.id === "chromadb" ? "ChromaDB" : sys.id
            const nodeClass = sys.decision
              ? "chamber-node chamber-node--decision"
              : `chamber-node ${lit ? "" : "chamber-node--dark"}`
            const labelClass = sys.decision
              ? "node-label node-label--decision"
              : `node-label ${lit ? "" : "node-label--dark"}`
            return (
              <g key={sys.id}>
                <rect x={sys.node.x} y={sys.node.y} width={sys.node.w} height={sys.node.h} className={nodeClass} />
                <text
                  x={sys.node.x + sys.node.w / 2}
                  y={sys.node.y + sys.node.h / 2 + 6}
                  className={labelClass}
                >{label}</text>
              </g>
            )
          })}

          {/* the air gap, annotated — the one distance that is a feature */}
          <text x="150" y="310" className="node-label node-label--dark" fontSize="13"
                direction={lang === "fa" ? "rtl" : "ltr"}>{t.graph.quarantineNote}</text>
        </svg>
      </div>
      <p className="witness graph-note">
        {t.graph.note}
        {status?.serverTime ? (
          <> · {lang === "fa" ? toPersianDigits(new Date(status.serverTime).toISOString().slice(11, 19)) : new Date(status.serverTime).toISOString().slice(11, 19)} UTC</>
        ) : null}
      </p>
    </section>
  )
}
