import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      // Supabase storage URL format alternatif
      { protocol: "https", hostname: "*.supabase.in" },
      // Placeholder images
      { protocol: "https", hostname: "via.placeholder.com" },
      // Untuk development lokal
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale/katalog",
        destination: "/:locale?katalog=semua",
        permanent: true,
      },
      {
        source: "/:locale/admin/dashboard",
        destination: "/:locale/admin",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
