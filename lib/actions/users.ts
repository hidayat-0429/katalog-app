"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  const name = formData.get("name") as string;
  const companyName = formData.get("companyName") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name || name.trim().length < 2) {
    return { error: "Nama penanggung jawab wajib diisi minimal 2 karakter." };
  }

  if (!phone || phone.trim().length < 8) {
    return { error: "Nomor telepon/WhatsApp wajib diisi dengan benar." };
  }

  if (!address || address.trim().length < 10) {
    return { error: "Alamat pengiriman wajib diisi dengan lengkap." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        companyName: companyName || null,
        phone,
        address,
      },
    });

    revalidatePath("/profil");
    revalidatePath("/keranjang"); // Untuk update otomatis alamat di form checkout
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: "Terjadi kesalahan saat menyimpan pembaruan profil." };
  }
}
