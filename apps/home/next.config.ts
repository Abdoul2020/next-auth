// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/en/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/en/cart/:path*',
      },
      {
        source: '/tr/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/en/cart/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
