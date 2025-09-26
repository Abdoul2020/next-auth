// next.config.js (or next.config.mjs / ts variant depending on your project setup)
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // any other Next.js config you need
  reactStrictMode: true,

  async rewrites() {
    return [
      // Proxy /en/cart and its children to the cart deployment's full path
      {
        source: "/en/cart/:path*",
        destination:
          "https://next-auth-8sjz.vercel.app/cart/en/cart/:path*",
      },
      // Exact /en/cart (no trailing slash) -> the cart page root
      {
        source: "/en/cart",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart",
      },

      // Turkish locale
      {
        source: "/tr/cart/:path*",
        destination:
          "https://next-auth-8sjz.vercel.app/cart/en/cart/:path*",
      },
      {
        source: "/tr/cart",
        destination: "https://next-auth-8sjz.vercel.app/cart/en/cart",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
