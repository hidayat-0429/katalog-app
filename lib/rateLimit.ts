// Pembatas laju sederhana berbasis memori proses. Tidak ada store bersama,
// jadi tiap instance menghitung sendiri — cukup untuk meredam bot dan tebak
// password, bukan untuk serangan terdistribusi.

type Bucket = { windowMs: number; max: number };

const globalStore = globalThis as unknown as {
  rateLimitHits?: Map<string, Map<string, number[]>>;
};

const stores = globalStore.rateLimitHits ?? (globalStore.rateLimitHits = new Map());

const MAX_KEYS_PER_BUCKET = 5000;

export const RATE_LIMITS = {
  contact: { windowMs: 10 * 60 * 1000, max: 5 },
  register: { windowMs: 60 * 60 * 1000, max: 5 },
  loginEmail: { windowMs: 15 * 60 * 1000, max: 8 },
  loginIp: { windowMs: 15 * 60 * 1000, max: 30 },
  changePassword: { windowMs: 15 * 60 * 1000, max: 5 },
} satisfies Record<string, Bucket>;

function hitsFor(name: keyof typeof RATE_LIMITS): Map<string, number[]> {
  const existing = stores.get(name);
  if (existing) return existing;
  const created: Map<string, number[]> = new Map();
  stores.set(name, created);
  return created;
}

export function isRateLimited(name: keyof typeof RATE_LIMITS, key: string) {
  const { windowMs, max } = RATE_LIMITS[name];
  const bucket = hitsFor(name);
  const now = Date.now();
  const recent = (bucket.get(key) ?? []).filter((ts) => now - ts < windowMs);

  if (recent.length >= max) {
    bucket.set(key, recent);
    return true;
  }

  recent.push(now);
  bucket.set(key, recent);

  if (bucket.size > MAX_KEYS_PER_BUCKET) {
    for (const [bucketKey, timestamps] of bucket) {
      if (!timestamps.some((ts) => now - ts < windowMs)) bucket.delete(bucketKey);
    }
  }

  return false;
}

export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local"
  ).slice(0, 45);
}
