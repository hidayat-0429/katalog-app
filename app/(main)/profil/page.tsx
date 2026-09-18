import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProfilForm from "./ProfilForm";
import { Card } from "@/components/ui";

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
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        Data pengguna tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 pb-4 border-b border-border">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-charcoal">
          Profil & Alamat
        </h1>
        <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-1">
          Perbarui informasi kontak dan alamat pengiriman perusahaan Anda.
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <ProfilForm user={user} />
      </Card>
    </div>
  );
}
