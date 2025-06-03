import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [new URL("https://http.cat/**")]
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone'
};

export default nextConfig;
