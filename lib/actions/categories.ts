"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const nameEn = String(formData.get("nameEn") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!name) return { error: "Nama kategori wajib diisi" };

  await prisma.category.create({
    data: { name, nameEn: nameEn || null, description: description || null },
  });
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const nameEn = String(formData.get("nameEn") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!name) return { error: "Nama kategori wajib diisi" };

  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) return { error: "Kategori tidak ditemukan" };

  await prisma.category.update({
    where: { id },
    data: { name, nameEn: nameEn || null, description: description || null },
  });
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return { error: "Kategori masih memiliki produk" };
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  return { success: true };
}
