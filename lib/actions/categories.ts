"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { getFormDataString, getFormDataOptional } from "@/lib/utils/formData";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = getFormDataString(formData, "name");
  const nameEn = getFormDataOptional(formData, "nameEn");
  const description = getFormDataOptional(formData, "description");
  if (!name) return { error: "Nama kategori wajib diisi" };

  await prisma.category.create({
    data: { name, nameEn: nameEn || null, description: description || null },
  });
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  revalidateTag("beranda");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const name = getFormDataString(formData, "name");
  const nameEn = getFormDataOptional(formData, "nameEn");
  const description = getFormDataOptional(formData, "description");
  if (!name) return { error: "Nama kategori wajib diisi" };

  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) return { error: "Kategori tidak ditemukan" };

  await prisma.category.update({
    where: { id },
    data: { name, nameEn: nameEn || null, description: description || null },
  });
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  revalidateTag("beranda");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return { error: "Kategori masih memiliki produk" };
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  revalidateTag("beranda");
  return { success: true };
}
