// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/en/cart",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart",
      },
      {
        source: "/en/cart/:path*",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart/:path*",
      },

      {
        source: "/tr/cart",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart",
      },
      {
        source: "/tr/cart/:path*",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
