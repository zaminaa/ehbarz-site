"use client"

// The journal strip. The seed (four real commits) is rendered on the server, so the block
// is whole before any JS runs; the client then asks the Worker and replaces it with live
// commits. If the Worker reports no live data, the seed stays and is labelled as such.

import { useEffect, useState } from "react"
import type { Dict } from "@/i18n/dictionaries"
import { SEED, repoUrl, type Journal } from "@/lib/journal"

export default function LabJournal({ t }: { t: Dict["lab"] }) {
  const j = t.journal
  const [data, setData] = useState<Journal>(SEED)

  useEffect(() => {
    let alive = true
    fetch("/api/journal")
      .then((r) => (r.ok ? (r.json() as Promise<Journal>) : null))
      .then((next) => {
        if (alive && next && next.commits.length > 0) setData(next)
      })
      .catch(() => {
        /* the seed already rendered; a silent journal is not a broken page */
      })
    return () => {
      alive = false
    }
  }, [])

  const label = data.source === "live" ? j.live : data.source === "cache" ? j.cached : j.absent

  return (
    <section className="lab-block lab-block--journal" aria-labelledby="journal-label">
      <div className="lab-head">
        <h2 id="journal-label">{j.label}</h2>
        <span className="lab-badge" data-source={data.source}>
          {label}
        </span>
      </div>
      <p className="lab-body">{j.body}</p>

      <ol className="journal">
        {data.commits.map((c) => (
          <li key={`${c.repo}-${c.sha}`}>
            <a href={`${repoUrl(c.repo)}/commit/${c.sha}`} target="_blank" rel="noopener noreferrer">
              <span className="journal-repo">{c.repo}</span>
              <span className="journal-subject">{c.subject}</span>
              <span className="journal-meta">
                <code>{c.sha}</code>
                <time dateTime={c.at}>{c.at.slice(0, 10)}</time>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
