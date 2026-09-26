import { NextRequest, NextResponse } from 'next/server';
import { getServerMessages } from '@/lib/serverMessages';
import { prisma } from '@/lib/prisma';

const MAX_LENGTHS = {
  name: 100,
  email: 120,
  company: 120,
  phone: 40,
  subject: 150,
  message: 5000,
} as const;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Per-instance saja (tidak ada store bersama), tapi cukup untuk meredam bot paling nakal.
const globalStore = globalThis as unknown as { contactHits?: Map<string, number[]> };
const buckets = globalStore.contactHits ?? (globalStore.contactHits = new Map<string, number[]>());

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local').slice(0, 45);
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((ts) => now - ts < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    buckets.set(key, recent);
    return true;
  }

  recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 5000) {
    for (const [bucketKey, timestamps] of buckets) {
      if (!timestamps.some((ts) => now - ts < WINDOW_MS)) buckets.delete(bucketKey);
    }
  }

  return false;
}

function clean(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

// Contact form endpoint: stores submissions for the admin "Pesan Masuk" page
export async function POST(request: NextRequest) {
  const t = await getServerMessages();
  try {
    const body = await request.json();

    // Bot biasanya mengisi semua input termasuk umpan berikut; manusia tidak pernah melihatnya.
    if (typeof body?.website === 'string' && body.website.trim()) {
      return NextResponse.json({ success: true });
    }

    if (isRateLimited(clientKey(request))) {
      return NextResponse.json({ error: t.server.tooManyRequests }, { status: 429 });
    }

    const name = clean(body?.name, MAX_LENGTHS.name);
    const email = clean(body?.email, MAX_LENGTHS.email);
    const company = clean(body?.company, MAX_LENGTHS.company);
    const phone = clean(body?.phone, MAX_LENGTHS.phone);
    const subject = clean(body?.subject, MAX_LENGTHS.subject);
    const message = clean(body?.message, MAX_LENGTHS.message);

    if (!name || !email || !company || !phone || !subject || !message) {
      return NextResponse.json(
        { error: t.server.fieldsRequired },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: t.server.emailInvalid },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: { name, email, company, phone, subject, message },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: t.server.messageFailed },
      { status: 500 }
    );
  }
}
