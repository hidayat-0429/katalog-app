"use client";

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={
        iconOnly
          ? "flex items-center justify-center w-10 h-10 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 ease-out"
          : "w-full flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 ease-out"
      }
      aria-label="Keluar"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {!iconOnly && <span className="font-medium">Keluar</span>}
    </button>
  );
}