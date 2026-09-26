"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  nameEn: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  price: z.number({ invalid_type_error: "Harga harus berupa angka" }).int("Harga harus bilangan bulat").min(0, "Harga tidak boleh negatif"),
  unit: z.string().min(1, "Satuan kemasan wajib diisi"),
  stock: z.number({ invalid_type_error: "Stok harus berupa angka" }).int("Stok harus bilangan bulat").min(0, "Stok tidak boleh negatif"),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

function parseProductForm(formData: FormData) {
  const rawPrice = formData.get("price");
  const rawStock = formData.get("stock");

  const price = rawPrice !== null && rawPrice !== "" ? Number(rawPrice) : NaN;
  const stock = rawStock !== null && rawStock !== "" ? Number(rawStock) : 0;

  return {
    name: String(formData.get("name") || "").trim(),
    nameEn: String(formData.get("nameEn") || "").trim() || null,
    categoryId: String(formData.get("categoryId") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    descriptionEn: String(formData.get("descriptionEn") || "").trim() || null,
    price,
    unit: String(formData.get("unit") || "").trim(),
    stock,
    imageUrl: String(formData.get("imageUrl") || "").trim() || null,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const rawData = parseProductForm(formData);
  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!categoryExists) {
    return { error: "Kategori yang dipilih tidak ditemukan" };
  }

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/produk");
  revalidatePath("/");
  redirect("/admin/produk");
}

import { deleteImageFromSupabase } from "@/lib/supabase";

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const rawData = parseProductForm(formData);
  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!categoryExists) {
    return { error: "Kategori yang dipilih tidak ditemukan" };
  }

  // Cari produk lama untuk komparasi gambar
  const oldProduct = await prisma.product.findUnique({ where: { id } });
  if (!oldProduct) return { error: "Produk tidak ditemukan" };

  await prisma.product.update({ where: { id }, data: parsed.data });

  // SAFE GC: Jika update database sukses dan admin mengganti gambar (URL beda),
  // barulah kita hapus gambar yang lama secara asinkron (tidak memblokir flow).
  if (oldProduct.imageUrl && parsed.data.imageUrl !== oldProduct.imageUrl) {
    await deleteImageFromSupabase(oldProduct.imageUrl).catch(() => {});
  }

  revalidatePath("/admin/produk");
  revalidatePath(`/admin/produk/${id}`);
  revalidatePath("/");
  redirect("/admin/produk");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    
    await prisma.product.delete({ where: { id } });
    
    // SAFE GC: Hanya hapus gambar jika HAPUS KERAS (hard delete) di DB sukses.
    if (product && product.imageUrl) {
      await deleteImageFromSupabase(product.imageUrl).catch(() => {});
    }
  } catch (err: any) {
    // Jika gagal karena Foreign Key constraint (P2003 / P2014) artinya produk pernah dipesan.
    // Lakukan SOFT DELETE (Hanya mematikan isActive) dan JANGAN hapus gambarnya 
    // agar riwayat pesanan (invoice B2B) lama tetap bisa me-render foto aslinya.
    if (err?.code === "P2003" || err?.code === "P2014") {
      await prisma.product.update({
        where: { id },
        data: { isActive: false, stock: 0 },
      });
    } else {
      throw err;
    }
  }
  revalidatePath("/admin/produk");
  revalidatePath("/");
}

