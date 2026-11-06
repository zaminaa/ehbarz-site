// /api/journal — the lab journal's only moving part (the light Worker).
// GitHub is read at most once per 15 minutes: the cache is consulted before the API,
// so repeat visitors never hit an unauthenticated rate limit. If GitHub fails, the last
// good payload is served and marked source:"cache" — a stale journal, never a broken page.

import { NextResponse } from "next/server"
import { CACHE_TTL_MS, STALE_TTL_S, readGitHub, type Commit } from "@/lib/journal"

export const dynamic = "force-dynamic"

type Payload = { commits: Commit[]; fetchedAt: string; source: "live" | "cache" }

const KEY = "https://ehbarz.ir/api/journal"
// per-isolate memo: works even where caches.default is missing
let memo: Payload | null = null

const defaultCache = (): Cache | null => {
  try {
    return (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null
  } catch {
    return null
  }
}

/** the last payload we ever had, with its true age; null when there is none */
async function readCache(store: Cache | null): Promise<{ payload: Payload; ageMs: number } | null> {
  const payload =
    memo ??
    (await store
      ?.match(KEY)
      .then((hit) => (hit ? (hit.json() as Promise<Payload>) : null))
      .catch(() => null)) ??
    null
  if (!payload) return null
  memo = payload
  const age = Date.now() - Date.parse(payload.fetchedAt)
  return { payload, ageMs: Number.isFinite(age) ? age : Infinity }
}

async function writeCache(store: Cache | null, payload: Payload): Promise<void> {
  memo = payload
  try {
    await store?.put(
      KEY,
      new Response(JSON.stringify(payload), {
        headers: { "content-type": "application/json", "cache-control": `max-age=${STALE_TTL_S}` },
      }),
    )
  } catch {
    /* the cache is a convenience, never a dependency */
  }
}

const headers = (tag: string) => ({
  "cache-control": `public, max-age=0, s-maxage=${CACHE_TTL_MS / 1000}, stale-while-revalidate=${STALE_TTL_S}`,
  "x-journal": tag,
})

export async function GET() {
  const store = defaultCache()
  const hit = await readCache(store)

  // fresh enough: serve it, never call GitHub
  if (hit && hit.ageMs < CACHE_TTL_MS) {
    return NextResponse.json(hit.payload, { headers: headers("fresh") })
  }

  const commits = await readGitHub()
  if (commits) {
    const fresh: Payload = { commits, fetchedAt: new Date().toISOString(), source: "live" }
    await writeCache(store, fresh)
    return NextResponse.json(fresh, { headers: headers("live") })
  }

  // GitHub is down: the last good state is the honest answer
  if (hit) return NextResponse.json({ ...hit.payload, source: "cache" }, { headers: headers("stale") })

  // nothing has ever been cached and GitHub is unreachable: say so plainly
  return NextResponse.json({ commits: [], fetchedAt: null, source: "absent" }, { status: 503, headers: headers("absent") })
}
