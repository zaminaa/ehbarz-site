import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // silence as a feature: no telemetry chatter in headers, immutable static assets
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/fa/article", destination: "/fa", permanent: true },
      { source: "/forge", destination: "/fa", permanent: true },
      { source: "/design", destination: "/fa", permanent: true },
      { source: "/:lang(fa|en)/forge", destination: "/fa", permanent: true },
      { source: "/:lang(fa|en)/design", destination: "/fa", permanent: true },
    ]
  },
}

export default nextConfig
