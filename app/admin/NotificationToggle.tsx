"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminInbox } from "./AdminInboxProvider";

// Browser hanya mau meminta izin notifikasi lewat gestur pengguna, jadi tombol
// ini tampil selama izin belum pernah diberikan sama sekali.
export default function NotificationToggle({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
  const { permission, enableNotifications } = useAdminInbox();
  if (permission !== "default") return null;

  return (
    <button
      type="button"
      onClick={enableNotifications}
      title="Izinkan notifikasi saat pesanan baru masuk"
      className={cn(
        "flex items-center gap-1.5 text-[11px] font-semibold text-charcoal-muted bg-neutral-100 dark:bg-neutral-800 hover:text-brand-forest-700 dark:hover:text-brand-forest-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg py-2 transition-colors duration-150 ease-out",
        iconOnly ? "justify-center w-10 h-10 px-0" : "px-3 w-full"
      )}
    >
      <Bell className="w-3.5 h-3.5 shrink-0" />
      {!iconOnly && <span className="truncate">Aktifkan notifikasi</span>}
    </button>
  );
}
