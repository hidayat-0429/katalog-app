import { describe, expect, it } from "vitest";
import { SHIPPING_METHODS, fleetLabelKey, parseOrderNotes } from "@/lib/orderNotes";

const armada = SHIPPING_METHODS[0].value;

describe("parseOrderNotes", () => {
  it("mengurai catatan persis seperti checkout() menyimpannya", () => {
    expect(parseOrderNotes(`[Armada: ${armada}] - Catatan: Mohon kirim pagi`)).toEqual({
      fleetValue: armada,
      comment: "Mohon kirim pagi",
    });
  });

  it("mengurai versi tanpa catatan bebas", () => {
    expect(parseOrderNotes(`[Armada: ${armada}]`)).toEqual({
      fleetValue: armada,
      comment: null,
    });
  });

  it("membiarkan catatan lama yang tidak pakai penanda armada", () => {
    expect(parseOrderNotes("Titip ke resepsionis")).toEqual({
      fleetValue: null,
      comment: "Titip ke resepsionis",
    });
  });

  it("menangani notes kosong dan multiline", () => {
    expect(parseOrderNotes(null)).toEqual({ fleetValue: null, comment: null });
    expect(parseOrderNotes("")).toEqual({ fleetValue: null, comment: null });
    expect(parseOrderNotes(`[Armada: ${armada}] - Catatan: baris satu\nbaris dua`)).toEqual({
      fleetValue: armada,
      comment: "baris satu\nbaris dua",
    });
  });
});

describe("fleetLabelKey", () => {
  it("hanya kenal tiga metode pengiriman bawaan", () => {
    expect(SHIPPING_METHODS.map((m) => fleetLabelKey(m.value))).toEqual([
      "coldChain",
      "dryFleet",
      "selfPickup",
    ]);
    expect(fleetLabelKey("Kirim pakai ojek")).toBeNull();
  });
});
