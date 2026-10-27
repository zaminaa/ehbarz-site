import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // silence as a feature: no telemetry chatter in headers, immutable static assets
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/fa/article", destination: "/fa", permanent: true }]
  },
}

export default nextConfig
