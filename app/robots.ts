import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://etiramushrooms.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/tentang', '/kontak', '/produk/'],
      disallow: [
        '/admin',
        '/admin/*',
        '/login',
        '/register',
        '/keranjang',
        '/pesanan',
        '/pesanan/*',
        '/profil',
        '/api',
        '/api/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
