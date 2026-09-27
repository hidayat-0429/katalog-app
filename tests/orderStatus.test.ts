import { describe, expect, it } from "vitest";
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  shouldRestockOnCancel,
} from "@/lib/orderStatus";

const ALL_STATUSES = ["PENDING", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"] as const;

describe("ALLOWED_TRANSITIONS", () => {
  it("mencakup semua status pesanan", () => {
    expect(Object.keys(ALLOWED_TRANSITIONS).sort()).toEqual([...ALL_STATUSES].sort());
  });

  it("menuruti alur maju dan hanya bisa dibatalkan sebelum berangkat", () => {
    expect(ALLOWED_TRANSITIONS.PENDING).toEqual(["DIPROSES", "DIBATALKAN"]);
    expect(ALLOWED_TRANSITIONS.DIPROSES).toEqual(["DIKIRIM", "DIBATALKAN"]);
    expect(ALLOWED_TRANSITIONS.DIKIRIM).toEqual(["SELESAI"]);
    expect(ALLOWED_TRANSITIONS.SELESAI).toEqual([]);
    expect(ALLOWED_TRANSITIONS.DIBATALKAN).toEqual([]);
  });
});

describe("canTransition", () => {
  it("menolak lompat status dan mundur", () => {
    expect(canTransition("PENDING", "SELESAI")).toBe(false);
    expect(canTransition("PENDING", "DIKIRIM")).toBe(false);
    expect(canTransition("DIKIRIM", "DIPROSES")).toBe(false);
    expect(canTransition("DIKIRIM", "DIBATALKAN")).toBe(false);
  });

  it("menolak status akhir berapa pun tujuannya", () => {
    for (const from of ["SELESAI", "DIBATALKAN"] as const) {
      for (const to of ALL_STATUSES) {
        expect(canTransition(from, to)).toBe(false);
      }
    }
  });

  it("tidak pernah menganggap status yang sama sebagai transisi", () => {
    for (const status of ALL_STATUSES) {
      expect(canTransition(status, status)).toBe(false);
    }
  });
});

describe("shouldRestockOnCancel", () => {
  it("mengembalikan stok hanya untuk pesanan yang belum diberangkatkan", () => {
    expect(shouldRestockOnCancel("PENDING")).toBe(true);
    expect(shouldRestockOnCancel("DIPROSES")).toBe(true);
    expect(shouldRestockOnCancel("DIKIRIM")).toBe(false);
    expect(shouldRestockOnCancel("SELESAI")).toBe(false);
    expect(shouldRestockOnCancel("DIBATALKAN")).toBe(false);
  });
});
