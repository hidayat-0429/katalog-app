import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Dibangkitkan tiap permintaan: produk baru dari dasbor admin langsung masuk
// peta situs, dan proses build tidak lagi butuh akses ke database.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://etiramushrooms.com'

  // Ambil produk yang aktif, gunakan fallback jika koneksi database sedang timeout/offline
  let activeProducts: { id: string; updatedAt: Date }[] = []
  try {
    activeProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    })
  } catch (err) {
    console.warn('Sitemap: Tidak dapat menjangkau basis data, melewati produk dinamis:', err)
  }

  const productUrls = activeProducts.map((product) => ({
    url: `${baseUrl}/produk/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...productUrls,
  ]
}
