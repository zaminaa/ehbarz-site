"use client"

// LangMemory — remembers which voice the visitor chose.
// Client-only by law: localStorage is touched exclusively inside useEffect.
// Also mirrors the choice into a cookie so middleware (which runs on the
// server and can NEVER read localStorage) can honor it when redirecting "/".

import { useEffect } from "react"
import { writeStorage } from "@/lib/useLocalStorage"
import type { Lang } from "@/i18n/dictionaries"

export default function LangMemory({ lang }: { lang: Lang }) {
  useEffect(() => {
    writeStorage("azarsang.lang", JSON.stringify(lang))
    try {
      document.cookie = `azarsang_lang=${lang}; path=/; max-age=31536000; samesite=lax`
    } catch {
      /* cookies may be blocked — the default voice (fa) still stands */
    }
  }, [lang])
  return null
}
