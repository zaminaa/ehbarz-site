// /api/status — as-built telemetry.
// Probes only the systems declared via STATUS_URL_<ID> env vars.
// Everything else reports `absent` and renders unlit. No number here is ever invented.

import { NextResponse } from "next/server"
import { SYSTEMS } from "@/lib/systems"
import type { StatusPayload, SystemStatus } from "@/lib/confidence"

export const dynamic = "force-dynamic"

const PROBE_TIMEOUT_MS = 2500
const started = Date.now()

async function probe(id: string, url: string): Promise<SystemStatus> {
  const t0 = Date.now()
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    })
    const latencyMs = Date.now() - t0
    let confidence: number | null = null
    const ct = res.headers.get("content-type") ?? ""
    if (res.ok && ct.includes("application/json")) {
      try {
        const body = (await res.json()) as { confidence?: unknown }
        if (typeof body.confidence === "number" && body.confidence >= 0 && body.confidence <= 100) {
          confidence = body.confidence // reported by the real system — the only source
        }
      } catch {
        /* body was not JSON after all — fine, state alone is truth enough */
      }
    }
    return { id, state: res.ok ? "up" : "down", confidence, latencyMs }
  } catch {
    return { id, state: "down", confidence: null, latencyMs: Date.now() - t0 }
  }
}

export async function GET() {
  const systems = await Promise.all(
    SYSTEMS.map(async (sys): Promise<SystemStatus> => {
      if (sys.quarantined) {
        // quarantined by design: no probe, no vein, no number. the air gap is the feature.
        return { id: sys.id, state: "absent", confidence: null, latencyMs: null, quarantined: true }
      }
      const url = sys.envKey ? process.env[`STATUS_URL_${sys.envKey}`] : undefined
      if (!url) return { id: sys.id, state: "absent", confidence: null, latencyMs: null }
      return probe(sys.id, url)
    }),
  )

  const reported = systems.filter((s) => s.confidence !== null) as Array<SystemStatus & { confidence: number }>
  const meanConfidence = reported.length
    ? Math.round(reported.reduce((a, s) => a + s.confidence, 0) / reported.length)
    : null

  const payload: StatusPayload = {
    systems,
    meanConfidence,
    serverUptimeSec: Math.floor((Date.now() - started) / 1000),
    serverTime: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.COMMIT_REF ?? null,
  }
  return NextResponse.json(payload, { headers: { "cache-control": "no-store" } })
}
