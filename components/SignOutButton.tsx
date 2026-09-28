"use client";

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton({ iconOnly = false, label = "Keluar" }: { iconOnly?: boolean; label?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={
        iconOnly
          ? "relative flex items-center justify-center w-10 h-10 rounded-lg text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 ease-out after:absolute after:-inset-1 after:content-['']"
          : "relative w-full flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-lg text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 ease-out after:absolute after:-inset-y-1 after:inset-x-0 after:content-['']"
      }
      aria-label={label}
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {!iconOnly && <span className="font-medium">{label}</span>}
    </button>
  );
}