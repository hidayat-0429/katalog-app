import { describe, expect, it } from "vitest";
import { formatText, localizeName, localizeProduct } from "@/lib/productText";

describe("formatText", () => {
  it("mengganti placeholder sesuai nama kunci", () => {
    expect(formatText("Sisa {count} dari {stock}", { count: 3, stock: 10 })).toBe(
      "Sisa 3 dari 10"
    );
  });

  it("membiarkan placeholder yang tidak dikirim supaya tidak hilang diam-diam", () => {
    expect(formatText("Halo {name}, total {total}", { name: "Toko" })).toBe(
      "Halo Toko, total {total}"
    );
  });

  it("mengganti semua kemunculan", () => {
    expect(formatText("{a}+{a}", { a: 1 })).toBe("1+1");
  });
});

describe("localizeName / localizeProduct", () => {
  const lengkap = {
    name: "Jamur Beku 1kg",
    nameEn: "Frozen Mushrooms 1kg",
    description: "Deskripsi Indonesia",
    descriptionEn: "English description",
  };

  it("memakai versi Inggris saat locale en", () => {
    expect(localizeProduct(lengkap, "en")).toEqual({
      name: "Frozen Mushrooms 1kg",
      description: "English description",
    });
  });

  it("jatuh ke bahasa Indonesia saat kolom opsional kosong atau cuma spasi", () => {
    const kosong = { name: "Jamur Kancing", nameEn: "   ", description: "Asli", descriptionEn: "" };
    expect(localizeName(kosong, "en")).toBe("Jamur Kancing");
    expect(localizeProduct(kosong, "en")).toEqual({
      name: "Jamur Kancing",
      description: "Asli",
    });
  });

  it("tidak pernah mengubah teks saat locale id", () => {
    expect(localizeProduct({ ...lengkap, nameEn: null }, "id")).toEqual({
      name: "Jamur Beku 1kg",
      description: "Deskripsi Indonesia",
    });
  });
});
