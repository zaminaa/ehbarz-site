// confidence.ts — the epistemic laws. Three states of light, one state of heat.

export type SystemState = "up" | "down" | "absent"

export type SystemStatus = {
  id: string
  state: SystemState
  /** 0–100, only if the real endpoint reported one — never synthesized */
  confidence: number | null
  latencyMs: number | null
  quarantined?: boolean
}

export type StatusPayload = {
  systems: SystemStatus[]
  /** mean of reported confidences · null when nothing reports — absent, not zero */
  meanConfidence: number | null
  serverUptimeSec: number
  serverTime: string
  commit: string | null
}

/** fact ≥ 90 → 1.0 · inference 60–89 → 0.4 · unknown → 0 («نمی‌دانم» — carved, unlit, rendered) */
export function luminance(confidence: number | null, state: SystemState): number {
  if (state !== "up") return 0
  if (confidence === null) return 0.4 // alive but unquantified → inference light, honestly dim
  if (confidence >= 90) return 1
  if (confidence >= 60) return 0.4
  return 0
}

/** the wordmark law: fill = live confidence, capped at 98% — the mark is never finished */
export function wordmarkFill(meanConfidence: number | null): number {
  if (meanConfidence === null) return 0.9 // holds at the hesitation point when data is absent
  return Math.min(meanConfidence / 100, 0.98)
}

export const GATE = 60 // below this, «نمی‌دانم» is the only honest answer

// the heat law: heat = commitment, not confidence.
// THE COMMIT fires once (≤280ms). THE SMOLDER breathes only in Tehran's deep night.
export const COMMIT_MS = 280
export const SMOLDER_FROM = 1 // 01:00 Asia/Tehran
export const SMOLDER_TO = 6 // 06:00 Asia/Tehran

/** true only between 01:00–06:00 Asia/Tehran — the hours when the stone smolders */
export function isTehranNight(now: Date = new Date()): boolean {
  try {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tehran", hour: "numeric", hour12: false }).format(now),
    )
    return hour >= SMOLDER_FROM && hour < SMOLDER_TO
  } catch {
    return false // if the clock cannot witness, the stone stays steady
  }
}

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d])
}
