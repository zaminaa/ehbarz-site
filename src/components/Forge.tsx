"use client"

// THE FORGE · کورهٔ تصمیم — the surprise organ of V13.9.9.
// The confidence gate, made personal: write a decision, state your honest confidence.
// Below 60 nothing can get hot — the forge answers with THE WAIT, and that is honor.
// Above 60, COMMIT: the ember flashes once (280ms), the decision is carved into the
// ledger, and the stone cools from ember to bone. The ledger lives only in this browser.

import { useEffect, useState } from "react"
import { COMMIT_MS, GATE, toPersianDigits } from "@/lib/confidence"
import { useLocalStorage } from "@/lib/useLocalStorage"
import type { Dict, Lang } from "@/i18n/dictionaries"

type LedgerEntry = {
  text: string
  conf: number
  stamp: string
  at: number
}

export default function Forge({ t, lang }: { t: Dict; lang: Lang }) {
  const fa = lang === "fa"
  const [ledger, setLedger, hydrated] = useLocalStorage<LedgerEntry[]>("azarsang.ledger", [])
  const [text, setText] = useState("")
  const [conf, setConf] = useState(72)
  const [firing, setFiring] = useState(false)
  const [hotAt, setHotAt] = useState<number | null>(null)

  const open = conf >= GATE
  const ready = open && text.trim().length > 0

  useEffect(() => {
    // the freshly carved entry stays ember briefly, then the 6s cool-down begins
    if (hotAt === null) return
    const id = setTimeout(() => setHotAt(null), 400)
    return () => clearTimeout(id)
  }, [hotAt])

  const commit = () => {
    if (!ready) return
    const stamp = new Intl.DateTimeFormat(fa ? "fa-IR-u-nu-arabext" : "en-GB", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date())
    const at = Date.now()
    const entry: LedgerEntry = { text: text.trim(), conf, stamp, at }
    setLedger([entry, ...ledger].slice(0, 50))
    setText("")
    setHotAt(at)
    setFiring(true)
    setTimeout(() => setFiring(false), COMMIT_MS)
  }

  const verdict = !open ? t.forge.belowGate : ready ? t.forge.aboveGate : t.forge.aboveGateEmpty
  const confLabel = fa ? `${toPersianDigits(conf)} / ۱۰۰` : `${conf} / 100`
  const litWidth = { width: `${conf}%` } as const

  return (
    <section className="forge-shell" aria-labelledby="forge-title">
      <h1 className="monument monument-native" id="forge-title">{t.forge.title}</h1>
      <p className="forge-law">{t.forge.law}</p>

      <div className="forge-field">
        <label htmlFor="forge-decision">{t.forge.decisionLabel}</label>
        <input
          id="forge-decision"
          className="forge-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
          }}
          placeholder={t.forge.decisionPlaceholder}
          maxLength={140}
          autoComplete="off"
        />
      </div>

      <div className="forge-field">
        <label htmlFor="forge-conf">{t.forge.confLabel}</label>
        <div className="forge-gauge">
          <input
            id="forge-conf"
            type="range"
            min={0}
            max={100}
            value={conf}
            onChange={(e) => setConf(Number(e.target.value))}
            aria-valuetext={confLabel}
          />
          <span className="forge-conf">{confLabel}</span>
        </div>
        <div className="forge-gate" aria-hidden="true">
          <span className="lit" style={litWidth} />
          <span className="mark" />
        </div>
      </div>

      <p className="forge-verdict" aria-live="polite">
        {!open ? <span className="wait-square waiting" aria-hidden="true" /> : null}
        {verdict}
      </p>

      <button
        type="button"
        className={`forge-commit${firing ? " hot" : ""}`}
        disabled={!ready}
        onClick={commit}
      >
        {t.forge.commit}
      </button>

      <p className="witness">{t.forge.ledgerNote}</p>
      {hydrated && ledger.length > 0 ? (
        <ol className="forge-ledger">
          {ledger.map((entry) => (
            <li key={entry.at}>
              <span className={`dot${hotAt === entry.at ? "" : " cold"}`} aria-hidden="true" />
              <span>{entry.text}</span>
              <span className="stamp">
                {t.forge.confStamp} {fa ? toPersianDigits(entry.conf) : entry.conf} · {entry.stamp}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  )
}
