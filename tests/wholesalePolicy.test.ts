import { describe, expect, it } from "vitest";
import id from "@/messages/id.json";
import en from "@/messages/en.json";

// PT tidak melayani eceran: katalog ini khusus grosir & HoReCa. Angka MOQ yang dulu
// tampil per satuan (24 kaleng, 20 pouch, 10 pack, 10 kg) adalah karangan kita,
// bukan ketentuan resmi, jadi semuanya disapu ke jalur konsultasi.
describe("kebijakan khusus grosir", () => {
  it("kunci MOQ karangan sudah hilang dari kedua bahasa", () => {
    for (const catalog of [id, en]) {
      for (const key of ["moqCans", "moqPouches", "moqPacks", "moqKg", "moqConsult"]) {
        expect(key in catalog.productCard).toBe(false);
      }
    }
  });

  it("tidak ada teks min. order yang menyebut angka", () => {
    for (const catalog of [id, en]) {
      for (const [key, value] of Object.entries(catalog.productCard)) {
        if (/min\.?\s*order/i.test(value)) {
          expect(value, `productCard.${key}`).not.toMatch(/\d/);
        }
      }
    }
  });

  it("kartu produk dan checkout membawa pesan kebijakan grosir di kedua bahasa", () => {
    for (const catalog of [id, en]) {
      expect(catalog.productCard.wholesaleNote).toMatch(/grosir|wholesale/i);
      expect(catalog.checkout.wholesaleNotice).toMatch(/grosir|wholesale/i);
      expect(catalog.checkout.wholesaleAck.length).toBeGreaterThan(0);
      expect(catalog.server.wholesaleAckRequired.length).toBeGreaterThan(0);
    }
  });
});
