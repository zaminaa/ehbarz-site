import { execSync } from "node:child_process"

// Workers Builds runs `npm run build`, then `npx wrangler deploy`.
// wrangler deploy only uploads an OpenNext app after `opennextjs-cloudflare build`.
const cmd = process.env.WORKERS_CI === "1" ? "opennextjs-cloudflare build" : "next build"

execSync(cmd, { stdio: "inherit" })
