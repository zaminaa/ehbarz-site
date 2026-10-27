import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // silence as a feature: no telemetry chatter in headers, immutable static assets
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
