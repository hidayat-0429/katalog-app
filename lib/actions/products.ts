"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().optional().nullable(),
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
    categoryId: String(formData.get("categoryId") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
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

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/produk");
  revalidatePath(`/admin/produk/${id}`);
  revalidatePath("/");
  redirect("/admin/produk");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
  } catch (err: any) {
    // Jika produk sudah memiliki riwayat relasi (mis. pernah dipesan dalam orderItems),
    // nonaktifkan produk agar integritas riwayat pesanan pelanggan tetap terjaga
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

