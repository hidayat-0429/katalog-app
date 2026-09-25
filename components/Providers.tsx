"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
  onUndo?: () => void | Promise<void>;
}

interface ToastContextValue {
  toast: (msg: string, options?: { type?: "success" | "error"; onUndo?: () => void | Promise<void> }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (msg: string, options?: { type?: "success" | "error"; onUndo?: () => void | Promise<void> }) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message: msg, type: options?.type ?? "success", onUndo: options?.onUndo }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-2 rounded shadow-md text-sm pointer-events-auto ${
              t.type === "success" ? "bg-semantic-success-light text-semantic-success-dark" : "bg-semantic-danger-light text-semantic-danger-dark"
            }`}
          >
            <span className="flex-1">{t.message}</span>
            {t.onUndo && (
              <button
                onClick={async () => {
                  await t.onUndo?.();
                  removeToast(t.id);
                }}
                className="text-xs underline hover:text-opacity-80"
              >
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.toast;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
