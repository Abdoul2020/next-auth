// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/en/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/cart/en/cart/:path*',
      },
      {
        source: '/en/cart',
        destination: 'https://next-auth-8sjz.vercel.app/cart/en/cart',
      }
    ];
  },
  
};

export default withNextIntl(nextConfig);
