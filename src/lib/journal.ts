// journal.ts — the lab journal: the last commits of the two public repos.
// One reader, used by the Worker route; the page's fallback seed lives here too.
// Public GitHub API only: no token, no private data.

export type Commit = { repo: string; sha: string; at: string; subject: string }
export type Journal = { commits: Commit[]; fetchedAt: string; source: "live" | "cache" | "seed" }

export const REPOS = ["StackWeight", "ChaosUsers"] as const
export const CACHE_TTL_MS = 15 * 60 * 1000 // the Worker's freshness window
export const STALE_TTL_S = 7 * 24 * 3600 // last good state is kept a week

export const repoUrl = (repo: string) => `https://github.com/zaminaa/${repo}`

// four real commits captured 2026-11-06 — shown only until the first live read lands
export const SEED = {
  source: "seed",
  fetchedAt: "2026-11-06T07:45:00.000Z",
  commits: [
    { repo: "ChaosUsers", sha: "48bfc2a", at: "2026-11-06T07:02:10Z", subject: "Expand the spec docs and mark unverified model prices." },
    { repo: "ChaosUsers", sha: "d117282", at: "2026-11-06T07:02:10Z", subject: "Reject template calibration files and ground judge quotes in the real turn." },
    { repo: "ChaosUsers", sha: "e768786", at: "2026-11-06T07:02:09Z", subject: "Replace the template calibration set with twelve distinct transcripts." },
    { repo: "StackWeight", sha: "f251a2c", at: "2026-11-05T12:02:23Z", subject: "Quote the test exclude so POSIX CI runs the real suite." },
    { repo: "StackWeight", sha: "1202a40", at: "2026-11-05T08:22:42Z", subject: "Add the demo receipt card and the prune test" },
    { repo: "StackWeight", sha: "1a251b6", at: "2026-11-05T08:04:18Z", subject: "stabilize golden snapshots against temp paths" },
  ],
} as const satisfies Journal

type GhCommit = { sha: string; commit: { author: { date: string } | null; message: string } }

async function readRepo(repo: string): Promise<Commit[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/zaminaa/${repo}/commits?per_page=4`, {
      headers: { accept: "application/vnd.github+json", "user-agent": "ehbarz-lab" },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return []
    return ((await res.json()) as GhCommit[]).map((row) => ({
      repo,
      sha: row.sha.slice(0, 7),
      at: row.commit.author?.date ?? "",
      subject: row.commit.message.split("\n")[0] ?? "",
    }))
  } catch {
    return []
  }
}

/** null when GitHub answered nothing usable, so the caller can keep its cached copy */
export async function readGitHub(): Promise<Commit[] | null> {
  const lists = await Promise.all(REPOS.map(readRepo))
  const commits = lists.flat().sort((a, b) => b.at.localeCompare(a.at))
  return commits.length > 0 ? commits : null
}


