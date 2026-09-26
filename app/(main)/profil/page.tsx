import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getServerMessages } from "@/lib/serverMessages";
import ProfilPageClient from "./ProfilPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerMessages();
  return { title: t.metadata.profile, description: t.profile.subtitle };
}

export default async function ProfilPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) {
    const t = await getServerMessages();
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
        {t.profile.userNotFound}
      </div>
    );
  }

  return <ProfilPageClient user={user} />;
}
