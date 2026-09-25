import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import ProductDetailPageClient from './ProductDetailPageClient';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || !product.isActive) {
    return {
      title: "Produk Tidak Ditemukan | Etira Mushrooms",
    };
  }

  const title = `${product.name} | Etira Mushrooms`;
  const description = product.description 
    ? product.description.substring(0, 160) 
    : `Beli ${product.name} dengan harga pasokan terbaik di Etira Mushrooms.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.imageUrl || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const user = await getCurrentUser();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return <ProductDetailPageClient product={product} user={user} />;
}
