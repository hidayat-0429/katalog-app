import { Metadata } from 'next';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan Umum',
  description: 'Pertanyaan yang sering diajukan tentang produk dan layanan Etira Mushrooms',
};

export default function FAQPage() {
  return <FAQPageClient />;
}
