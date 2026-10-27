import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// `npx next build`, not `npm run build`. Workers Builds sets WORKERS_CI=1 and
// `npm run build` then calls `opennextjs-cloudflare build`. Calling `npm run build`
// from inside that would loop.
export default {
  ...defineCloudflareConfig(),
  buildCommand: "npx next build",
}
