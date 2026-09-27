"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

// 45 detik: cukup cepat untuk admin yang membiarkan tab terbuka, cukup hemat
// untuk database remote yang butuh ±175 ms per bolak-balik.
const POLL_INTERVAL_MS = 45_000;

type Inbox = {
  pendingOrders: number;
  unreadMessages: number;
  lastOrderNumber: string | null;
  lastOrderAt: string | null;
};

type Permission = NotificationPermission | "unsupported";

type AdminInboxValue = Inbox & {
  total: number;
  permission: Permission;
  enableNotifications: () => void;
};

const AdminInboxContext = createContext<AdminInboxValue | null>(null);

export function useAdminInbox() {
  const ctx = useContext(AdminInboxContext);
  if (!ctx) {
    throw new Error("useAdminInbox harus dipakai di dalam AdminInboxProvider");
  }
  return ctx;
}

function readPermission(): Permission {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

// Judul tab hanya boleh membawa imbuhan "(n)" keluaran kita sendiri.
function stripUnreadPrefix(title: string) {
  return title.replace(/^\(\d+\)\s*/, "");
}

export default function AdminInboxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [inbox, setInbox] = useState<Inbox>({
    pendingOrders: 0,
    unreadMessages: 0,
    lastOrderNumber: null,
    lastOrderAt: null,
  });
  const [permission, setPermission] = useState<Permission>(readPermission);
  const lastSeenOrderAt = useRef<string | null>(null);
  const firstRender = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/inbox", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!res.ok) return;
      const data: Inbox = await res.json();

      // Pesanan dihitung "baru" kalau waktunya maju setelah data sebelumnya
      // terbaca — jadi tab yang baru dibuka tidak tiba-tiba membunyit notifikasi.
      const isNewOrder =
        !!lastSeenOrderAt.current &&
        !!data.lastOrderAt &&
        data.lastOrderAt > lastSeenOrderAt.current;

      lastSeenOrderAt.current = data.lastOrderAt;
      setInbox(data);

      if (
        isNewOrder &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification("Pesanan baru masuk", {
            body: data.lastOrderNumber
              ? `${data.lastOrderNumber} menunggu konfirmasi.`
              : "Ada pesanan baru yang menunggu konfirmasi.",
            tag: "etira-pesanan-baru",
          });
        } catch {
          // Sebagian browser menuntut Service Worker; badge tetap jalan.
        }
      }
    } catch {
      // Jaringan putus atau sesi kedaluwarsa; coba lagi pada tick berikutnya.
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Pindah halaman = ada yang sudah dibaca/diproses; ambil ulang segera
    // supaya badge tidak menunggu tick berikutnya.
    load();
  }, [pathname, load]);

  const total = inbox.pendingOrders + inbox.unreadMessages;

  useEffect(() => {
    const base = stripUnreadPrefix(document.title);
    document.title = total > 0 ? `(${total}) ${base}` : base;
  }, [total, pathname]);

  const enableNotifications = useCallback(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    Notification.requestPermission().then((result) => {
      setPermission(result);
    });
  }, []);

  return (
    <AdminInboxContext.Provider
      value={{ ...inbox, total, permission, enableNotifications }}
    >
      {children}
    </AdminInboxContext.Provider>
  );
}
