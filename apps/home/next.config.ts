import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
    allowedOrigins: ["https://next-auth-h9c5.vercel.app/"],

  async rewrites() {
    return [
      {
        source: '/en/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/cart/:path*'
      },
      {
        source: '/tr/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/cart/:path*'
      }
    ];
  }
};

export default withNextIntl(nextConfig);
