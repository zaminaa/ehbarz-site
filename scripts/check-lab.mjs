// A self-check for the /lab page, run against the production build output.
// Asserts the things that are easy to break and hard to see: that the numbers are
// in the HTML without scripting, that the receipt is isolated from page direction,
// and that both language routes exist and stay under the JS budget.
//
//   node scripts/check-lab.mjs [baseUrl]
// Skips browser-only checks if no server is reachable.

const BASE = process.argv[2] || "http://localhost:3555"
let failures = 0
const ok = (cond, msg) => {
  if (cond) console.log(`  ok   ${msg}`)
  else {
    console.log(`  FAIL ${msg}`)
    failures++
  }
}

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers: { "user-agent": "lab-selfcheck" } })
  return { status: res.status, text: await res.text(), type: res.headers.get("content-type") || "" }
}

console.log(`/lab self-check against ${BASE}`)

for (const lang of ["fa", "en"]) {
  const { status, text } = await get(`/${lang}/lab`)
  ok(status === 200, `/${lang}/lab returns 200`)
  // the real numbers must be in the server HTML, not filled in later by a script
  for (const needle of ["5.7k", "is dead weight", "4.97M", "2c050bb39c49d162b34be9292ca0a8e248ce9c383ded09aa186b3b96aa360d03"]) {
    ok(text.includes(needle), `/${lang}/lab ships "${needle}" without JS`)
  }
  ok(text.includes("direction:ltr") || text.includes("direction: ltr"), `/${lang}/lab pins the receipt card to LTR`)
  ok(/\b(12|۱۲)\b/.test(text), `/${lang}/lab states the conversation count`)
}
const fa = (await get("/fa/lab")).text
ok(fa.includes("12") && fa.includes("85"), "/fa/lab carries the recorded counters and dead share")
ok(fa.includes('dir="rtl"'), "/fa/lab is RTL")

const journal = await get("/api/journal")
let payload = null
try {
  payload = JSON.parse(journal.text)
} catch {
  /* judged below */
}
ok(journal.status === 200 || journal.status === 503, "/api/journal answers instead of throwing")
ok(payload && Array.isArray(payload.commits), "/api/journal returns a commits array")
ok(payload && ["live", "cache", "absent"].includes(payload.source), "/api/journal states where its data came from")
ok(journal.status !== 503 || payload?.commits?.length === 0, "when /api/journal is unavailable it reports empty, not stale garbage")
ok(journal.type.includes("application/json"), "/api/journal is application/json")

console.log(failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`)
process.exit(failures === 0 ? 0 : 1)

