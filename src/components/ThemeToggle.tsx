"use client"

// Theme choice lives in localStorage. The OS preference is only the default
// until a choice is stored. First paint uses CSS; this effect applies a stored choice.

import { useEffect, useState } from "react"
import type { Dict } from "@/i18n/dictionaries"
import { useLocalStorage } from "@/lib/useLocalStorage"

type Mode = "dark" | "light"

export default function ThemeToggle({ t }: { t: Dict }) {
  const [stored, setStored, hydrated] = useLocalStorage<Mode | null>("azarsang.theme", null)
  const [system, setSystem] = useState<Mode>("dark")

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)")
    const read = () => setSystem(mq.matches ? "light" : "dark")
    read()
    mq.addEventListener("change", read)
    return () => mq.removeEventListener("change", read)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (stored === "light" || stored === "dark") document.documentElement.dataset.theme = stored
    else delete document.documentElement.dataset.theme
  }, [hydrated, stored])

  const effective: Mode = stored === "light" || stored === "dark" ? stored : system
  const next: Mode = effective === "dark" ? "light" : "dark"

  return (
    <button type="button" className="theme-toggle" aria-pressed={effective === "dark"} onClick={() => setStored(next)}>
      {effective === "dark" ? t.theme.toDark : t.theme.toLight}
    </button>
  )
}
