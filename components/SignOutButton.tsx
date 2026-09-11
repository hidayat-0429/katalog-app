"use client";

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn-ghost flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg text-stone-600 hover:text-clay hover:bg-clay/10 transition-colors"
      aria-label="Keluar"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-medium">Keluar</span>
    </button>
  );
}
