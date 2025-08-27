import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

module.exports = {
  images: {
    remotePatterns: [{
    protocol: 'https',
    hostname: 'share.google',
  },],
  },
}

export default nextConfig;


