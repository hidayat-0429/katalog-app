import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@etiramushrooms.com" },
    update: {},
    create: {
      name: "Admin Operasional PT Eka Timur Raya",
      email: "admin@etiramushrooms.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Alias akun test untuk kemudahan login saat evaluasi PKN
  await prisma.user.upsert({
    where: { email: "admin@katalog.test" },
    update: {},
    create: {
      name: "Admin Etira (Demo)",
      email: "admin@katalog.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const buyerPassword = await bcrypt.hash("buyer123", 10);
  await prisma.user.upsert({
    where: { email: "buyer@katalog.test" },
    update: {},
    create: {
      name: "Budi Santoso (Purchasing Manager)",
      email: "buyer@katalog.test",
      password: buyerPassword,
      role: "BUYER",
      companyName: "CV Selera Kuliner Nusantara",
      phone: "081234567890",
      address: "Jl. Basuki Rahmat No. 45, Surabaya",
    },
  });

  // 5 Kategori Resmi PT Eka Timur Raya (Etira Mushrooms)
  const catFresh = await prisma.category.upsert({
    where: { id: "cat-fresh" },
    update: { name: "Fresh Mushrooms", description: "Jamur champignon dan portabella segar dipanen langsung dari kebun budidaya" },
    create: { id: "cat-fresh", name: "Fresh Mushrooms", description: "Jamur champignon dan portabella segar dipanen langsung dari kebun budidaya" },
  });

  const catPouch = await prisma.category.upsert({
    where: { id: "cat-pouch" },
    update: { name: "Pouched Mushrooms", description: "Jamur kancing dalam larutan garam steril kemasan retort pouch fleksibel" },
    create: { id: "cat-pouch", name: "Pouched Mushrooms", description: "Jamur kancing dalam larutan garam steril kemasan retort pouch fleksibel" },
  });

  const catCanned = await prisma.category.upsert({
    where: { id: "cat-canned" },
    update: { name: "Canned Mushrooms", description: "Jamur olahan steril dalam kemasan kaleng metal dan botol kaca" },
    create: { id: "cat-canned", name: "Canned Mushrooms", description: "Jamur olahan steril dalam kemasan kaleng metal dan botol kaca" },
  });

  const catFrozen = await prisma.category.upsert({
    where: { id: "cat-frozen" },
    update: { name: "Frozen Mushrooms", description: "Jamur beku segar hasil proses cepat (IQF) pada hari yang sama setelah panen" },
    create: { id: "cat-frozen", name: "Frozen Mushrooms", description: "Jamur beku segar hasil proses cepat (IQF) pada hari yang sama setelah panen" },
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
      imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80",
      description: "Jamur kancing segar utuh dipetik langsung dari kebun budidaya di Purwodadi di hari yang sama. Tekstur renyah dan aroma segar alami.",
    },
    {
      name: "Portabella Fresh Pack 200g",
      categoryId: catFresh.id,
      price: 28000,
      unit: "pack",
      stock: 150,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&auto=format&fit=crop&q=80",
      description: "Jamur portabella segar kualitas premium dengan tekstur padat menyerupai daging (meaty). Sangat ideal untuk steak, burger, dan panggangan hotel/restoran.",
    },
    {
      name: "Fresh Champignon Curah 5kg (Karton)",
      categoryId: catFresh.id,
      price: 245000,
      unit: "karton",
      stock: 60,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      description: "Jamur kancing utuh pilihan dalam kaleng steril kedap udara. Bebas pengawet sintetis dengan daya simpan panjang untuk efisiensi stok dapur.",
    },
    {
      name: "Jamur Slice Kaleng 425g (Iris)",
      categoryId: catCanned.id,
      price: 18500,
      unit: "kaleng",
      stock: 450,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      description: "Jamur kancing iris siap saji dan siap masak. Sangat cocok sebagai bahan topping pizza, isian sup, tumisan, dan saus jamur steak.",
    },
    {
      name: "Jamur Kaleng Food Service 3kg (Can A10)",
      categoryId: catCanned.id,
      price: 98000,
      unit: "kaleng",
      stock: 200,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      description: "Jamur iris dalam larutan garam steril kemasan retort pouch fleksibel. Mudah disobek, higienis, dan hemat tempat penyimpanan gudang.",
    },
    {
      name: "Jamur Kancing Utuh Pouch 900g",
      categoryId: catPouch.id,
      price: 39000,
      unit: "pouch",
      stock: 350,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      description: "Jamur kancing utuh dalam kemasan kantong pouch tebal 900 gram. Pilihan ideal untuk kebutuhan operasional dapur kafe & resto.",
    },
    {
      name: "Jamur Pouch Jumbo 2kg (Food Service)",
      categoryId: catPouch.id,
      price: 78000,
      unit: "pouch",
      stock: 280,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&auto=format&fit=crop&q=80",
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
      imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80",
      description: "Camilan sehat nugget berbahan dasar jamur kancing segar, dibalut tepung roti renyah. Sumber serat dan protein vegetarian.",
    },
    {
      name: "Bakso Jamur Kancing 500g",
      categoryId: catValueAdded.id,
      price: 35000,
      unit: "pack",
      stock: 250,
      isFeatured: false,
      imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80",
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

  console.log("Seed selesai. Data PT Eka Timur Raya (Etira Mushrooms) berhasil disinkronkan.");
  console.log("Admin: admin@etiramushrooms.com / admin123 (atau admin@katalog.test)");
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
