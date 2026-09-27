"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getServerMessages } from "@/lib/serverMessages";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

type ServerMessages = Awaited<ReturnType<typeof getServerMessages>>;

function buildRegisterSchema(t: ServerMessages) {
  return z.object({
    name: z.string().min(2, t.server.nameRegisterMin),
    email: z.string().email(t.server.emailInvalid),
    password: z.string().min(6, t.server.passwordMin),
    companyName: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^(\+62|62|08)[0-9]{8,13}$/.test(val.replace(/[\s-]/g, "")), {
        message: t.server.phoneInvalid,
      }),
    address: z.string().optional(),
  });
}

export async function registerUser(formData: FormData) {
  const t = await getServerMessages();

  // Satu perangkat maksimal beberapa akun per jam; diperiksa sebelum validasi
  // supaya upaya terus-menerus tidak ikut membebani database.
  if (isRateLimited("register", clientIp(await headers()))) {
    return { error: t.server.tooManyAttempts };
  }

  const parsed = buildRegisterSchema(t).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: t.server.emailTaken };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashed,
        companyName: parsed.data.companyName,
        phone: parsed.data.phone,
        address: parsed.data.address,
        role: "BUYER",
      },
    });
  } catch (err: any) {
    // Dua pendaftaran bersamaan lolos cek findUnique di atas; index unik yang menghentikan yang kedua
    if (err?.code === "P2002") {
      return { error: t.server.emailTaken };
    }
    return { error: t.server.unexpected };
  }

  return { success: true };
}
