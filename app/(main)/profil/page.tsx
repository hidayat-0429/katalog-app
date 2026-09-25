import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProfilPageClient from "./ProfilPageClient";

export const metadata = {
  title: "Profil & Alamat | Etira Mushrooms",
  description: "Kelola data profil perusahaan dan alamat pengiriman Anda.",
};

export default async function ProfilPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Data pengguna tidak ditemukan.
      </div>
    );
  }

  return <ProfilPageClient user={user} />;
}
