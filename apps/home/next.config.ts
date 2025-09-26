// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // If you have a basePath, take that into account; omitted here.
  async rewrites() {
    return [
      // Exact root path for English cart page
      {
        source: "/en/cart",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart",
      },
      // Any subpaths under /en/cart/*
      {
        source: "/en/cart/:path*",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart/:path*",
      },

      // Turkish locale (maps to the same cart page on the cart app)
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
