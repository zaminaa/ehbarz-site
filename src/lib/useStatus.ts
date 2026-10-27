"use client"

// useStatus — one fetch, shared by every organ (Hero, VeinGraph, ChamberGrid, Witness).
// The mind asks about itself once, not four times.

import { useEffect, useState } from "react"
import type { StatusPayload } from "@/lib/confidence"

let shared: Promise<StatusPayload | null> | null = null

function fetchStatus(): Promise<StatusPayload | null> {
  if (!shared) {
    shared = fetch("/api/status", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<StatusPayload>) : null))
      .catch(() => null)
    // let a later mount re-ask after a while — the night current still moves
    setTimeout(() => {
      shared = null
    }, 30_000)
  }
  return shared
}

export function useStatus(): StatusPayload | null | undefined {
  // undefined = still resolving · null = asked, nothing answered · payload = live
  const [status, setStatus] = useState<StatusPayload | null | undefined>(undefined)
  useEffect(() => {
    let alive = true
    fetchStatus().then((s) => {
      if (alive) setStatus(s)
    })
    return () => {
      alive = false
    }
  }, [])
  return status
}
