import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getServerLocale, getServerMessages } from '@/lib/serverMessages';
import { localizeProduct, formatText } from '@/lib/productText';
import ProductDetailPageClient from './ProductDetailPageClient';
import { omitKey } from '@/lib/publicData';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Metadata dan body halaman ini sama-sama butuh produk yang sama; cache() membuat
// satu permintaan per pengunjung, bukan dua perjalanan ke database.
const findProduct = cache((id: string) =>
  prisma.product.findUnique({ where: { id }, include: { category: true } })
);

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [t, locale] = await Promise.all([getServerMessages(), getServerLocale()]);
  const product = await findProduct(id);

  if (!product || !product.isActive) {
    return {
      title: t.metadata.productNotFound,
    };
  }

  const { name, description: productDescription } = localizeProduct(product, locale);
  const title = `${name} | Etira Mushrooms`;
  const description = productDescription
    ? productDescription.substring(0, 160)
    : formatText(t.productDetail.metaDescription, { name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.imageUrl || "/og-image.png",
          width: 1200,
          height: 675,
          alt: name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const user = await getCurrentUser();
  const { id } = await params;

  const product = await findProduct(id);

  if (!product || !product.isActive) {
    notFound();
  }

  return <ProductDetailPageClient product={omitKey(product, "price")} user={user} />;
}
