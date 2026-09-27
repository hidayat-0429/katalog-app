import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RATE_LIMITS, clientIp, isRateLimited } from "@/lib/rateLimit";

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("meloloskan tepat sampai batas lalu menolak sisanya", () => {
    const key = "login-ip-limit";
    for (let i = 0; i < RATE_LIMITS.loginIp.max; i++) {
      expect(isRateLimited("loginIp", key)).toBe(false);
    }
    expect(isRateLimited("loginIp", key)).toBe(true);
  });

  it("memisahkan hitungan per key", () => {
    for (let i = 0; i < RATE_LIMITS.register.max; i++) {
      expect(isRateLimited("register", "register@a.test")).toBe(false);
    }
    expect(isRateLimited("register", "register@a.test")).toBe(true);
    expect(isRateLimited("register", "register@b.test")).toBe(false);
  });

  it("membuka kembali setelah jendela waktu lewat", () => {
    const key = "contact-window";
    for (let i = 0; i < RATE_LIMITS.contact.max; i++) isRateLimited("contact", key);
    expect(isRateLimited("contact", key)).toBe(true);

    vi.advanceTimersByTime(RATE_LIMITS.contact.windowMs + 1);
    expect(isRateLimited("contact", key)).toBe(false);
  });

  it("memakai jendela bergeser, bukan counter yang tak pernah habis", () => {
    const key = "contact-sliding";
    for (let i = 0; i < 3; i++) expect(isRateLimited("contact", key)).toBe(false);

    // Hit pertama masih berusia 6 menit, jadi kuota 5 masih penuh.
    vi.advanceTimersByTime(6 * 60 * 1000);
    expect(isRateLimited("contact", key)).toBe(false);
    expect(isRateLimited("contact", key)).toBe(false);
    expect(isRateLimited("contact", key)).toBe(true);

    // Setelah 11 menit dari mulai, tiga hit pertama kedaluwarsa.
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(isRateLimited("contact", key)).toBe(false);
  });

  it("menandai hit yang ditolak supaya tidak jadi jendela tak berujung", () => {
    const key = "contact-denied";
    for (let i = 0; i < RATE_LIMITS.contact.max; i++) isRateLimited("contact", key);
    expect(isRateLimited("contact", key)).toBe(true);

    // Hanya hit yang diterima yang dihitung, jadi sisa jendela tetap jalan.
    vi.advanceTimersByTime(RATE_LIMITS.contact.windowMs - 1000);
    expect(isRateLimited("contact", key)).toBe(true);
    vi.advanceTimersByTime(2000);
    expect(isRateLimited("contact", key)).toBe(false);
  });
});

describe("clientIp", () => {
  it("memakai alamat pertama dari x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": " 203.0.113.7, 70.41.3.18" });
    expect(clientIp(headers)).toBe("203.0.113.7");
  });

  it("jatuh ke x-real-ip lalu 'local' kalau tidak ada header", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
    expect(clientIp(new Headers())).toBe("local");
  });

  it("memotong nilai panjang supaya tidak jadi kunci tak terbatas", () => {
    const headers = new Headers({ "x-forwarded-for": "x".repeat(120) });
    expect(clientIp(headers)).toHaveLength(45);
  });
});
