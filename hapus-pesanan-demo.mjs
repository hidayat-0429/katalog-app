// Hapus riwayat pesanan MIL DEMO BUYER saja, dengan cadangan + konfirmasi.
// Lihat dulu:   node --env-file=.env hapus-pesanan-demo.mjs
// Jalankan:     node --env-file=.env hapus-pesanan-demo.mjs --jalan
import fs from "node:fs";
import readline from "node:readline/promises";
import { PrismaClient } from "@prisma/client";

const EMAIL_DEMO = "buyer@katalog.test";
const mauJalan = process.argv.includes("--jalan");
const p = new PrismaClient();

const orders = await p.order.findMany({
  where: { OR: [{ buyerEmail: EMAIL_DEMO }, { user: { email: EMAIL_DEMO } }] },
  include: { user: { select: { email: true } }, items: true },
  orderBy: { createdAt: "asc" },
});

// Pengaman: tidak boleh ada pesanan milik akun lain yang ikut terbawa.
const milikLain = orders.filter((o) => o.user.email !== EMAIL_DEMO && o.buyerEmail !== EMAIL_DEMO);
if (milikLain.length > 0) {
  console.log("BERHENTI: ada pesanan di luar akun demo, tidak jadi menghapus apa pun.");
  console.log(milikLain.map((o) => `${o.orderNumber} -> ${o.user.email}`));
  await p.$disconnect();
  process.exit(1);
}

console.log(`Ketemu ${orders.length} pesanan milik ${EMAIL_DEMO}:`);
let totalPerProduk = {};
for (const o of orders) {
  console.log(`  ${o.orderNumber} | ${o.status} | ${o.createdAt.toISOString().slice(0, 10)} | ${o.items.length} item | Rp ${o.totalPrice}`);
  // SELESAI = stok benar-benar keluar dan belum dikembalikan.
  if (o.status === "SELESAI") {
    for (const it of o.items) totalPerProduk[it.productName] = (totalPerProduk[it.productName] || 0) + it.quantity;
  }
}
const jumlahItem = orders.reduce((t, o) => t + o.items.length, 0);
console.log(`Akan dihapus: ${orders.length} Order + ${jumlahItem} OrderItem. Produk dan akun TIDAK disentuh.`);
console.log(`Stok TIDAK diubah oleh skrip ini. Konsumsi stok dari pesanan SELESAI: ${JSON.stringify(totalPerProduk)}`);

if (!mauJalan) {
  console.log("\nIni BARU pratinjau. Tambahkan --jalan untuk benar-benar menghapus.");
  await p.$disconnect();
  process.exit(0);
}

const jawab = await (await readline.createInterface({ input: process.stdin, output: process.stdout }))
  .question(`\nKetik HAPUS untuk lanjut (${orders.length} pesanan akan hilang permanen): `);
if (jawab.trim() !== "HAPUS") {
  console.log("Batal, tidak ada yang berubah.");
  await p.$disconnect();
  process.exit(0);
}

const cadangan = `prisma/backup-pesanan-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
fs.writeFileSync(cadangan, JSON.stringify(orders, null, 2));
console.log(`Cadangan ditulis ke ${cadangan}`);

const idOrder = orders.map((o) => o.id);
const idItem = orders.flatMap((o) => o.items.map((i) => i.id));
await p.$transaction([
  p.orderItem.deleteMany({ where: { id: { in: idItem } } }),
  p.order.deleteMany({ where: { id: { in: idOrder } } }),
]);

console.log("Selesai. Sisa sekarang:", {
  Order: await p.order.count(),
  OrderItem: await p.orderItem.count(),
  Product: await p.product.count(),
  User: await p.user.count(),
});
await p.$disconnect();
