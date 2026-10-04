import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Tidak ada nilai bawaan: seed yang lupa diisi variabelnya harus gagal, bukan
// malah membuat akun dengan sandi yang bisa ditebak siapa pun.
function seedPassword(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} belum diisi di .env. Seeder sengaja tidak punya sandi bawaan.`);
  }
  return value;
}

// Seeder hanya mengurus akun + kategori. Produk sengaja tidak di-seed: katalog diisi
// manual lewat panel Admin dengan data resmi PT, dan daftar produk karangan yang dulu
// ada di sini berisiko memunculkan lagi SKU palsu di database yang sudah bersih.
const categories = [
  {
    id: "cat-fresh",
    name: "Jamur Segar",
    nameEn: "Fresh Mushrooms",
    description: "Jamur champignon dan portabella segar dipanen langsung dari kebun budidaya",
  },
  {
    id: "cat-pouch",
    name: "Jamur Pouch",
    nameEn: "Pouch Mushrooms",
    description: "Jamur kancing dalam larutan garam steril kemasan retort pouch fleksibel",
  },
  {
    id: "cat-canned",
    name: "Jamur Kaleng",
    nameEn: "Canned Mushrooms",
    description: "Jamur olahan steril dalam kemasan kaleng metal dan botol kaca",
  },
  {
    id: "cat-frozen",
    name: "Jamur Beku",
    nameEn: "Frozen Mushrooms",
    description: "Jamur beku segar hasil proses cepat (IQF) pada hari yang sama setelah panen",
  },
  {
    id: "cat-value-added",
    name: "Olahan Siap Saji",
    nameEn: "Ready-to-Eat Products",
    description: "Produk olahan pangan jamur bernilai tambah siap olah & saji",
  },
];

async function main() {
  const adminPassword = await bcrypt.hash(seedPassword("ADMIN_SEED_PASSWORD"), 10);
  await prisma.user.upsert({
    where: { email: "admin@etiramushrooms.com" },
    update: {},
    create: {
      name: "Admin Operasional PT Eka Timur Raya",
      email: "admin@etiramushrooms.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const buyerPassword = await bcrypt.hash(seedPassword("BUYER_SEED_PASSWORD"), 10);
  await prisma.user.upsert({
    where: { email: "buyer@katalog.test" },
    update: {},
    create: {
      name: "Purchasing Manager",
      email: "buyer@katalog.test",
      password: buyerPassword,
      role: "BUYER",
      companyName: "Restaurant & Catering Network",
      phone: "081234567890",
      address: "Jl. Kota Industri No. 45",
    },
  });

  // update: {} berarti kategori yang sudah ada tidak ditimpa, supaya hasil edit
  // admin di database live tetap utuh kalau seed dijalankan lagi.
  for (const category of categories) {
    await prisma.category.upsert({ where: { id: category.id }, update: {}, create: category });
  }

  console.log("Seed selesai: 2 akun + 5 kategori. Produk tidak dibuat — isi lewat panel Admin.");
  console.log("Admin: admin@etiramushrooms.com (sandi dari ADMIN_SEED_PASSWORD, kecuali akunnya sudah ada)");
  console.log("Buyer: buyer@katalog.test (sandi dari BUYER_SEED_PASSWORD, kecuali akunnya sudah ada)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
