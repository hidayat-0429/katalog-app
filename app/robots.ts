import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
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
    sitemap: 'https://etiramushrooms.com/sitemap.xml',
  }
}
