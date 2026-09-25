'use client';

import { UserCircle2 } from "lucide-react";
import ProfilForm from "./ProfilForm";
import { useTranslations } from "@/hooks/useTranslations";
import { User } from "@prisma/client";

interface ProfilPageClientProps {
  user: User;
}

export default function ProfilPageClient({ user }: ProfilPageClientProps) {
  const t = useTranslations();

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.profile.title}
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {t.profile.subtitle}
        </p>
      </div>

      {/* Avatar + info ringkas */}
      <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-forest-100 dark:bg-brand-forest-900/30 flex items-center justify-center shrink-0">
          <UserCircle2 className="w-7 h-7 text-brand-forest-600 dark:text-brand-forest-400" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
          {user.companyName && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{user.companyName}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6">
        <ProfilForm user={user} />
      </div>
    </div>
  );
}
