# EHBARZ · اح‌بارز — AZARSANG V13.9.9 · the flagship monument

> سنگِ سیاه، گدازهٔ سردشده است — obsidian is cooled magma.
> یک رگ · دو زبان · صفر دروغ · گرما فقط در لحظهٔ تصمیم

A production-ready Next.js 15 / TypeScript site built as one continuous obsidian mass.
Every number on this surface is **live or absent**. There is no third state.
V13.9.9 fuses the monumental mass of V2, the living graph mind of V3, and the
as-built honesty + confidence gate of V12 — and adds the one thing none of them had:
**heat, rationed by law.**

## What is new in V13.9.9 (vs V12.1.1)

- **The fifth token · `--ember #E8621C`** — heat = commitment, not confidence.
  It may occupy at most **2% of any frame**, fires only at the moment of decision
  (THE COMMIT · 280ms · once), and never becomes flame, spark, or smoke.
- **The ember point** — the wordmark still stops at 98%; the unfinished gap now holds a
  single breathing ember. Between 01:00–06:00 Tehran it smolders at 0.2Hz (THE SMOLDER).
- **engine.decision** — the one ember-framed chamber in the living graph. The final
  approach of its vein is the site's ONLY gradient: pulse resolving into ember
  (`userSpaceOnUse` — bounding-box gradients vanish on axis-aligned lines).
- **/forge · کورهٔ تصمیم (the surprise)** — the confidence gate made personal.
  Write a decision, state your honest confidence. Below 60 nothing can get hot.
  Above 60: commit — the ember flashes once, the decision is carved into a ledger
  (browser-only, `azarsang.ledger`), and the stone cools from ember to bone in 6s.
- **Social doorways** — GitHub / Instagram / Telegram / Email in the witness footer.
  Handles live in ONE file: `src/lib/social.ts` — edit there.
- **Design system updated** — five tokens, the heat law, four motion beats, as-built block.

## Architecture

```
src/middleware.ts         / → /fa or /en · honors the azarsang_lang cookie
src/
  app/
    [lang]/               fa | en · the same mass, two voices (html dir switches)
      layout.tsx          root layout · fixed frame · skip-link · LangMemory
      page.tsx            the monument: Hero → VeinGraph → Chambers → Constitution
      ask/page.tsx        /ask · the live terminal (confidence gate at 60)
      forge/page.tsx      /forge · کورهٔ تصمیم · the surprise organ
      design/page.tsx     the design system, embedded · as-built documentation
    api/
      status/route.ts     as-built telemetry · real endpoints or `absent` — never fake
      ask/route.ts        agent proxy · refuses to answer below the gate
  components/             Hero · VeinGraph · ChamberGrid · Forge · AskTerminal · Gate
                          Witness · SocialLinks · SiteHeader · LangMemory · ResolveReveal
  lib/                    systems registry · confidence + heat laws · social registry
                          status hook · useLocalStorage (the only storage doorway)
  i18n/                   dictionaries · ink-density parity fa/en
preview/index.html        static preview · see the monument without npm (same CSS)
```

## The constitution (excerpt — the full text renders on the home page)

1. The frame never moves; only the flow moves.
2. Every number is live or absent — there is no third state.
3. «نمی‌دانم» is a valid answer, rendered with dignity.
4. Heat means commitment, not confidence — the ember fires only at commit, 280ms, once.
5. The ember's share of any frame is ≤ 2%. No flames, no sparks, no smoke — ever.
6. Five colors are the entire palette; the fifth lives only above the gate of 60.
7. The wordmark stops at 98%; the unfinished part is what glows.
8. Silence is a feature: no trackers, no ads, no noise.

## The SSR & localStorage law

`localStorage` does not exist on the server. This codebase has exactly one sanctioned
doorway to browser storage: **`src/lib/useLocalStorage.ts`**.

- Every file that touches storage is `"use client"`; reads happen inside `useEffect`.
- Writes are guarded by `typeof window` + `try/catch` (private mode stays silent).
- First render always shows the fallback on both server and client — hydration never tears.
- Server code sees only the **cookie** (`azarsang_lang`).

Used by: `AskTerminal` (`azarsang.ask.log`), `Forge` (`azarsang.ledger`),
`LangMemory` (`azarsang.lang` + cookie). Never call `window.localStorage` directly.

## The honesty contract (read before deploying)

- `GET /api/status` probes only systems declared via env vars. Undeclared systems report
  `state: "absent"` and render unlit. The site never invents uptime, latency, or confidence.
- `POST /api/ask` proxies to your real agent. Without `ASK_ENDPOINT`, the terminal answers
  «نمی‌دانم» — rendered, never hidden. Below confidence 60, the gate holds the answer.
- The wordmark channel fills to live mean confidence, capped at 0.98. It is never full.
- `ChromaDB` is quarantined **by design**: no probe, no vein, across the air gap.

## Environment variables

