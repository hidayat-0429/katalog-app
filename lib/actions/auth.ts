"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getServerMessages } from "@/lib/serverMessages";

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

  return { success: true };
}
