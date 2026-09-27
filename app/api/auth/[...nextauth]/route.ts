import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

const authHandler = NextAuth(authOptions) as (
  req: Request,
  ctx: unknown
) => Promise<Response>;

// authorize() tidak bisa membaca header, jadi percobaan login per perangkat
// dibatasi di depan handler NextAuth.
async function route(req: Request, ctx: unknown) {
  const url = new URL(req.url);
  const isLoginAttempt =
    req.method === "POST" && url.pathname.endsWith("/callback/credentials");

  if (isLoginAttempt && isRateLimited("loginIp", clientIp(req.headers))) {
    // next-auth/react membaca field `url` dari body JSON (bukan mengikuti
    // redirect), jadi jawabinnya JSON dengan kode error yang sama.
    return NextResponse.json(
      {
        error: "RateLimited",
        message: "Terlalu banyak percobaan login.",
        url: `${url.origin}/login?error=RateLimited`,
      },
      { status: 429 }
    );
  }

  return authHandler(req, ctx);
}

export { route as GET, route as POST };
