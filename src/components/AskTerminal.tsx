"use client"

// AskTerminal — the live doorway to the mind.
// While waiting: THE WAIT (0.5Hz). Below the gate: honorable silence, rendered.
//
// Persistence: the conversation log survives reloads via useLocalStorage —
// the ONLY sanctioned storage doorway (SSR-safe: reads happen in useEffect,
// first render is identical on server and client, hydration never tears).

import { useRef, useState } from "react"
import { toPersianDigits } from "@/lib/confidence"
import { useLocalStorage } from "@/lib/useLocalStorage"
import type { Dict, Lang } from "@/i18n/dictionaries"

type Entry =
  | { kind: "q"; text: string }
  | { kind: "a"; text: string; confidence: number | null }
  | { kind: "unknown"; text: string; confidence: number | null }

const titleStyle = { fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginBottom: "10px" } as const
const noteStyle = { marginTop: "6px" } as const
const clearStyle = { background: "none", border: "1px solid var(--edge)", color: "var(--ghost)", cursor: "pointer", fontFamily: "var(--font-witness)", fontSize: "0.75rem", padding: "4px 12px" } as const

export default function AskTerminal({ t, lang }: { t: Dict; lang: Lang }) {
  const [log, setLog, hydrated, clearLog] = useLocalStorage<Entry[]>("azarsang.ask.log", [])
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value.trim()
    if (!q || pending) return
    if (inputRef.current) inputRef.current.value = ""
    setLog((l) => [...l, { kind: "q", text: q }])
    setPending(true)
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      const data = (await res.json()) as { state: string; answer: string | null; confidence: number | null }
      if (data.state === "answered" && data.answer) {
        setLog((l) => [...l, { kind: "a", text: data.answer as string, confidence: data.confidence }])
      } else if (data.state === "held") {
        setLog((l) => [...l, { kind: "unknown", text: t.ask.held, confidence: data.confidence }])
      } else if (data.state === "absent") {
        setLog((l) => [...l, { kind: "unknown", text: t.ask.absent, confidence: null }])
      } else {
        setLog((l) => [...l, { kind: "unknown", text: t.ask.error, confidence: null }])
      }
    } catch {
      setLog((l) => [...l, { kind: "unknown", text: t.ask.error, confidence: null }])
    } finally {
      setPending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="ask-shell">
      <div>
        <h1 className="monument monument-native" style={titleStyle}>{t.ask.title}</h1>
        <p className="witness" style={noteStyle}>{t.ask.gateNote}</p>
      </div>

      <div className="ask-log" aria-live="polite">
        {hydrated && log.map((entry, i) => (
          <div key={i} className={`ask-entry ${entry.kind === "q" ? "q" : entry.kind === "unknown" ? "unknown" : ""}`}>
            <p className="ask-text">{entry.text}</p>
            {entry.kind !== "q" && entry.confidence !== null && (
              <p className="ask-meta">
                {t.chambers.confidence} {lang === "fa" ? toPersianDigits(entry.confidence) : entry.confidence}
              </p>
            )}
          </div>
        ))}
        {pending && (
          <div className="ask-entry unknown">
            <p className="ask-text"><span className="wait-square waiting" aria-hidden="true" />{t.ask.waiting}…</p>
          </div>
        )}
      </div>

      <form className="ask-form" onSubmit={ask}>
        <input
          ref={inputRef}
          className="ask-input"
          placeholder={t.ask.placeholder}
          aria-label={t.ask.title}
          maxLength={2000}
          autoComplete="off"
        />
        <button className="ask-send" type="submit" disabled={pending}>{t.ask.send}</button>
      </form>

      {hydrated && log.length > 0 && (
        <button type="button" style={clearStyle} onClick={clearLog}>
          {lang === "fa" ? "پاک کردن گفت‌وگو" : "clear conversation"}
        </button>
      )}
    </div>
  )
}
