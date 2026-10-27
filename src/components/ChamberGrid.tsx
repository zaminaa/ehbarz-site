"use client"

// ChamberGrid — the real systems as chambers in the mass.
// State comes only from /api/status. Confidence renders only if reported. Latency
// renders only if measured. The quarantined chamber wears its distance; the decision
// chamber wears its thin ember outline — the only chamber allowed to.

import { SYSTEMS } from "@/lib/systems"
import { toPersianDigits } from "@/lib/confidence"
import { useStatus } from "@/lib/useStatus"
import type { Dict, Lang } from "@/i18n/dictionaries"

export default function ChamberGrid({ t, lang }: { t: Dict; lang: Lang }) {
  const status = useStatus()
  const fa = lang === "fa"
  const num = (n: number | string) => (fa ? toPersianDigits(n) : String(n))

  return (
    <section className="monolith" aria-labelledby="chambers-label">
      <span className="section-label" id="chambers-label">{t.chambers.label}</span>
      <p className="section-intro">{t.chambers.intro}</p>
      <div className="chamber-grid">
        {SYSTEMS.map((sys) => {
          const st = status?.systems.find((s) => s.id === sys.id)
          const stateKey = sys.quarantined ? "quarantined" : (st?.state ?? "absent")
          const stateLabel =
            stateKey === "quarantined"
              ? t.chambers.state.quarantined
              : stateKey === "up"
                ? t.chambers.state.up
                : stateKey === "down"
                  ? t.chambers.state.down
                  : t.chambers.state.absent
          const cardClass = `chamber-card${sys.quarantined ? " quarantined" : ""}${sys.decision ? " decision" : ""}`
          const dotClass = `status-dot${stateKey === "up" ? " up" : stateKey === "down" ? " down" : ""}`
          return (
            <article key={sys.id} className={cardClass}>
              <div className="chamber-id">
                <span>{sys.id}</span>
                <span className="status-line">
                  <i className={dotClass} aria-hidden="true" />
                  {stateLabel}
                </span>
              </div>
              <h3 className="chamber-name">{fa ? sys.nameFa : sys.nameEn}</h3>
              <p className="chamber-desc">{fa ? sys.descFa : sys.descEn}</p>
              {st?.state === "up" && st.confidence !== null ? (
                <p className="witness">
                  {t.chambers.confidence} <strong>{num(st.confidence)}٪</strong>
                  {st.latencyMs !== null ? (
                    <> · {t.chambers.latency} <strong>{num(st.latencyMs)}ms</strong></>
                  ) : null}
                </p>
              ) : null}
              <div className="chamber-stack">
                {sys.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
