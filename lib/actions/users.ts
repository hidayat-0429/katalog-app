"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getServerMessages } from "@/lib/serverMessages";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

type ServerMessages = Awaited<ReturnType<typeof getServerMessages>>;

function buildProfileSchema(t: ServerMessages) {
  return z.object({
    name: z.string().min(2, t.server.nameMin2),
    companyName: z.string().optional(),
    phone: z
      .string()
      .min(1, t.server.phoneRequired)
      .refine(
        (val) => /^(\+62|62|08)[0-9]{8,13}$/.test(val.replace(/[\s-]/g, "")),
        { message: t.server.phoneInvalid }
      ),
    address: z.string().min(10, t.server.addressMin10),
  });
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const t = await getServerMessages();

  const raw = {
    name: (formData.get("name") as string | null)?.trim() || "",
    companyName: (formData.get("companyName") as string | null)?.trim() || undefined,
    phone: (formData.get("phone") as string | null)?.trim() || "",
    address: (formData.get("address") as string | null)?.trim() || "",
  };

  const parsed = buildProfileSchema(t).safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        companyName: parsed.data.companyName || null,
        phone: parsed.data.phone,
        address: parsed.data.address,
      },
    });

    revalidatePath("/profil");
    revalidatePath("/keranjang"); // Untuk update otomatis alamat di form checkout
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: t.server.profileSaveFailed };
  }
}

function buildChangePasswordSchema(t: ServerMessages) {
  return z
    .object({
      currentPassword: z.string().min(1, t.server.fieldsRequired),
      newPassword: z.string().min(6, t.server.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((val) => val.newPassword === val.confirmPassword, {
      message: t.server.passwordConfirmMismatch,
    })
    .refine((val) => val.newPassword !== val.currentPassword, {
      message: t.server.passwordSameAsOld,
    });
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const t = await getServerMessages();

  // Setiap percobaan memaksa server membandingkan hash bcrypt, jadi dibatasi per
  // akun sekaligus per IP.
  if (isRateLimited("changePassword", `${user.id}:${clientIp(await headers())}`)) {
    return { error: t.server.tooManyAttempts };
  }

  const parsed = buildChangePasswordSchema(t).safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });
  if (!record) return { error: t.server.userNotFound };

  const valid = await bcrypt.compare(parsed.data.currentPassword, record.password);
  if (!valid) return { error: t.server.passwordCurrentWrong };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(parsed.data.newPassword, 10) },
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return { error: t.server.passwordChangeFailed };
  }

  return { success: true };
}

export async function resetUserPassword(formData: FormData) {
  await requireAdmin();

  const parsed = z
    .object({
      userId: z.string().min(1),
      newPassword: z.string().min(6, "Sandi baru minimal 6 karakter."),
    })
    .safeParse({
      userId: String(formData.get("userId") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
    });
  if (!parsed.success) {
    return { error: "Pengguna tidak ditentukan." };
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true },
  });
  if (!target) return { error: "Pengguna tidak ditemukan." };

  await prisma.user.update({
    where: { id: target.id },
    data: { password: await bcrypt.hash(parsed.data.newPassword, 10) },
  });

  revalidatePath("/admin/pengguna");
  return { success: true };
}
