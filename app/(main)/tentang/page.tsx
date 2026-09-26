import type { Metadata } from 'next';
import { getServerMessages } from '@/lib/serverMessages';
import TentangPageClient from './TentangPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerMessages();
  return { title: t.metadata.about, description: t.about.description };
}

export default function TentangPage() {
  return <TentangPageClient />;
}
