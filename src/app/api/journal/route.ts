// /api/journal — the lab journal's only moving part (the light Worker).
// Reads the public GitHub API, holds the answer for 15 minutes, and on failure returns the
// last good payload marked source:"cache" instead of an error. The page is never broken by it.

import { NextResponse } from "next/server"
import { CACHE_TTL_MS, STALE_TTL_S, readGitHub, type Commit } from "@/lib/journal"

export const dynamic = "force-dynamic"

type Payload = { commits: Commit[]; fetchedAt: string; source: "live" | "cache" }

const KEY = "https://ehbarz.ir/api/journal"
// per-isolate memo: the second line of defence where caches.default is unavailable
let memo: Payload | null = null

function defaultCache(): Cache | null {
  try {
    return (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null
  } catch {
    return null
  }
}

async function lastGood(store: Cache | null): Promise<Payload | null> {
  if (memo) return memo
  try {
    const hit = await store?.match(KEY)
    return hit ? ((await hit.json()) as Payload) : null
  } catch {
    return null
  }
}

export async function GET() {
  const store = defaultCache()
  const commits = await readGitHub()

  if (commits) {
    const fresh: Payload = { commits, fetchedAt: new Date().toISOString(), source: "live" }
    memo = fresh
    try {
      await store?.put(KEY, new Response(JSON.stringify(fresh), { headers: { "content-type": "application/json" } }))
    } catch {
      /* a cache write is a convenience, never a dependency */
    }
    return NextResponse.json(fresh, {
      headers: {
        "cache-control": `public, max-age=0, s-maxage=${CACHE_TTL_MS / 1000}, stale-while-revalidate=${STALE_TTL_S}`,
      },
    })
  }

  const last = await lastGood(store)
  if (last) return NextResponse.json({ ...last, source: "cache" })
  return NextResponse.json({ commits: [], fetchedAt: null, source: "absent" }, { status: 503 })
}
