"use client"

// Witness — the footer as an honest instrument panel.
// Tehran time (live), server uptime (live or absent), running commit (live or absent),
// and the doorways out. Every number is live or absent — no third state.

import { useEffect, useState } from "react"
import { toPersianDigits } from "@/lib/confidence"
import { useStatus } from "@/lib/useStatus"
import SocialLinks from "./SocialLinks"
import type { Dict, Lang } from "@/i18n/dictionaries"

export default function Witness({ t, lang }: { t: Dict; lang: Lang }) {
  const status = useStatus()
  const [clock, setClock] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(lang === "fa" ? "fa-IR-u-nu-arabext" : "en-GB", {
      timeZone: "Asia/Tehran",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const update = () => setClock(fmt.format(new Date()))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [lang])

  const fmtUptime = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const raw = `${h}h ${m}m`
    return lang === "fa" ? toPersianDigits(raw) : raw
  }

  return (
    <footer className="witness-footer">
      <span>
        {t.witness.tehran} <strong>{clock ?? "—"}</strong>
      </span>
      <span>
        {t.witness.uptime}{" "}
        <strong>{status?.serverUptimeSec != null ? fmtUptime(status.serverUptimeSec) : t.witness.absent}</strong>
      </span>
      <span>
        {t.witness.commit} <strong>{status?.commit ?? t.witness.absent}</strong>
      </span>
      <SocialLinks />
      <span>
        {t.witness.motto} · {t.witness.frame}
      </span>
    </footer>
  )
}
