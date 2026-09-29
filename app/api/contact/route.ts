import { NextRequest, NextResponse } from 'next/server';
import { getServerMessages } from '@/lib/serverMessages';
import { prisma } from '@/lib/prisma';
import { clientIp, isRateLimited } from '@/lib/rateLimit';
import { logError } from '@/lib/utils/logger';
import { apiSuccess, ApiErrors } from '@/lib/utils/apiResponse';

const MAX_LENGTHS = {
  name: 100,
  email: 120,
  company: 120,
  phone: 40,
  subject: 150,
  message: 5000,
} as const;

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
      return apiSuccess({});
    }

    if (isRateLimited('contact', clientIp(request.headers))) {
      return ApiErrors.rateLimited(t.server.tooManyRequests);
    }

    const name = clean(body?.name, MAX_LENGTHS.name);
    const email = clean(body?.email, MAX_LENGTHS.email);
    const company = clean(body?.company, MAX_LENGTHS.company);
    const phone = clean(body?.phone, MAX_LENGTHS.phone);
    const subject = clean(body?.subject, MAX_LENGTHS.subject);
    const message = clean(body?.message, MAX_LENGTHS.message);

    if (!name || !email || !company || !phone || !subject || !message) {
      return ApiErrors.badRequest(t.server.fieldsRequired);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiErrors.badRequest(t.server.emailInvalid);
    }

    await prisma.contactMessage.create({
      data: { name, email, company, phone, subject, message },
    });

    return apiSuccess({});
  } catch (error) {
    logError('Contact API Error:', error);
    return ApiErrors.internal(t.server.messageFailed);
  }
}
