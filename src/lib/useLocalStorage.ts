"use client"

// useLocalStorage — the ONLY sanctioned doorway to localStorage in this codebase.
//
// The SSR law:
// - localStorage does not exist on the server. Any direct call during render
//   (server OR first client render) is a crime against hydration.
// - Reads happen exclusively inside useEffect, after mount.
// - Writes are guarded by `typeof window` and try/catch (private mode, quotas).
// - The first render always shows `fallback` on both server and client,
//   so markup matches and hydration never tears.
//
// If you need persistence anywhere in this project, import from this file.
// Do not call window.localStorage directly — that is how the vein gets cut.

import { useCallback, useEffect, useState } from "react"

/** Safe raw read. Returns null on the server, in private mode, or on any failure. */
export function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Safe raw write. No-op on the server. `null` removes the key. */
export function writeStorage(key: string, value: string | null): void {
  if (typeof window === "undefined") return
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    /* storage may be unavailable (private mode, quota) — silence, as always, is acceptable */
  }
}

/**
 * React hook: state that persists to localStorage, SSR-safe by construction.
 *
 * - Server render & first client render: `fallback` (hydration-consistent).
 * - After mount (useEffect): the stored value, if any, takes over.
 * - `hydrated` tells you when the stored value has been loaded.
 */
export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const raw = readStorage(key)
    if (raw !== null) {
      try {
        setValue(JSON.parse(raw) as T)
      } catch {
        writeStorage(key, null) // corrupted entry — remove it, keep the fallback
      }
    }
    setHydrated(true)
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next
        writeStorage(key, JSON.stringify(resolved))
        return resolved
      })
    },
    [key],
  )

  const clear = useCallback(() => {
    writeStorage(key, null)
    setValue(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, set, hydrated, clear] as const
}
