import { describe, expect, it } from "vitest";
import { getMinOrderText } from "@/lib/productImage";

const T = {
  moqCans: "Min. order 24 kaleng (1 karton)",
  moqPouches: "Min. order 20 pouch (1 dus)",
  moqPacks: "Min. order 10 pack (1 karton)",
  moqKg: "Min. order 10 kg",
  moqConsult: "Min. order: konsultasikan dengan tim kami",
};

describe("getMinOrderText", () => {
  it("memakai ketentuan MOQ yang memang ada untuk satuannya", () => {
    expect(getMinOrderText("pouch", T)).toBe(T.moqPouches);
    expect(getMinOrderText("pack", T)).toBe(T.moqPacks);
  });

  it("tidak mengarang angka untuk satuan yang belum ada ketentuannya", () => {
    // `ember` (SKU 4 kg) dulu jatuh ke fallback dan menampilkan "Min. order 12 ember".
    expect(getMinOrderText("ember", T)).toBe(T.moqConsult);
    expect(getMinOrderText("drum", T)).toBe(T.moqConsult);
    expect(getMinOrderText("", T)).toBe(T.moqConsult);
  });

  it("tidak pernah menyebut jumlah tanpa dasar", () => {
    for (const unit of ["ember", "krat", "pallet", ""]) {
      expect(getMinOrderText(unit, T)).not.toMatch(/\d/);
    }
  });
});
