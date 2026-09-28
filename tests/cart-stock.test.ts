import { beforeEach, describe, expect, it, vi } from "vitest";

// Semua tes ini memakai Prisma palsu: database production masih live, jadi
// jalur tulis tidak boleh benar-benar dijalankan di tes.
const mocks = vi.hoisted(() => {
  const tx = {
    product: { updateMany: vi.fn() },
    order: { create: vi.fn() },
    cart: { deleteMany: vi.fn() },
  };
  return {
    tx,
    prisma: {
      product: { findUnique: vi.fn() },
      user: { findUnique: vi.fn() },
      cart: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        upsert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
      },
      $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
    },
    requireUser: vi.fn(),
    redirect: vi.fn(),
  };
});

vi.mock("@/lib/prisma", () => ({ prisma: mocks.prisma }));
vi.mock("@/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/serverMessages", async () => {
  const module = await import("@/messages/id.json");
  const messages = (module as { default?: unknown }).default ?? module;
  return {
    getServerMessages: async () => messages,
    getServerLocale: async () => "id",
  };
});

import { SHIPPING_METHODS } from "@/lib/orderNotes";
import { addToCart, checkout, updateCartItem } from "@/lib/actions/cart";

const produk = {
  id: "p1",
  name: "Jamur Beku 1kg",
  price: 95000,
  stock: 10,
  isActive: true,
};

function formData(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const alamatSah = "Jl. Raya Nongkojajar KM 1.4, Pasuruan";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireUser.mockResolvedValue({ id: "u1" });
  mocks.prisma.user.findUnique.mockResolvedValue({
    id: "u1",
    name: "Pembeli",
    email: "u@a.test",
    phone: null,
    companyName: null,
  });
  mocks.prisma.$transaction.mockImplementation((fn: (t: typeof mocks.tx) => unknown) =>
    fn(mocks.tx)
  );
  mocks.tx.product.updateMany.mockResolvedValue({ count: 1 });
  mocks.tx.order.create.mockResolvedValue({ id: "o1" });
});

describe("addToCart", () => {
  it("menolak produk yang tidak aktif tanpa menyentuh keranjang", async () => {
    mocks.prisma.product.findUnique.mockResolvedValue({ ...produk, isActive: false });
    await expect(addToCart("p1", 1)).resolves.toEqual({ error: "Produk tidak tersedia" });
    expect(mocks.prisma.cart.upsert).not.toHaveBeenCalled();
  });

  it("menolak jumlah nol", async () => {
    mocks.prisma.product.findUnique.mockResolvedValue(produk);
    await expect(addToCart("p1", 0)).resolves.toEqual({ error: "Jumlah minimal 1" });
  });

  it("menyebut sisa stok kalau tambahannya melewati stok", async () => {
    mocks.prisma.product.findUnique.mockResolvedValue({ ...produk, stock: 10 });
    mocks.prisma.cart.findUnique.mockResolvedValue({ quantity: 8 });
    await expect(addToCart("p1", 5)).resolves.toEqual({
      error: "Hanya dapat menambahkan 2 lagi ke keranjang (stok tersedia: 10)",
    });
    expect(mocks.prisma.cart.upsert).not.toHaveBeenCalled();
  });

  it("menyebut batas stok kalau keranjang sudah penuh", async () => {
    mocks.prisma.product.findUnique.mockResolvedValue({ ...produk, stock: 10 });
    mocks.prisma.cart.findUnique.mockResolvedValue({ quantity: 10 });
    const result = await addToCart("p1", 1);
    expect(result).toEqual({
      error: "Jumlah di keranjang sudah mencapai batas stok tersedia (10)",
    });
  });

  it("menambah lewat increment saat stok cukup", async () => {
    mocks.prisma.product.findUnique.mockResolvedValue(produk);
    mocks.prisma.cart.findUnique.mockResolvedValue({ quantity: 3 });
    await expect(addToCart("p1", 2)).resolves.toEqual({ success: true });
    expect(mocks.prisma.cart.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { quantity: { increment: 2 } },
        create: { userId: "u1", productId: "p1", quantity: 2 },
      })
    );
  });
});

describe("updateCartItem", () => {
  it("menolak item milik pembeli lain", async () => {
    mocks.prisma.cart.findUnique.mockResolvedValue({ id: "c1", userId: "u2", product: produk });
    await expect(updateCartItem("c1", 2)).resolves.toEqual({ error: "Item tidak ditemukan" });
    expect(mocks.prisma.cart.update).not.toHaveBeenCalled();
  });

  it("menghapus baris saat jumlah diturunkan di bawah satu", async () => {
    mocks.prisma.cart.findUnique.mockResolvedValue({ id: "c1", userId: "u1", product: produk });
    await expect(updateCartItem("c1", 0)).resolves.toEqual({ success: true });
    expect(mocks.prisma.cart.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
    expect(mocks.prisma.cart.update).not.toHaveBeenCalled();
  });

  it("menolak jumlah di atas stok", async () => {
    mocks.prisma.cart.findUnique.mockResolvedValue({ id: "c1", userId: "u1", product: produk });
    await expect(updateCartItem("c1", 11)).resolves.toEqual({
      error: "Jumlah melebihi stok tersedia",
    });
    expect(mocks.prisma.cart.update).not.toHaveBeenCalled();
  });
});

describe("checkout", () => {
  it("memeriksa panjang alamat sebelum membaca keranjang", async () => {
    const result = await checkout(formData({ shippingAddress: "Pendek" }));
    expect(result).toEqual({
      error: "Alamat terlalu pendek (minimal 10 karakter)",
    });
    expect(mocks.prisma.cart.findMany).not.toHaveBeenCalled();
  });

  it("berhenti sebelum transaksi saat salah satu item melewati stok", async () => {
    mocks.prisma.cart.findMany.mockResolvedValue([
      { productId: "p1", quantity: 50, product: { ...produk, stock: 10 } },
    ]);
    const result = await checkout(formData({ shippingAddress: alamatSah }));
    expect(result?.error).toContain("Jamur Beku 1kg");
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled();
  });

  it("membatalkan pesanan kalau pengurangan stok bersyarat gagal", async () => {    mocks.prisma.cart.findMany.mockResolvedValue([
      { productId: "p1", quantity: 4, product: produk },
    ]);
    // Stok sudah keburu dipakai pembeli lain di perjalanan.
    mocks.tx.product.updateMany.mockResolvedValue({ count: 0 });

    const result = await checkout(formData({ shippingAddress: alamatSah }));
    expect(result?.error).toContain("Jamur Beku 1kg");
    expect(mocks.tx.order.create).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("memakai metode pengiriman bawaan kalau nilainya asing", async () => {    mocks.prisma.cart.findMany.mockResolvedValue([
      { productId: "p1", quantity: 2, product: produk },
    ]);

    await checkout(
      formData({ shippingAddress: alamatSah, shippingMethod: "Kirim pakai ojek", notes: "" })
    );

    const payload = mocks.tx.order.create.mock.calls[0][0].data;
    expect(payload.notes).toBe(`[Armada: ${SHIPPING_METHODS[0].value}]`);
    expect(payload.totalPrice).toBe(190000);
    expect(payload.items.create[0]).toEqual({
      productId: "p1",
      productName: "Jamur Beku 1kg",
      price: 95000,
      quantity: 2,
      subtotal: 190000,
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/pesanan/o1");
  });
});
