import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import id from "@/messages/id.json";

// Daun = kunci sampai nilai teks, termasuk tiap butir larik, supaya kedua kamus
// benar-benar dibandingkan butir per butir.
function leafKeys(obj: unknown, prefix = ""): { key: string; value: string }[] {
  if (typeof obj === "string") return [{ key: prefix, value: obj }];
  if (Array.isArray(obj)) {
    return obj.flatMap((item, i) => leafKeys(item, `${prefix}[${i}]`));
  }
  if (!obj || typeof obj !== "object") {
    return [{ key: prefix, value: JSON.stringify(obj) }];
  }
  return Object.entries(obj).flatMap(([name, child]) =>
    leafKeys(child, prefix ? `${prefix}.${name}` : name)
  );
}

function placeholders(value: string) {
  return (value.match(/\{\w+\}/g) ?? []).sort();
}

const idLeaves = leafKeys(id);
const enLeaves = leafKeys(en);

describe("paritas kamus id/en", () => {
  it("kedua bahasa punya kunci yang sama persis", () => {
    const idKeys = idLeaves.map((l) => l.key).sort();
    const enKeys = enLeaves.map((l) => l.key).sort();
    expect(enKeys.filter((k) => !idKeys.includes(k))).toEqual([]);
    expect(idKeys.filter((k) => !enKeys.includes(k))).toEqual([]);
    expect(enKeys.length).toBe(idKeys.length);
  });

  it("tidak ada nilai kosong kecuali yang memang sengaja tanpa kata", () => {
    // Bahasa Indonesia menaruh satuan di depan, jadi sufiksnya kosong:
    // "Tersisa 10 pack" lawan "10 pack left".
    const sengajaKosong = ["productCard.remainingSuffix"];
    const kosong = [...idLeaves, ...enLeaves]
      .filter((l) => l.value.trim() === "")
      .map((l) => l.key);

    expect([...kosong].sort()).toEqual([...sengajaKosong].sort());
  });

  it("placeholder teks sama di kedua bahasa", () => {
    const enByKey = new Map(enLeaves.map((l) => [l.key, l.value]));
    const beda = idLeaves
      .filter((leaf) => {
        const english = enByKey.get(leaf.key);
        if (english === undefined) return false;
        return placeholders(leaf.value).join(",") !== placeholders(english).join(",");
      })
      .map((leaf) => leaf.key);
    expect(beda).toEqual([]);
  });

  it("tidak ada kunci yang cuma beda huruf besar", () => {
    const seen = new Map<string, string>();
    const tabrakan: string[] = [];
    for (const key of idLeaves.map((l) => l.key)) {
      const lower = key.toLowerCase();
      const previous = seen.get(lower);
      if (previous && previous !== key) tabrakan.push(`${previous} vs ${key}`);
      seen.set(lower, key);
    }
    expect(tabrakan).toEqual([]);
  });
});
