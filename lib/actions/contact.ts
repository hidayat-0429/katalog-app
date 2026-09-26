"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function setContactMessageRead(id: string, isRead: boolean) {
  await requireAdmin();

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) return { error: "Pesan tidak ditemukan" };

  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/pesan");
  return { success: true };
}

export async function deleteContactMessage(id: string) {
  await requireAdmin();

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) return { error: "Pesan tidak ditemukan" };

  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/pesan");
  return { success: true };
}
