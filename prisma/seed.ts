import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminRawPassword = process.env.ADMIN_SEED_PASSWORD || "admin123";
  const adminPassword = await bcrypt.hash(adminRawPassword, 10);
  await prisma.user.upsert({
    where: { email: "admin@katalog.test" },
    update: {},
    create: {
      name: "Admin Operasional",
      email: "admin@katalog.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const buyerRawPassword = process.env.BUYER_SEED_PASSWORD || "buyer123";
  const buyerPassword = await bcrypt.hash(buyerRawPassword, 10);
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

  // 5 Kategori Resmi PT Eka Timur Raya (Etira Mushrooms)
  const catFresh = await prisma.category.upsert({
    where: { id: "cat-fresh" },
    update: { name: "Jamur Segar", description: "Jamur champignon dan portabella segar dipanen langsung dari kebun budidaya" },
    create: { id: "cat-fresh", name: "Jamur Segar", description: "Jamur champignon dan portabella segar dipanen langsung dari kebun budidaya" },
  });

  const catPouch = await prisma.category.upsert({
    where: { id: "cat-pouch" },
    update: { name: "Jamur Pouch", description: "Jamur kancing dalam larutan garam steril kemasan retort pouch fleksibel" },
    create: { id: "cat-pouch", name: "Jamur Pouch", description: "Jamur kancing dalam larutan garam steril kemasan retort pouch fleksibel" },
  });

  const catCanned = await prisma.category.upsert({
    where: { id: "cat-canned" },
    update: { name: "Jamur Kaleng", description: "Jamur olahan steril dalam kemasan kaleng metal dan botol kaca" },
    create: { id: "cat-canned", name: "Jamur Kaleng", description: "Jamur olahan steril dalam kemasan kaleng metal dan botol kaca" },
  });

  const catFrozen = await prisma.category.upsert({
    where: { id: "cat-frozen" },
    update: { name: "Jamur Beku", description: "Jamur beku segar hasil proses cepat (IQF) pada hari yang sama setelah panen" },
    create: { id: "cat-frozen", name: "Jamur Beku", description: "Jamur beku segar hasil proses cepat (IQF) pada hari yang sama setelah panen" },
  });

  const catValueAdded = await prisma.category.upsert({
    where: { id: "cat-value-added" },
    update: { name: "Olahan Siap Saji", description: "Produk olahan pangan jamur bernilai tambah siap olah & saji" },
    create: { id: "cat-value-added", name: "Olahan Siap Saji", description: "Produk olahan pangan jamur bernilai tambah siap olah & saji" },
  });

  // Produk resmi PT Eka Timur Raya
  const products = [
    // Fresh
    {
      name: "Fresh Champignon Pack 250g",
      categoryId: catFresh.id,
      price: 17500,
      unit: "pack",
      stock: 350,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur kancing segar utuh dipetik langsung dari kebun budidaya di Purwodadi di hari yang sama. Tekstur renyah dan aroma segar alami.",
    },
    {
      name: "Portabella Fresh Pack 200g",
      categoryId: catFresh.id,
      price: 28000,
      unit: "pack",
      stock: 150,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur portabella segar kualitas premium dengan tekstur padat menyerupai daging (meaty). Sangat ideal untuk steak, burger, dan panggangan hotel/restoran.",
    },
    {
      name: "Fresh Champignon Curah 5kg (Karton)",
      categoryId: catFresh.id,
      price: 245000,
      unit: "karton",
      stock: 60,
      isFeatured: false,
      imageUrl: "/hero-branding.jpg",
      description: "Kemasan karton berventilasi khusus untuk pasokan dapur hotel bintang lima, katering, dan supermarket grosir.",
    },
    // Canned
    {
      name: "Jamur Kancing Kaleng 425g (Whole)",
      categoryId: catCanned.id,
      price: 19500,
      unit: "kaleng",
      stock: 500,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur kancing utuh pilihan dalam kaleng steril kedap udara. Bebas pengawet sintetis dengan daya simpan panjang untuk efisiensi stok dapur.",
    },
    {
      name: "Jamur Slice Kaleng 425g (Iris)",
      categoryId: catCanned.id,
      price: 18500,
      unit: "kaleng",
      stock: 450,
      isFeatured: false,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur kancing iris siap saji dan siap masak. Sangat cocok sebagai bahan topping pizza, isian sup, tumisan, dan saus jamur steak.",
    },
    {
      name: "Jamur Kaleng Food Service 3kg (Can A10)",
      categoryId: catCanned.id,
      price: 98000,
      unit: "kaleng",
      stock: 200,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Kemasan kaleng metal ukuran industri (A10) 3.000 gram. Sangat ekonomis untuk industri katering besar, pabrik saus, dan restoran waralaba.",
    },
    // Pouched
    {
      name: "Jamur Slice Pouch Retort 200g",
      categoryId: catPouch.id,
      price: 12500,
      unit: "pouch",
      stock: 800,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur iris dalam larutan garam steril kemasan retort pouch fleksibel. Mudah disobek, higienis, dan hemat tempat penyimpanan gudang.",
    },
    {
      name: "Jamur Kancing Utuh Pouch 900g",
      categoryId: catPouch.id,
      price: 39000,
      unit: "pouch",
      stock: 350,
      isFeatured: false,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur kancing utuh dalam kemasan kantong pouch tebal 900 gram. Pilihan ideal untuk kebutuhan operasional dapur kafe & resto.",
    },
    {
      name: "Jamur Pouch Jumbo 2kg (Food Service)",
      categoryId: catPouch.id,
      price: 78000,
      unit: "pouch",
      stock: 280,
      isFeatured: false,
      imageUrl: "/hero-branding.jpg",
      description: "Kemasan retort pouch 2 kg untuk suplai dapur pusat (central kitchen) dan katering industri.",
    },
    // Frozen
    {
      name: "Jamur Kancing Beku IQF 1kg",
      categoryId: catFrozen.id,
      price: 34000,
      unit: "pack",
      stock: 400,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Jamur kancing segar yang dibekukan secara kilat (Individually Quick Frozen) di hari panen yang sama untuk mempertahankan nutrisi dan kesegaran rasa.",
    },
    // Value Added
    {
      name: "Nugget Jamur Kancing 500g",
      categoryId: catValueAdded.id,
      price: 32000,
      unit: "pack",
      stock: 300,
      isFeatured: true,
      imageUrl: "/hero-branding.jpg",
      description: "Camilan sehat nugget berbahan dasar jamur kancing segar, dibalut tepung roti renyah. Sumber serat dan protein vegetarian.",
    },
    {
      name: "Bakso Jamur Kancing 500g",
      categoryId: catValueAdded.id,
      price: 35000,
      unit: "pack",
      stock: 250,
      isFeatured: false,
      imageUrl: "/hero-branding.jpg",
      description: "Bakso lezat kenyal alami berbahan dasar jamur kancing pilihan, siap rebus untuk aneka sup, bakso kuah, atau olahan mie.",
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: p,
      });
    }
  }

  console.log("Seed selesai. Data dummy berhasil disinkronkan.");
  console.log("Admin: admin@katalog.test / admin123");
  console.log("Buyer: buyer@katalog.test / buyer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
