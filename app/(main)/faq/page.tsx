import { Metadata } from 'next';
import { getServerMessages } from '@/lib/serverMessages';
import FAQPageClient from './FAQPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerMessages();
  return {
    title: t.metadata.faq,
    description: t.faq.description,
  };
}

export default function FAQPage() {
  return <FAQPageClient />;
}
