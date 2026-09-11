# Sistem Katalog & Pemesanan B2B
**Studi Kasus PKN:** PT Eka Timur Raya (Etira Mushrooms)

Sistem Informasi Manajemen Katalog dan Pemesanan Grosir (Business-to-Business) berbasis web. Sistem ini dirancang untuk memfasilitasi klien B2B (hotel, restoran, katering, dan industri) dalam memesan pasokan jamur segar dan olahan langsung dari pabrik.

## 🚀 Teknologi yang Digunakan (Tech Stack)
- **Framework:** Next.js 14 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Autentikasi:** NextAuth.js v4

## ✨ Fitur Unggulan
- **Role-Based Access Control (RBAC):** Pemisahan hak akses dan dasbor khusus untuk Admin (pengelola) dan Buyer (klien).
- **Kalkulator Konversi Grosir:** Penghitungan otomatis dari satuan ecer (kaleng/pouch/pack) ke satuan grosir (Karton/Dus) secara *real-time* saat *checkout*.
- **Opsi Armada Logistik:** Pilihan metode pengiriman spesifik komoditas (Armada Berpendingin Cold Chain, Kargo Kering, atau Ambil di Pabrik).
- **Manajemen Pesanan Atomik:** Sistem checkout terintegrasi yang mencegah *race-condition* pada stok barang (*overselling*).
- **Faktur Siap Cetak (Printable Invoice):** Laman khusus pesanan yang terformat rapi untuk dicetak sebagai dokumen pengiriman.
- **Ekspor Laporan (CSV):** Admin dapat mengunduh rekapan data pesanan ke dalam format `.csv` dengan *encoding* BOM UTF-8 yang sepenuhnya kompatibel dengan Microsoft Excel.
- **Integrasi WhatsApp:** *Auto-generate* pesan rincian belanja klien yang dikirim langsung ke *hotline* WhatsApp perusahaan.

## 🛠️ Cara Menjalankan di Lingkungan Lokal (Development)

**1. Install dependensi**
```bash
npm install
```

**2. Setup Environment Variables**
Salin `env.example` menjadi `.env`, lalu konfigurasikan:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="secret-key-acak-minimal-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
```

**3. Pengisian Data Awal (Seeding)**
Jalankan perintah berikut untuk mengisi database dengan 5 Kategori Resmi dan 12 Produk Etira:
```bash
npm run seed
```

**4. Akun Demo untuk Uji Coba**
Setelah proses *seed* selesai, Anda dapat masuk menggunakan akun berikut:
- **Admin:** `admin@etiramushrooms.com` / Password: `admin123`
- **Buyer (Klien):** `buyer@katalog.test` / Password: `buyer123`

**5. Jalankan Server Development**
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Struktur Direktori Utama
- `app/` → Konfigurasi App Router Next.js (halaman publik & privat)
- `app/admin/` → Dasbor dan manajemen khusus Admin (produk, kategori, pesanan, ekspor)
- `app/keranjang/` → Modul pemesanan dan formulir *checkout*
- `components/` → Komponen antarmuka yang dapat digunakan kembali (*reusable UI*)
- `lib/actions/` → Server Actions untuk logika mutasi data (Create/Update/Delete)
- `prisma/` → Skema basis data dan skrip pengisian data (*seeder*)

---
*Proyek ini dikembangkan sebagai pemenuhan tugas Praktik Kerja Nyata (PKN) Program Studi Teknik Informatika.*
