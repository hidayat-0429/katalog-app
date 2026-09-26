"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerMessages } from "@/lib/serverMessages";

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
