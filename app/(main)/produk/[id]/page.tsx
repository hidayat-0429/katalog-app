import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getServerLocale, getServerMessages } from '@/lib/serverMessages';
import { localizeProduct, formatText } from '@/lib/productText';
import ProductDetailPageClient from './ProductDetailPageClient';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [t, locale] = await Promise.all([getServerMessages(), getServerLocale()]);
  const product = await prisma.product.findUnique({
    where: { id },
  });

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
          url: product.imageUrl || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: name,
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
