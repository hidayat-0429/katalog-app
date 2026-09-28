'use client';

import { UserCircle2 } from "lucide-react";
import Container from "@/components/Container";
import ProfilForm from "./ProfilForm";
import PasswordForm from "./PasswordForm";
import { useTranslations } from "@/hooks/useTranslations";

interface ProfilPageClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    companyName: string | null;
    phone: string | null;
    address: string | null;
  };
}

export default function ProfilPageClient({ user }: ProfilPageClientProps) {
  const t = useTranslations();

  return (
    <Container className="py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.profile.title}
        </h1>
        <p className="font-sans text-sm text-charcoal-muted mt-1">
          {t.profile.subtitle}
        </p>
      </div>

      {/* Avatar + info ringkas */}
      <div className="bg-surface border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-forest-100 dark:bg-brand-forest-900/30 flex items-center justify-center shrink-0">
          <UserCircle2 className="w-7 h-7 text-brand-forest-600 dark:text-brand-forest-400" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
          <p className="text-xs text-charcoal-muted truncate">{user.email}</p>
          {user.companyName && (
            <p className="text-xs text-charcoal-muted mt-0.5">{user.companyName}</p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6">
        <ProfilForm user={user} />
      </div>

      {/* Kata sandi */}
      <div className="bg-surface border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 sm:p-6 mt-6">
        <PasswordForm />
      </div>
    </Container>
  );
}