| Variable | Example | Effect |
|---|---|---|
| `STATUS_URL_CORE` | `https://n8n.example/healthz` | lights the `core` chamber |
| `STATUS_URL_DECISION` | … | lights `engine.decision` · runs the molten approach |
| `STATUS_URL_IRANOBAN` | `https://iranoban.ir/health` | lights the `iranoban` chamber |
| `STATUS_URL_JAVDAN` | … | lights the `javdan` chamber |
| `STATUS_URL_ASK` | … | lights the `/ask` chamber |
| `STATUS_URL_DB` | … | lights the `db` chamber |
| `STATUS_URL_TOPICS_MEMORY` | … | lights the `topics_memory` chamber |
| `ASK_ENDPOINT` | `https://agent.example/ask` | connects /ask to the real mind |
| `ASK_TOKEN` | … | optional bearer token for `ASK_ENDPOINT` |

Health endpoints may return anything with HTTP 200; if they return JSON
`{ "confidence": 0–100 }`, that number becomes the chamber's epistemic luminance
(≥90 fact · 60–89 inference · <60 unlit).

## Social links

Edit **`src/lib/social.ts`** — one registry, rendered by `SocialLinks` in the witness
footer. Ships with GitHub / Instagram / Telegram / Email for `ehbarz`.

## Deploy — Cloudflare Workers

Worker name: `ehbarz-azarsang` (`wrangler.jsonc`). No environment variable is required
for the first deploy. Do not commit values. `liara.json` and `netlify.toml` are unchanged.

`/fa/article` is not a page. `next.config.ts` sends it to `/fa` with a 308.
`src/middleware.ts` still only redirects `/` to `/fa` or `/en` from the `azarsang_lang` cookie.
`@opennextjs/cloudflare` 1.20.13 requires Next.js `>=15.5.28 <16` (this repo is on 15.5.28).

```bash
npm install
npx wrangler login
npm run deploy
```

`npm run deploy` runs `opennextjs-cloudflare build` (Next.js via `npx next build`, then
`.open-next/`) and `opennextjs-cloudflare deploy -- --keep-vars`. `--keep-vars` leaves
variables already stored in the Cloudflare dashboard in place. Secrets are never removed
by a deploy. Wrangler prints the `*.workers.dev` URL.

Workers Builds (the GitHub connection) injects `WORKERS_CI=1` and is already set to:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

On that CI, `npm run build` runs `opennextjs-cloudflare build`. `npx wrangler deploy`
then calls `opennextjs-cloudflare deploy`, which reads
`.open-next/.build/open-next.config.edge.mjs`. A plain `next build` does not create
that file, which is why deploy failed with `Could not find compiled Open Next config`.
Leave both dashboard commands as they are. Outside Workers Builds, `npm run build`
stays `next build`.

Check that URL:

- `GET /` → 307 to `/fa`, or to `/en` when the cookie `azarsang_lang=en`
- `GET /fa/article` → 308 to `/fa`
- `GET /api/status` → every system `"state":"absent"` until a `STATUS_URL_*` variable is set
- `POST /api/ask` with a JSON body `{ "question": "…" }` → `"state":"absent"` until `ASK_ENDPOINT` is set

Set optional variables from the table above in the dashboard
(Workers → `ehbarz-azarsang` → Settings → Variables and Secrets), or for a local Worker
preview only in `.dev.vars` (gitignored). For CI, put `CLOUDFLARE_API_TOKEN` in the
shell environment, not in this repo.

Preview the Workers runtime locally (not `next dev`):

```bash
npm run preview
```

That serves `http://127.0.0.1:8787`. OpenNext warns that Windows builds can fail at
runtime. If a later Windows build does, run the same `npm run deploy` from WSL.

## Deploy — Vercel

1. Push this folder to a Git repo → vercel.com → Import. Next.js auto-detected.
2. Add env vars above (all optional — the monument is honest without them).
3. Deploy. `VERCEL_GIT_COMMIT_SHA` becomes the as-built stamp automatically.

## Deploy — Liara (لیارا)

`liara.json` is included (`platform: next`, app: `ehbarz-azarsang`, port 3000).

```bash
npm i -g @liara/cli
liara login
liara deploy
```

- Set env vars in the dashboard (تنظیمات ← متغیرهای محیطی) — same table as above.
- For the commit stamp, set `COMMIT_REF` (e.g. `git rev-parse --short HEAD`).
- Low-memory build machines: add `NODE_OPTIONS=--max-old-space-size=2048`.

## Deploy — Netlify

`netlify.toml` is included (`@netlify/plugin-nextjs`). Import the repo and deploy.

## Local

```bash
npm install
npm run dev    # http://localhost:3000 → redirects to /fa (or your remembered voice)
```

No npm nearby? Open `preview/index.html` — a static, honest preview from the same stylesheet.

## Performance · accessibility · silence

- **Zero runtime dependencies** beyond React/Next. No animation library, no UI kit,
  no fonts fetched at runtime (self-host Monument Extended / Estedad / JetBrains Mono
  when you own the licenses — the fallback stacks are law-compliant).
- Static generation for both locales; only `/api/*` is dynamic.
- Everything respects `prefers-reduced-motion` — the stone stands still, fully legible.
- Semantic landmarks, skip-link, `:focus-visible` in bone, WCAG-strong contrast.
- No analytics, no trackers, no cookie banner — the single `azarsang_lang` cookie is
  first-party, functional, and stores only `fa` or `en`.
