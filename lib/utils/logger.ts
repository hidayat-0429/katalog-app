/**
 * Log server-side. Di produksi sunyi kecuali ENABLE_LOGGING=true, supaya error
 * mentah tidak berakhir di log publik.
 */
const isLoggingEnabled = (): boolean => {
  if (typeof window !== "undefined") return false;
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_LOGGING === "true";
};

export function logError(message: string, error?: unknown): void {
  if (!isLoggingEnabled()) return;
  console.error(`[${new Date().toISOString()}] [ERROR]`, message, error);
}
