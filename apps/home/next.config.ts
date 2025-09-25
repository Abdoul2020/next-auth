// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {

  async rewrites() {
    return [
      {
        source: 'cart/en/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/cart/:path*',
      },
      {
        source: 'cart/tr/cart/:path*',
        destination: 'https://next-auth-8sjz.vercel.app/cart/:path*',
      },
    ];
  },
  
};

export default withNextIntl(nextConfig);
