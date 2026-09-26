import type { Metadata } from 'next';
import { getServerMessages } from '@/lib/serverMessages';
import ContactPageClient from './ContactPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerMessages();
  return {
    title: t.metadata.contact,
    description: t.contact.description,
  };
}

export default function KontakPage() {
  return <ContactPageClient />;
}
