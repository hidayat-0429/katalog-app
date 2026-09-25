import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter untuk login endpoint
// Menyimpan: { ip -> { count, resetAt } }
//
// ⚠️  PERINGATAN PRODUCTION:
// Rate limiter ini berbasis memori proses (in-memory Map). Di lingkungan
// serverless (Vercel, AWS Lambda, dsb.), setiap request bisa ditangani oleh
// instance yang berbeda sehingga Map ini TIDAK dishare antar instance.
// Artinya rate limiting ini TIDAK EFEKTIF di production serverless deployment.
//
// Untuk production yang serius, ganti dengan solusi berbasis Redis/Upstash:
// - @upstash/ratelimit (https://github.com/upstash/ratelimit)
// - ioredis + sliding window counter
//
// Rate limiter ini tetap bermanfaat untuk single-instance deployment
// (VPS/dedicated server) atau sebagai lapisan pertama sebelum WAF.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 10; // max 10 percobaan per menit per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    // Reset window
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  if (record.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Rate limit untuk endpoint login NextAuth
    if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      if (isRateLimited(ip)) {
        return NextResponse.json(
          { error: "Terlalu banyak percobaan login. Coba lagi dalam 1 menit." },
          { status: 429 }
        );
      }
    }

    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Endpoint login tidak butuh autentikasi
        if (req.nextUrl.pathname.startsWith("/api/auth")) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/keranjang/:path*",
    "/pesanan/:path*",
    "/profil/:path*",
    "/admin/:path*",
    "/api/auth/callback/credentials",
  ],
};
